import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AproveByUserTypeComponent } from './aprove-by-user-type.component';

describe('AproveByUserTypeComponent', () => {
  let component: AproveByUserTypeComponent;
  let fixture: ComponentFixture<AproveByUserTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AproveByUserTypeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AproveByUserTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
