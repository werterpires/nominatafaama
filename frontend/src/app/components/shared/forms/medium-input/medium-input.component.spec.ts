import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediumInputComponent } from './medium-input.component';

describe('MediumInputComponent', () => {
  let component: MediumInputComponent;
  let fixture: ComponentFixture<MediumInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MediumInputComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MediumInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
