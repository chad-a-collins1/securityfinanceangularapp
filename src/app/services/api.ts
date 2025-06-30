import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Customer, Item, Order, OrderItemDto, LoginResponse, LoginRequest } from '../models';
import { env } from '../helpers/env';
import { HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}

 

  getCustomer(email: string): Observable<Customer> {
    return this.http.post<Customer>(`${env.apiUrl}/customer/get-customer`, { email });
  }

  login(email: string): Observable<LoginResponse> {
    const body: LoginRequest = { email };
    return this.http.post<LoginResponse>(`${env.apiUrl}/Auth/login`, body);
  }

  createOrder(order: Omit<Order, 'id'>): Observable<Order> {
    return this.http.post<Order>(`${env.apiUrl}/orders`, order);
  }


  updateOrder(id: number, order: Order): Observable<Order> {
    const headers = order.etag ? new HttpHeaders({ 'If-Match': order.etag }) : undefined;

    return this.http.patch<Order>(
      `${env.apiUrl}/orders/${order.id}`,order, {headers});
  }


    createCustomer(customer: Omit<Customer, 'Id'>): Observable<Customer> {
      return this.http.post<Customer>(`${env.apiUrl}/customer`, customer);
    }

    getItems(): Observable<Item[]> {
      return this.http.get<Item[]>(`${env.apiUrl}/item`);
    }

    getOrders(customerId: number): Observable<Order[]> {
      return this.http.get<Order[]>(`${env.apiUrl}/orders/customer/${customerId}`)
        .pipe(
          map(orders =>
            orders.map(o => ({
              ...o,
              etag: o.etag?.startsWith('"') ? o.etag : `"${o.etag}"`
            }))
          )
        );
    }

    deleteOrder(order: Order): Observable<boolean> {
      const headers = order.etag ? new HttpHeaders({ 'If-Match': order.etag }) : undefined;
      return this.http.delete<boolean>(`${env.apiUrl}/orders/${order.id}`, {headers});
    }


}