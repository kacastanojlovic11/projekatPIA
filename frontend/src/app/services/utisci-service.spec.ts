import { TestBed } from '@angular/core/testing';

import { UtisciService } from './utisci-service';

describe('UtisciService', () => {
  let service: UtisciService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UtisciService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
