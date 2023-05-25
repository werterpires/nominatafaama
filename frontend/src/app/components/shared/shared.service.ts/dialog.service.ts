import { EventEmitter, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Dialog } from '../types';

@Injectable({ providedIn: 'root' })
export class DialogService {
  dialogs: Array<Dialog> = [];

  constructor() {}

  async new(title: string, text: Array<string>): Promise<number> {
    const newDialog: Dialog = {
      title,
      text,
      confirmation: new EventEmitter<number>(),
    };
    this.dialogs.push(newDialog);
    return firstValueFrom(newDialog.confirmation);
  }

  checkConfirmation(id: number) {
    if (id >= 0) {
      this.remove(id);
      return true;
    } else {
      this.remove(id);
      return false;
    }
  }

  private remove(id: number) {
    this.dialogs.splice(id, 1);
  }

  private removeAll() {
    this.dialogs.splice(0);
  }
}
