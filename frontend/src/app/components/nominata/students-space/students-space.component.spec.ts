import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentsSpaceComponent } from './students-space.component';

describe('StudentsSpaceComponent', () => {
  let component: StudentsSpaceComponent;
  let fixture: ComponentFixture<StudentsSpaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentsSpaceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentsSpaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
