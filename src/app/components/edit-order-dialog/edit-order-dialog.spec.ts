import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditOrderDialog } from './edit-order-dialog';

describe('EditOrderDialog', () => {
  let component: EditOrderDialog;
  let fixture: ComponentFixture<EditOrderDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditOrderDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditOrderDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
