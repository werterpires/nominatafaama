import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnactiveComponent } from './unactive.component';

describe('UnactiveComponent', () => {
  let component: UnactiveComponent;
  let fixture: ComponentFixture<UnactiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnactiveComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnactiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
