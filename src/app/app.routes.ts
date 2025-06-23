import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { SignupComponent } from './components/signup/signup';
import { OrderComponent } from './components/order/order';
import { OrderListComponent } from './components/order-list/order-list';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'order', component: OrderComponent },
  { path: 'orders', component: OrderListComponent },
];