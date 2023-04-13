import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItensSubCategoryComponent } from './itens-sub-category.component';

describe('ItensSubCategoryComponent', () => {
  let component: ItensSubCategoryComponent;
  let fixture: ComponentFixture<ItensSubCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItensSubCategoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItensSubCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
