import { Component, Input } from '@angular/core';
import { EndowmentTypesService } from './endowment-types.service';
import { IPermissions } from '../../shared/container/types';
import { IEndowmentType, ICreateEndowmentTypeDto, IUpdateEndowmentType } from './types';

@Component({
  selector: 'app-endowment-types',
  templateUrl: './endowment-types.component.html',
  styleUrls: ['./endowment-types.component.css']
})
export class EndowmentTypesComponent {
  constructor(private endowmentTypesService: EndowmentTypesService) {}

  @Input() permissions!: IPermissions;
  allEndowmentTypes: IEndowmentType[] = [];
  creatingEndowmentType: boolean = false;
  editingEndowmentType: boolean = false;
  createEndowmentTypeData: ICreateEndowmentTypeDto = {
    endowment_type_name: "",
    application:0
  };
  genders:string []= ['Ambos', 'Masculino', 'Feminino']
  isLoading: boolean = false;
  done: boolean = false;
  doneMessage: string = '';
  error: boolean = false;
  errorMessage: string = '';

  shownBox: boolean = false;

  ngOnInit() {
    this.isLoading = true;
    this.endowmentTypesService.findAllEndowmentTypes().subscribe({
      next: res => {
        this.allEndowmentTypes = res;
        console.log(this.allEndowmentTypes)
        this.isLoading = false;
      },
      error: err => {
        this.errorMessage = err.message;
        this.error = true;
        this.isLoading = false;
      }
    });
  }

  showBox() {
    const box = document.getElementById("boxHeadEndowmentTypes");
    const add = document.getElementById("endowmentTypeAddIcon");
    const see = document.getElementById("seeMoreIconEndowmentTypes");
    this.shownBox = !this.shownBox;
    if (this.shownBox) {
      box?.classList.replace("smallSectionBox", "sectionBox");
      add?.classList.remove("hidden");
      see?.classList.add("rotatedClock");
      this.editingEndowmentType = false;
    } else {
      box?.classList.replace("sectionBox", "smallSectionBox");
      add?.classList.add("hidden");
      see?.classList.remove("rotatedClock");
    }
  }
  

  createForm() {
    this.creatingEndowmentType = true;
  }

  createEndowmentType() {
    this.isLoading = true;
    this.createEndowmentTypeData.application = Number(this.createEndowmentTypeData.application)
    console.log(this.createEndowmentTypeData)
    this.endowmentTypesService.createEndowmentType(this.createEndowmentTypeData).subscribe({
      next: res => {
        this.doneMessage = 'Tipo de endowment criado com sucesso.';
        this.done = true;
        this.isLoading = false;
        this.ngOnInit();
        this.createEndowmentTypeData.endowment_type_name = "";
        this.creatingEndowmentType = false;
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

  changeTagTypeToSelect(paragraphId: string, buttonId: string, selectId: string) {

    const paragraph = document.getElementById(paragraphId);
    const select = document.getElementById(selectId) as HTMLSelectElement;

    if (paragraph !== null && paragraph.textContent && select !== null) {
      select.classList.remove('hidden');
      paragraph.classList.add('hidden');

      select.selectedOptions.namedItem(paragraph.textContent)

      select.onchange = function() {

        const button = document.getElementById(buttonId)?.classList.remove('hidden');
      };

      select.focus();

      select.onblur = function() {
        select.classList.add('hidden');
        paragraph.classList.remove('hidden');
      };
    }
  }

  editEndowmentType(i: number, buttonId: string) {
    this.isLoading = true;
    const editEndowmentTypeData: IUpdateEndowmentType = {
      endowment_type_id: Number(this.allEndowmentTypes[i].endowment_type_id),
      endowment_type_name: this.allEndowmentTypes[i].endowment_type_name,
      application: Number(this.allEndowmentTypes[i].application)
    };

    this.endowmentTypesService.editEndowmentType(editEndowmentTypeData).subscribe({
      next: res => {
        this.doneMessage = 'Tipo de endowment editado com sucesso.';
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

  closeError() {
    this.error = false;
  }

  closeDone() {
    this.done = false;
  }

}
