import { TestBed, inject } from '@angular/core/testing';

import { GestionaService } from './gestiona.service';

describe('GestionaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GestionaService]
    });
  });

  it('should be created', inject([GestionaService], (service: GestionaService) => {
    expect(service).toBeTruthy();
  }));
});
