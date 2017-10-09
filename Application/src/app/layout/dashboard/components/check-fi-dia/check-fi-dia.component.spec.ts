import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckFiDiaComponent } from './check-fi-dia.component';

describe('CheckFiDiaComponent', () => {
  let component: CheckFiDiaComponent;
  let fixture: ComponentFixture<CheckFiDiaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckFiDiaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckFiDiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
