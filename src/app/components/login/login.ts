import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ApiService, SessionService } from '../../services';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <h2 class="text-xl mb-4">Login</h2>
    <form [formGroup]="form" (ngSubmit)="submit()" class="flex flex-col gap-4 max-w-sm">
      <input type="email"
             class="input"
             formControlName="email"
             placeholder="email@example.com" />
      <button type="submit" class="btn" [disabled]="form.invalid || loading">
        Continue
      </button>
      <p class="text-red-500" *ngIf="form.controls.email.touched && form.controls.email.invalid">
        Please enter a valid email
      </p>
    </form>
  `
})
export class LoginComponent {
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])
  });

  loading = false;

  constructor(
    private api: ApiService,
    private session: SessionService,
    private router: Router
  ) {}

  submit() {
    console.log("submitting...");

    if (this.form.invalid || this.loading) return;

    const email = this.form.value.email!;
    this.loading = true;
    console.log('Calling API for', email);

    this.api.getCustomer(email).subscribe({
      next: customer => {
        console.log('no customer Id');
        if (!customer || !customer.id) {
          this.router.navigate(['/signup'], { state: { email } });
          return;
        }
        this.session.customer = customer;
          console.log('customer logged in: ', customer);
        this.router.navigate(['/orders']);
      },
      error: err => {
        console.error('API error:', err);
        if (err.status === 404) {
             console.log('customer logged not in: ');
          this.router.navigate(['/signup'], { state: { email } });
        } else {
          alert(`Unexpected error (${err.status}): ${err.message}`);
        }
      }
    }).add(() => (this.loading = false));
  }
}
