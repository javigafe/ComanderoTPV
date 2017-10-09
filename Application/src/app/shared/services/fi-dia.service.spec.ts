import { TestBed, inject } from '@angular/core/testing';

import { FiDiaService } from './fi-dia.service';

describe('FiDiaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FiDiaService]
    });
  });

  it('should be created', inject([FiDiaService], (service: FiDiaService) => {
    expect(service).toBeTruthy();
  }));
});
