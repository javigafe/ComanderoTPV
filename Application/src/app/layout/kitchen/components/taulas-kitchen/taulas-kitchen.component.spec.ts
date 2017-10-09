import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaulasKitchenComponent } from './taulas-kitchen.component';

describe('TaulasKitchenComponent', () => {
  let component: TaulasKitchenComponent;
  let fixture: ComponentFixture<TaulasKitchenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaulasKitchenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaulasKitchenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
