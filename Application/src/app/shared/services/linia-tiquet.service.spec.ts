import { TestBed, inject } from '@angular/core/testing';

import { LiniaTiquetService } from './linia-tiquet.service';

describe('LiniaTiquetService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LiniaTiquetService]
    });
  });

  it('should be created', inject([LiniaTiquetService], (service: LiniaTiquetService) => {
    expect(service).toBeTruthy();
  }));
});
