import { TestBed, inject } from '@angular/core/testing';

import { TaulaService } from './taula.service';

describe('TaulaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TaulaService]
    });
  });

  it('should be created', inject([TaulaService], (service: TaulaService) => {
    expect(service).toBeTruthy();
  }));
});
