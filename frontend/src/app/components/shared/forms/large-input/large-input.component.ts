import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-large-input',
  templateUrl: './large-input.component.html',
  styleUrls: ['./large-input.component.css']
})
export class LargeInputComponent {
  @Output() valueChange = new EventEmitter<string>();
  value!:string;
}
