import { Pipe, PipeTransform } from '@angular/core';
import { Order } from '../models/order';

@Pipe({
  name: 'orderFilter',
  standalone: true
})
export class OrderFilterPipe implements PipeTransform {
  transform(orders: Order[], searchText: string): Order[] {
    if (!searchText) return orders;

    /*
    const lowerSearch = searchText.toLowerCase();

    return orders.filter(order =>
       order.id.toString().includes(lowerSearch) ||
          order.orderItems?.some(item =>
        item.name?.toLowerCase().includes(lowerSearch)
      )
    );
*/

    const term = searchText.trim().toLowerCase();

    // Extract digits so “Order #1004” matches 1004
    const digitPart = term.replace(/[^0-9]/g, '');

    return orders.filter(order => {

      // ----‑ order‑number match ------------------
      const idMatch =
        digitPart && order.id.toString().includes(digitPart);

      // ----‑ any item‑name match -----------------
      const itemMatch = order.orderItems?.some(i =>
        i.name?.toLowerCase().includes(term)
      );

      return idMatch || itemMatch;
    });

  }
}
