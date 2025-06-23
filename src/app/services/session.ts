import { Injectable } from '@angular/core';
import { Customer } from '../models';

@Injectable({ providedIn: 'root' })
export class SessionService {
  customer?: Customer;
}
