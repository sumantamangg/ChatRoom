import { TestBed } from '@angular/core/testing';

import { AaluService } from './aalu.service';

describe('AaluService', () => {
  let service: AaluService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AaluService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
