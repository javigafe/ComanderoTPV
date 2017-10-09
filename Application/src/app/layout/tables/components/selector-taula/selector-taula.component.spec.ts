import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectorTaulaComponent } from './selector-taula.component';

describe('SelectorTaulaComponent', () => {
  let component: SelectorTaulaComponent;
  let fixture: ComponentFixture<SelectorTaulaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectorTaulaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectorTaulaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
