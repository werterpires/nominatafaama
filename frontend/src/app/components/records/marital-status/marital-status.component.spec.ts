import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaritalStatusComponent } from './marital-status.component';

describe('MaritalStatusComponent', () => {
  let component: MaritalStatusComponent;
  let fixture: ComponentFixture<MaritalStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaritalStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaritalStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
