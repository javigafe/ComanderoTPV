import { TestBed, inject } from '@angular/core/testing';

import { EmpaquetaService } from './empaqueta.service';

describe('EmpaquetaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EmpaquetaService]
    });
  });

  it('should be created', inject([EmpaquetaService], (service: EmpaquetaService) => {
    expect(service).toBeTruthy();
  }));
});
