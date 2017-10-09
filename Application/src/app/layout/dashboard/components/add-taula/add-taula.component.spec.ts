import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTaulaComponent } from './add-taula.component';

describe('AddTaulaComponent', () => {
  let component: AddTaulaComponent;
  let fixture: ComponentFixture<AddTaulaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTaulaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTaulaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
