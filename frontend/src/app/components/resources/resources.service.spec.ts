import { TestBed } from '@angular/core/testing';

import { AddressesService } from './resources.service';

describe('AddressesService', () => {
  let service: AddressesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddressesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
