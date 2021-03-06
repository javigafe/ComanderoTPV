import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCategoriaComponent } from './add-categoria.component';

describe('AddCategoriaComponent', () => {
  let component: AddCategoriaComponent;
  let fixture: ComponentFixture<AddCategoriaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCategoriaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCategoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
