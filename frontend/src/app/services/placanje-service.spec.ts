import { TestBed } from '@angular/core/testing';

import { PlacanjeService } from './placanje-service';

describe('PlacanjeService', () => {
  let service: PlacanjeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlacanjeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
