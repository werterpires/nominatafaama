import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersApprovesComponent } from './users-approves.component';

describe('UsersApprovesComponent', () => {
  let component: UsersApprovesComponent;
  let fixture: ComponentFixture<UsersApprovesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsersApprovesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsersApprovesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
