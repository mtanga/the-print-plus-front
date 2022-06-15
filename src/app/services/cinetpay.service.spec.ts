import { TestBed } from '@angular/core/testing';

import { CinetpayService } from './cinetpay.service';

describe('CinetpayService', () => {
  let service: CinetpayService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CinetpayService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
