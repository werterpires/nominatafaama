import { Injectable } from '@angular/core';
import { IMenuOptions } from './types/main-content.types';

@Injectable({
  providedIn: 'root'
})
export class MainContentService {

  constructor() { }

  pageActivate(menuOption: IMenuOptions[], pageName: string): IMenuOptions[] {

    menuOption.some(option => {
      if (option.description == pageName) {
        menuOption.forEach(opt => {
          opt.active = false
        })
        option.active = true
      }
    })
    return menuOption
  }
}
