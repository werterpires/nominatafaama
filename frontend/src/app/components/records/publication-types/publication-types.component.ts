import { Component, Input } from '@angular/core';
import { PublicationTypeService } from './publication-types.service';
import { IPermissions } from '../../shared/container/types';
import { CreatePublicationTypeDto, IPublicationType, UpdatePublicationTypeDto } from './types';

@Component({
  selector: 'app-publication-types',
  templateUrl: './publication-types.component.html',
  styleUrls: ['./publication-types.component.css']
})
export class PublicationTypesComponent {
  constructor(
    private service: PublicationTypeService
  ) { }

  @Input() permissions!: IPermissions;
  allPublicationTypes: IPublicationType[] = [];
  creatingPublicationType: boolean = false;
  editingPublicationType: boolean = false;
  createPublicationTypeData: CreatePublicationTypeDto = {
    publication_type: '',
    instructions:''
  };

  isLoading: boolean = false;
  done: boolean = false;
  doneMessage: string = '';
  error: boolean = false;
  errorMessage: string = '';

  shownBox:boolean=false

  ngOnInit() {
    this.isLoading = true;
    this.service.findAllPublicationTypes().subscribe({
      next: res => {
        this.allPublicationTypes = res;
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
    const box = document.getElementById("boxHeadPublicationTypes");
    const add = document.getElementById("publicationTypeAddIcon")
    const see = document.getElementById("seeMoreIconPublicationTypes")
    this.shownBox = !this.shownBox
    if (this.shownBox){
      box?.classList.replace("smallSectionBox", "sectionBox")
      add?.classList.remove("hidden")
      see?.classList.add("rotatedClock")
    }else{
      this.creatingPublicationType = false
      this.editingPublicationType = false
      box?.classList.replace("sectionBox", "smallSectionBox")
      add?.classList.add("hidden")
      see?.classList.remove("rotatedClock")
    }
  }

  createForm() {
    this.creatingPublicationType = true;
  }

  createPublicationType() {
    this.isLoading = true;
    this.service.createPublicationType(this.createPublicationTypeData).subscribe({
      next: res => {
        this.doneMessage = 'Tipo de publicação criado com sucesso.';
        this.done = true;
        this.isLoading = false;
        this.ngOnInit();
        this.createPublicationTypeData.publication_type = '';
        this.creatingPublicationType = false;
      },
      error: err => {
        this.errorMessage = err.message;
        this.error = true;
        this.isLoading = false;
      }
    });
  }

  changeTagType(paragraphId:string, buttonId:string, inputId:string) {
    const paragraph = document.getElementById(paragraphId);
    const input = document.getElementById(inputId) as HTMLInputElement;

    if(paragraph !== null && paragraph.textContent && input!==null){
      input.classList.remove('hidden')
      paragraph.classList.add('hidden')

      input.value = paragraph.textContent;
      input.oninput = function(){
        document.getElementById(buttonId)?.classList.remove('hidden')
      }

      input.focus();

      input.onblur = function() {
        paragraph.textContent = input.value;
        input.classList.add('hidden')
        paragraph.classList.remove('hidden')
      }


    };

  }

  editPublicationType(i: number, buttonId:string) {
    this.isLoading = true;
    const editPublicationTypeData: UpdatePublicationTypeDto = {
      publication_type_id: this.allPublicationTypes[i].publication_type_id,
      publication_type: this.allPublicationTypes[i].publication_type,
      instructions: this.allPublicationTypes[i].instructions
    };

    this.service.updatePublicationType(editPublicationTypeData).subscribe({
      next: res => {
        this.doneMessage = 'Tipo de publicação editado com sucesso.';
        this.done = true;
        const button = document.getElementById(buttonId)?.classList.add('hidden')
        this.isLoading = false;
      },
      error: err => {
        this.errorMessage = err.message;
        this.error = true;
        this.isLoading = false;
      }
    });
  }

  deletePublicationType(i: number) {
    this.isLoading = true;
    const publicationTypeId = this.allPublicationTypes[i].publication_type_id;

    this.service.deletePublicationType(publicationTypeId).subscribe({
      next: res => {
        this.doneMessage = 'Tipo de publicação deletado com sucesso.';
        this.done = true;
        this.isLoading = false;
        this.ngOnInit();
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
