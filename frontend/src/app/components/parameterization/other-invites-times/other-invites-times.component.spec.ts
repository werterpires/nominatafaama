import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherInvitesTimesComponent } from './other-invites-times.component';

describe('OtherInvitesTimesComponent', () => {
  let component: OtherInvitesTimesComponent;
  let fixture: ComponentFixture<OtherInvitesTimesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OtherInvitesTimesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OtherInvitesTimesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
