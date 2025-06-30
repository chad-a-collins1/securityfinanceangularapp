import {  Component, computed, signal, effect, inject, OnInit } from '@angular/core';
import { CommonModule }                  from '@angular/common';
import { Router, RouterModule }          from '@angular/router';
import { FormsModule }                   from '@angular/forms';
import { ApiService, SessionService }    from '../../services';
import { Item, OrderItemDto }            from '../../models';

@Component({
  standalone : true,
  selector   : 'app-order',
  imports    : [CommonModule, RouterModule, FormsModule],
  templateUrl: './order.html',
})
export class OrderComponent implements OnInit {

  readonly items       = signal<Item[]>([]);
  readonly selections  = signal<{ selected: boolean; qty: number; name: string }[]>([]);

  // This is lazy loaded so I added the effect to the constructor so (items, selections) are tracked from the start. 
  readonly total = computed(() => {
    const items       = this.items();
    const selections  = this.selections();

    return items.reduce((sum, item, i) => {
      const sel = selections[i];
      if (!sel?.selected) { return sum; }

      const price = Number(item.price) || 0;
      const qty   = Number(sel.qty)    || 0;

      return sum + price * qty;
    }, 0);
  });

  
  private readonly api      = inject(ApiService);
  private readonly session  = inject(SessionService);
  private readonly router   = inject(Router);

  constructor() {
        effect(() => this.total());
  }


  ngOnInit(): void {

    this.api.getItems().subscribe(items => {
        this.items.set(items);
        this.selections.set(
          items.map(() => ({ selected: false, qty: 1, name: '' }))
        );
      });


  }


  hasSelection() {
    return this.selections().some(s => s.selected);
  }

  getSelection(index: number) {
    return this.selections()[index];
  }

  updateSelection(index: number, field: 'selected' | 'qty', value: boolean | number) {
    const copy = [...this.selections()];
    copy[index] = { ...copy[index], [field]: value };
    this.selections.set(copy);
  }

  onCheckboxChange(event: Event, index: number) {
    const target = event.target as HTMLInputElement;
    this.updateSelection(index, 'selected', target.checked);
  }

  onQtyChange(event: Event, index: number) {
    const target = event.target as HTMLInputElement;
    this.updateSelection(index, 'qty', target.valueAsNumber);
  }

  backToOrders(): void {
    this.router.navigate(['/orders']);
  }
  
  submit(): void {
    if (!this.session.customer) {
      console.warn('No customer logged in');
      return;
    }

    const orderItems: OrderItemDto[] = this.items().flatMap((item, i) => {
      const sel = this.selections()[i];
      return sel.selected ? [{ orderItemId: item.id, itemId: item.id, quantity: sel.qty, name: sel.name }] : [];
    });

    if (!orderItems.length) {
      console.warn('No items selected.');
      return;
    }

    const orderPayload = {
      customerId: this.session.customer.id,
      orderItems
    };

    console.log('Order Payload:', orderPayload);

    this.api.createOrder(orderPayload).subscribe({
      next : () => this.router.navigate(['/orders']),
      error: err => console.error('API call failed:', err),
    });
  }
}
