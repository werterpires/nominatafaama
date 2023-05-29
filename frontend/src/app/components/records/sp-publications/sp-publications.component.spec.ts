import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpPublicationsComponent } from './sp-publications.component';

describe('SpPublicationsComponent', () => {
  let component: SpPublicationsComponent;
  let fixture: ComponentFixture<SpPublicationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpPublicationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpPublicationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
