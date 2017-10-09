import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTaulaComponent } from './edit-taula.component';

describe('EditTaulaComponent', () => {
  let component: EditTaulaComponent;
  let fixture: ComponentFixture<EditTaulaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditTaulaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTaulaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
