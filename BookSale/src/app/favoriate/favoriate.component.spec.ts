import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoriateComponent } from './favoriate.component';

describe('FavoriateComponent', () => {
  let component: FavoriateComponent;
  let fixture: ComponentFixture<FavoriateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FavoriateComponent]
    });
    fixture = TestBed.createComponent(FavoriateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
