import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderhistoryDetailComponent } from './orderhistory.detail.component';

describe('OrderhistoryDetailComponent', () => {
  let component: OrderhistoryDetailComponent;
  let fixture: ComponentFixture<OrderhistoryDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrderhistoryDetailComponent]
    });
    fixture = TestBed.createComponent(OrderhistoryDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
