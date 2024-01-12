import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentInviteComponent } from './student-invite.component';

describe('StudentInviteComponent', () => {
  let component: StudentInviteComponent;
  let fixture: ComponentFixture<StudentInviteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentInviteComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentInviteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
