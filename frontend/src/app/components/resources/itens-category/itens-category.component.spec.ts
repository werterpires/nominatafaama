import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItensCategoryComponent } from './itens-category.component';

describe('ItensCategoryComponent', () => {
  let component: ItensCategoryComponent;
  let fixture: ComponentFixture<ItensCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItensCategoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItensCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
