import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpEndowmentsComponent } from './sp-endowments.component';

describe('SpEndowmentsComponent', () => {
  let component: SpEndowmentsComponent;
  let fixture: ComponentFixture<SpEndowmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpEndowmentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpEndowmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
