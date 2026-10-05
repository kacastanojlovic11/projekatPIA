import { TestBed } from '@angular/core/testing';

import { JavneNabavkeService } from './javne-nabavke-service';

describe('JavneNabavkeService', () => {
  let service: JavneNabavkeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JavneNabavkeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
