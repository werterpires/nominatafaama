import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-medium-input',
  templateUrl: './medium-input.component.html',
  styleUrls: ['./medium-input.component.css']
})
export class MediumInputComponent {
  @Output() valueChange = new EventEmitter<string>();
  value!:string;
}
