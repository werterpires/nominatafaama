import { Component, Input, Output, EventEmitter, Renderer2 } from '@angular/core';
import { MainContentService } from './main-content.service';
import { IMenuOptions } from './types/main-content.types';

@Component({
  selector: 'app-main-content',
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.css']
})
export class MainContentComponent {
  constructor(
    private mainContentService: MainContentService,
    private renderer: Renderer2
  ) { }

  isThereSelected: boolean = false;

  @Input()
  menuOptions!: IMenuOptions[]

  @Output()
  newOptions = new EventEmitter<IMenuOptions[]>();


  pageActivate(pageName: string) {
    this.menuOptions = this.mainContentService.pageActivate(this.menuOptions, pageName)
    this.newOptions.emit(this.menuOptions)
  }

  addClass(elementId: string, className: string) {
    const element = document.getElementById(elementId);
    element?.classList.add(className)

    const elements = document.querySelectorAll('.listOption');
    elements.forEach((el) => {
      if (el !== element) {
        el.classList.remove(className);
      }
    });
    this.isThereSelected = true
  }

}
