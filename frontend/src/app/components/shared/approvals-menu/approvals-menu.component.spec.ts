import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalsMenuComponent } from './approvals-menu.component';

describe('ApprovalsMenuComponent', () => {
  let component: ApprovalsMenuComponent;
  let fixture: ComponentFixture<ApprovalsMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApprovalsMenuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovalsMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
