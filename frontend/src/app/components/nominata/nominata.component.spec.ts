import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NominataComponent } from './nominata.component';

describe('NominataComponent', () => {
  let component: NominataComponent;
  let fixture: ComponentFixture<NominataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NominataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NominataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
