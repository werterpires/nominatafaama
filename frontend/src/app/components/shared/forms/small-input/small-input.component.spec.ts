import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmallInputComponent } from './small-input.component';

describe('SmallInputComponent', () => {
  let component: SmallInputComponent;
  let fixture: ComponentFixture<SmallInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmallInputComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SmallInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
