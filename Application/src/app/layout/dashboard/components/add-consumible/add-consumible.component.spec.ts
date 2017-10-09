import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddConsumibleComponent } from './add-consumible.component';

describe('AddConsumibleComponent', () => {
  let component: AddConsumibleComponent;
  let fixture: ComponentFixture<AddConsumibleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddConsumibleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddConsumibleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
