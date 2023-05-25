import { Injectable } from '@angular/core';
import { Dialog } from '../types';

@Injectable({ providedIn: 'root' })
export class DialogService {
  dialogs: Array<Dialog> = [];

  constructor() {}

  new(title: string, text: Array<string>): number {
    const newDialog: Dialog = {
      title,
      text,
    };
    return this.dialogs.push(newDialog) - 1;
  }

  checkConfirmation(id: number) {
    if (id >= 0) {
      this.remove(id);
    }
    return id;
  }

  private remove(id: number) {
    this.dialogs.splice(id, 1);
  }

  private removeAll() {
    this.dialogs.splice(0);
  }
}
