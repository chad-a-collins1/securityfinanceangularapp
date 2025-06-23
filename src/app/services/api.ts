import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Customer, Item, Order, OrderItemDto } from '../models';
import { env } from '../helpers/env';

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}

 

  getCustomer(email: string): Observable<Customer> {
    return this.http.post<Customer>('${env.apiUrl}/customer/get-customer', { email });
  }


  createOrder(order: Omit<Order, 'id'>): Observable<Order> {
    return this.http.post<Order>('${env.apiUrl}/orders', order);
  }

  createCustomer(customer: Omit<Customer, 'Id'>): Observable<Customer> {
    return this.http.post<Customer>('${env.apiUrl}/customer', customer);
  }

  getItems(): Observable<Item[]> {
    return this.http.get<Item[]>('${env.apiUrl}/item');
  }


  getOrders(customerId: number): Observable<Order[]> {
    return this.http.get<Order[]>(`${env.apiUrl}/orders/customer/${customerId}`);
  }
}