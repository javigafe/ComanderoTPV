import { TestBed, inject } from '@angular/core/testing';

import { TiquetService } from './tiquet.service';

describe('TiquetService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TiquetService]
    });
  });

  it('should be created', inject([TiquetService], (service: TiquetService) => {
    expect(service).toBeTruthy();
  }));
});
