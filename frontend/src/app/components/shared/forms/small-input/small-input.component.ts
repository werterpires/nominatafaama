import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-small-input',
  templateUrl: './small-input.component.html',
  styleUrls: ['./small-input.component.css']
})
export class SmallInputComponent {
  @Output() valueChange = new EventEmitter<string>();
  value!:string;
}
