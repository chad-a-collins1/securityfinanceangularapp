import { Pipe, PipeTransform } from '@angular/core';
import { Order } from '../models/order';

@Pipe({
  name: 'orderFilter',
  standalone: true
})
export class OrderFilterPipe implements PipeTransform {
  transform(orders: Order[], searchText: string): Order[] {
    if (!searchText) return orders;

    const lowerSearch = searchText.toLowerCase();

    return orders.filter(order =>
      order.id.toString().includes(lowerSearch) ||
      order.orderItems?.some(item =>
        item.name?.toLowerCase().includes(lowerSearch)
      )
    );
  }
}
