import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovesComponent } from './approves.component';

describe('ApprovesComponent', () => {
  let component: ApprovesComponent;
  let fixture: ComponentFixture<ApprovesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApprovesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
