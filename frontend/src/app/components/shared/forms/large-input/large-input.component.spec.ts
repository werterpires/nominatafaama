import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LargeInputComponent } from './large-input.component';

describe('LargeInputComponent', () => {
  let component: LargeInputComponent;
  let fixture: ComponentFixture<LargeInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LargeInputComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LargeInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
