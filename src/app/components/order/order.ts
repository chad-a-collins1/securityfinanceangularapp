import { Component, computed, inject, signal, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ApiService, SessionService } from '../../services';
import { Item, OrderItemDto } from '../../models';
import { FormsModule } from '@angular/forms';


@Component({
  standalone: true,
  selector: 'app-order',
  imports: [CommonModule, RouterModule,FormsModule],


  template: `
    <div class="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <h2 class="text-2xl font-bold mb-6 text-center">🛒 Place Your Order</h2>

      <ng-container *ngIf="!items().length; else list">
        <p class="text-gray-500 text-center">Loading items...</p>
      </ng-container>

      <ng-template #list>
        <div class="text-lg font-semibold mb-4 text-right">
          Total: <span class="text-green-600">{{ total() | currency }}</span>
        </div>

        <form (ngSubmit)="submit()" class="space-y-4">
          <div *ngFor="let item of items(); let i = index" class="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition">
            <div class="flex items-center gap-3">
              <input type="checkbox"
                     class="accent-blue-600 w-5 h-5"
                     [checked]="getSelection(i).selected"
                     (change)="onCheckboxChange($event, i)"
                     name="sel{{i}}" />
              <div>
                <div class="font-medium">{{ item.name }}</div>
                <div class="text-sm text-gray-500">{{ item.price | currency }}</div>
              </div>
            </div>

            <input type="number"
                   class="w-20 text-right border rounded px-2 py-1 focus:outline-none focus:ring focus:border-blue-500"
                   min="1"
                   [value]="getSelection(i).qty"
                   (input)="onQtyChange($event, i)"
                   name="qty{{i}}"
                   [disabled]="!getSelection(i).selected" />
          </div>

          <button type="submit"
                  class="w-full py-2 px-4 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 disabled:opacity-50"
                  [disabled]="!hasSelection()">
            Submit Order
          </button>
        </form>
      </ng-template>
    </div>
  `,
})
export class OrderComponent {
  private api = inject(ApiService);
  private session = inject(SessionService);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  items = signal<Item[]>([]);
  selections = signal<{ selected: boolean; qty: number }[]>([]);

  total = computed(() =>
    this.items().reduce((sum, item, i) => {
      const sel = this.selections()[i];
      return sel.selected ? sum + item.price * sel.qty : sum;
    }, 0),
  );

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

  constructor() {

        this.api.getItems().subscribe(items => {
          this.items.set(items);
          this.selections.set(items.map(() => ({ selected: false, qty: 1 })));
        });

  }

submit() {
  console.log('Submitting order...');
  if (!this.session.customer) {
    console.warn(' No customer logged in');
    return;
  }


  const orderItems: OrderItemDto[] = this.items().flatMap((item, i) => {
    const sel = this.selections()[i];
    return sel.selected ? [{ itemId: item.id, quantity: sel.qty }] : [];
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

  this.api.createOrder(orderPayload)
    .subscribe({
      next: () => {
        console.log('Order created, navigating...');
        this.router.navigate(['/orders']);
      },
      error: err => {
        console.error('API call failed:', err);
      }
    });
}


}
