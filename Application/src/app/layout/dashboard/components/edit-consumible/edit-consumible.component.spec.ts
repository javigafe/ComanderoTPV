import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditConsumibleComponent } from './edit-consumible.component';

describe('EditConsumibleComponent', () => {
  let component: EditConsumibleComponent;
  let fixture: ComponentFixture<EditConsumibleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditConsumibleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditConsumibleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
