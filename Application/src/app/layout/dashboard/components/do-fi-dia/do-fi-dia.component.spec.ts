import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DoFiDiaComponent } from './do-fi-dia.component';

describe('DoFiDiaComponent', () => {
  let component: DoFiDiaComponent;
  let fixture: ComponentFixture<DoFiDiaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoFiDiaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoFiDiaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
