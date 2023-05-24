import { Component, Input, Renderer2 } from '@angular/core';
import { LanguageTypesService } from './language-types.service';
import { IPermissions } from '../../shared/container/types';
import { ILanguageType, ICreateLanguageTypeDto, IUpdateLanguageType } from './types';

@Component({
  selector: 'app-language-types',
  templateUrl: './language-types.component.html',
  styleUrls: ['./language-types.component.css']
})
export class LanguageTypesComponent {
  constructor(
    private languageTypesService: LanguageTypesService,
    private renderer: Renderer2){}

  @Input() permissions!: IPermissions;
  allLanguageTypes: ILanguageType[] = [];
  creatingLanguageType: boolean = false;
  editingLanguageType: boolean = false;
  createLanguageTypeData: ICreateLanguageTypeDto = {
    language: ""
  };

  isLoading: boolean = false;
  done: boolean = false;
  doneMessage: string = '';
  error: boolean = false;
  errorMessage: string = '';

  shownBox: boolean = false;

  ngOnInit(){
    this.isLoading = true;
    this.languageTypesService.findAllLanguageTypes().subscribe({
      next: res => {
        this.allLanguageTypes = res;
        this.isLoading = false;
      },
      error: err => {
        this.errorMessage = err.message;
        this.error = true;
        this.isLoading = false;
      }
    });
  }

  showBox(){
    const box = document.getElementById("boxHeadLanguageTypes");
    const add = document.getElementById("languageTypeAddIcon");
    const see = document.getElementById("seeMoreIconLanguageTypes");
    this.shownBox = !this.shownBox;
    if (this.shownBox){
      box?.classList.replace("smallSectionBox", "sectionBox");
      add?.classList.remove("hidden");
      see?.classList.add("rotatedClock");
      this.editingLanguageType = false;
    }else{
      box?.classList.replace("sectionBox", "smallSectionBox");
      add?.classList.add("hidden");
      see?.classList.remove("rotatedClock");
    }
  }

  createForm(){
    this.creatingLanguageType = true;
  }

  createLanguageType(){
    this.isLoading = true;
    this.languageTypesService.createLanguageType(this.createLanguageTypeData).subscribe({
      next: res => {
        this.doneMessage = 'Tipo de linguagem criado com sucesso.';
        this.done = true;
        this.isLoading = false;
        this.ngOnInit();
        this.createLanguageTypeData.language = "";
        this.creatingLanguageType = false;
      },
      error: err => {
        this.errorMessage = err.message;
        this.error = true;
        this.isLoading = false;
      }
    });
  }

  changeTagType(paragraphId: string, buttonId: string, inputId: string) {
    const paragraph = document.getElementById(paragraphId);
    const input = document.getElementById(inputId) as HTMLInputElement;

    if (paragraph !== null && paragraph.textContent && input !== null) {
      input.classList.remove('hidden');
      paragraph.classList.add('hidden');

      input.value = paragraph.textContent;     
      input.oninput = function(){
        const button = document.getElementById(buttonId)?.classList.remove('hidden');
      }

      input.focus();

      input.onblur = function() {
        paragraph.textContent = input.value;
        input.classList.add('hidden');
        paragraph.classList.remove('hidden');
      }
    }
  }

  editLanguageType(i: number, buttonId: string) {
    this.isLoading = true;
    const editLanguageTypeData: IUpdateLanguageType = {
      language_id: this.allLanguageTypes[i].language_id,
      language: this.allLanguageTypes[i].language
    };

    this.languageTypesService.editLanguageType(editLanguageTypeData).subscribe({
      next: res => {
        this.doneMessage = 'Tipo de linguagem editado com sucesso.';
        this.done = true;
        const button = document.getElementById(buttonId)?.classList.add('hidden');
        this.isLoading = false;
      },
      error: err => {
        this.errorMessage = err.message;
        this.error = true;
        this.isLoading = false;
      }
    });
  }

  closeError(){
    this.error = false;
  }

  closeDone(){
    this.done = false;
  }
}
