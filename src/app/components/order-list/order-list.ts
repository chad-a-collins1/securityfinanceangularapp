import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, SessionService } from '../../services';
import { Order } from '../../models';
import { Router, RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-order-list',
  imports: [CommonModule],
  template: `
      <h2 class="text-xl mb-4">Hi {{customerFirstName}}, here are your orders</h2>

      <ng-container *ngIf="orders">
        <div *ngIf="orders.length === 0">No orders yet.</div>

<!-- <pre>{{ orders | json }}</pre> -->

      <div class="text-right mb-4">
        <button
          class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          (click)="goToNewOrder()">
          ➕ New Order
        </button>
      </div>

        <ul *ngIf="orders.length > 0">
          <li *ngFor="let order of orders" class="mb-1">

          <div class="font-semibold">Order #{{ order.id }} – {{ order.orderItems?.length }} item(s)</div>
          
            <ng-container *ngIf="order.orderItems">
                <ul class="ml-4 mt-2 list-disc">
                  <li *ngFor="let item of order.orderItems">
                   Item ID: {{ item.itemId }}, Quantity: {{ item.quantity }}
                  </li>
                </ul>
            </ng-container>
    
          </li>
        </ul>
      </ng-container>

      <div *ngIf="!orders">
        <p>Loading...</p>
      </div>
  `
})
export class OrderListComponent implements OnInit {
  private api = inject(ApiService);
  private session = inject(SessionService);
  private cdr = inject(ChangeDetectorRef);
  private router: Router = inject(Router);

  orders: Order[] = [];
  customerFirstName: string = ''; 

  goToNewOrder() {
    this.router.navigate(['/order']);
}

  ngOnInit(): void {


    if (!this.session.customer) {
      console.warn('No customer found in session.');
      return;
    }
    const customer = this.session.customer;
   this.customerFirstName = customer!.firstName;

    console.log(this.customerFirstName + 'is logged in');

  this.api.getOrders(this.session.customer.id).subscribe({
    next: os => {
      console.log('raw data', os);
      
      const ordersArray = Array.isArray(os) ? os : [os].filter(Boolean);
      this.orders = ordersArray.map(o => ({
        ...o,
        orderItems: o.orderItems ?? []
      }));

    },
    error: err => console.error(err)
  });




  }
}
