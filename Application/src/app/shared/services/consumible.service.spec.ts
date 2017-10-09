import { TestBed, inject } from '@angular/core/testing';

import { ConsumibleService } from './consumible.service';

describe('ConsumibleService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConsumibleService]
    });
  });

  it('should be created', inject([ConsumibleService], (service: ConsumibleService) => {
    expect(service).toBeTruthy();
  }));
});
