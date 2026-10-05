import { TestBed } from '@angular/core/testing';

import { KategorijeService } from './kategorije-service';

describe('KategorijeService', () => {
  let service: KategorijeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KategorijeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
