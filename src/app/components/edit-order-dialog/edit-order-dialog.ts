import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {  MAT_DIALOG_DATA, MatDialogRef, MatDialogModule} from '@angular/material/dialog';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { Order } from '../../models/order';

@Component({
  selector: 'app-edit-order-dialog',
  templateUrl: './edit-order-dialog.html',
  standalone: true,
  imports: [ CommonModule, ReactiveFormsModule, MatDialogModule, MatButtonModule ]
  
})
export class EditOrderDialogComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Order,
    private fb: FormBuilder,
    private ref: MatDialogRef<EditOrderDialogComponent>
  ) {}


  form!: FormGroup;

  ngOnInit(): void {

    this.form = this.fb.group({
      id: [this.data.id],
      etag: [this.data.etag],
      items: this.fb.array(
        this.data.orderItems!.map(i =>
          this.fb.group({
            orderItemId: [i.orderItemId],
            itemId:   [i.itemId],
            name:     [i.name],
            quantity: [i.quantity, [Validators.required, Validators.min(0)]]
          })
        )
      )
    });

  }

  get items(): FormArray {
    return this.form.get('items') as FormArray;
  }

  save(): void {
    if (this.form.invalid) return;
    this.ref.close(this.form.value);  
  }

  cancel(): void {
    this.ref.close();
  }
}
