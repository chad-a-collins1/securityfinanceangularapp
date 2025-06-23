import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ApiService, SessionService } from '../../services';

@Component({
  standalone: true,
  selector: 'app-signup',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <h2 class="text-xl mb-4">Sign Up</h2>
    <form [formGroup]="form" (ngSubmit)="submit()" class="flex flex-col gap-4 max-w-sm">
      <input type="email" class="input" formControlName="email" placeholder="Email" readonly />
      <input type="text" class="input" formControlName="firstname" placeholder="First name" />
      <input type="text" class="input" formControlName="lastname" placeholder="Last name" />
      <button type="submit" class="btn">Create account</button>
    </form>
  `,
})
export class SignupComponent {
  private api = inject(ApiService);
  private router = inject(Router);
  private session = inject(SessionService);
  private fb = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    firstname: ['', Validators.required],
    lastname: ['', Validators.required],
  });

  constructor() {
    const emailFromState = history.state['email'];
    if (emailFromState) {
      this.form.patchValue({ email: emailFromState });
    }
  }

  submit() {
    if (this.form.invalid) return;
    this.api.createCustomer(this.form.value).subscribe(cust => {
      this.session.customer = cust;
      this.router.navigate(['/order']);
    });
  }
}
