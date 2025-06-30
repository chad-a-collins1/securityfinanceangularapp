import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, SessionService } from '../../services';
import { Order } from '../../models';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button'; 
import { EditOrderDialogComponent } from '../edit-order-dialog/edit-order-dialog';
import { OrderFilterPipe } from '../../pipes/order-filter-pipe';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-order-list',

 imports: [
   CommonModule,
   MatDialogModule,
   MatIconModule,
   MatButtonModule,
   MatSnackBarModule,
   RouterModule,
   OrderFilterPipe,
   FormsModule            
 ],
  templateUrl: './order-list.html',
})
export class OrderListComponent implements OnInit {
  private api     = inject(ApiService);
  private session = inject(SessionService);
  private cdr     = inject(ChangeDetectorRef);
  private router  = inject(Router);
  private dialog  = inject(MatDialog);      
  private snack   = inject(MatSnackBar);    

  orders: Order[] = [];
  customerFirstName: string = ''; 
  searchText: string = '';
  orderTotals: { [orderId: number]: number } = {};
  grandTotal: number = 0;

    goToNewOrder() {
      this.router.navigate(['/order']);
    }

    goToLogin() {
    this.router.navigate(['/login']);
    }



 reload(customerId: number): void {
    Promise.all([
      firstValueFrom(this.api.getOrders(customerId)),
      firstValueFrom(this.api.getItems())
    ])
    .then(([orders, items]) => {
      const priceMap = new Map<number, number>();
      items.forEach(i => priceMap.set(i.id, i.price));

      const ordersArray = (Array.isArray(orders) ? orders : [orders])
        .filter((o): o is Order => o !== undefined && o.id !== undefined);

      this.orders = ordersArray.map(o => ({
        ...o,
        orderItems: (o.orderItems ?? []).map(it => ({
          ...it,
          price: priceMap.get(it.itemId) ?? 0  ///Since the orderitemdto doesn't include price, it needs to be mapped here from the item so subtotals and grandtotal can be added.
        }))
      }));

      this.computeOrderTotals();
    })
    .catch(err => {
      console.error('Failed to reload orders and enrich prices', err);
    });
 }



  openEdit(order: Order) {
    const ref = this.dialog.open(EditOrderDialogComponent, { data: order, width: '400px' });
    
    console.log('Dialog data:', order);

    ref.afterClosed().subscribe(edited => {
      if (!edited) return;                        

      this.api.updateOrder(edited.id, edited)
        .subscribe({
          next: () => {
            if (this.session.customer) {
             this.reload(this.session.customer.id);   
            }
            
          },          
          error: err => this.snack.open('Save failed', 'Dismiss')
        });
    });
  }


    confirmDelete(order: Order) {
    const confirmed = window.confirm(`Are you sure you want to delete Order #${order.id}?`);
    if (confirmed) {
      this.api.deleteOrder(order).subscribe({
        next: () => {

          this.orders = this.orders.filter(o => o.id !== order.id);
          console.log(`Order #${order.id} deleted`);
          this.computeOrderTotals();
          
        },
        error: err => {
          console.error('Failed to delete order', err);
          alert('Something went wrong while deleting the order.');
        }
      });
    }
  }

  computeOrderTotals(): void {
    this.orderTotals = {};
    this.grandTotal = 0;

    for (const order of this.orders) {
      const subtotal = order.orderItems!.reduce((sum, item) =>
        sum + (item.price ?? 0) * item.quantity, 0);
      this.orderTotals[order.id] = subtotal;
      this.grandTotal += subtotal;
    }
  }

  ngOnInit(): void {
      if (!this.session.customer) {
        console.warn('No customer found in session.');
        this.goToLogin();
        return;
      }

      this.customerFirstName = this.session.customer.firstName;
      console.log(this.customerFirstName + ' is logged in');

      this.reload(this.session.customer.id);
    }

}


