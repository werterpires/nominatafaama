import { Component, Input } from '@angular/core';
import { IPermissions } from '../../shared/container/types';
import { AssociationService } from './associations.service';
import { IAssociation, CreateAssociationDto, UpdateAssociationDto } from './types';
import { UnionService } from '../unions/unions.service';
import { IUnion } from '../unions/types';

@Component({
  selector: 'app-associations',
  templateUrl: './associations.component.html',
  styleUrls: ['./associations.component.css']
})
export class AssociationsComponent {
  constructor(
    private associationService: AssociationService,
    private unionsService: UnionService) {}

  @Input() permissions!: IPermissions;
  allAssociations: IAssociation[] = [];
  allUnions:IUnion[] = [];
  creatingAssociation: boolean = false;
  editingAssociation: boolean = false;
  createAssociationData: CreateAssociationDto = {
    association_name: '',
    association_acronym: '',
    union_id: 0
  };

  isLoading: boolean = false;
  done: boolean = false;
  doneMessage: string = '';
  error: boolean = false;
  errorMessage: string = '';

  shownBox: boolean = false;

  ngOnInit() {
    this.isLoading = true;
    this.associationService.findAllAssociations().subscribe({
      next: res => {
        this.allAssociations = res.sort((a, b) => {
          if (a.union_name < b.union_name) {
            return -1;
          } else if (a.union_name > b.union_name) {
            return 1;
          } else {
            return 0;
          }
        });
        this.isLoading = false;
      },
      error: err => {
        this.errorMessage = err.message;
        this.error = true;
        this.isLoading = false;
      }
    });

    this.unionsService.findAllUnions().subscribe({
      next: res => {
        this.allUnions = res.sort((a, b)=>{
          if(a.union_name < b.union_name){
            return -1
          }else if (a.union_name < b.union_name){
            return 1
          }else{
            return 0
          }
        });
        console.log(this.allUnions)
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
    const box = document.getElementById('boxHeadAssociations');
    const add = document.getElementById('associationAddIcon');
    const see = document.getElementById('seeMoreIconAssociations');
    this.shownBox = !this.shownBox;
    if (this.shownBox) {
      box?.classList.replace('smallSectionBox', 'sectionBox');
      add?.classList.remove('hidden');
      see?.classList.add('rotatedClock');
    } else {
      this.creatingAssociation = false
      box?.classList.replace('sectionBox', 'smallSectionBox');
      add?.classList.add('hidden');
      see?.classList.remove('rotatedClock');
    }
  }

  createForm() {
    this.creatingAssociation = true;
  }

  createAssociation() {
    this.isLoading = true;
    this.createAssociationData.union_id = Number(this.createAssociationData.union_id)
    this.associationService.createAssociation(this.createAssociationData).subscribe({
      next: res => {
        this.doneMessage = 'Associação criada com sucesso.';
        this.done = true;
        this.isLoading = false;
        this.ngOnInit();
        this.createAssociationData.association_name = '';
        this.createAssociationData.association_acronym = '';
        this.creatingAssociation = false;
      },
      error: err => {
        this.errorMessage = 'Não foi possível criar a associação.';
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
      input.oninput = function() {
        const button = document.getElementById(buttonId)?.classList.remove('hidden');
      };

      input.focus();

      input.onblur = function() {
        paragraph.textContent = input.value;
        input.classList.add('hidden');
        paragraph.classList.remove('hidden');
      };
    }
  }

  changeTagTypeToSelect(paragraphId: string, buttonId: string, selectId: string) {
    const paragraph = document.getElementById(paragraphId);
    const select = document.getElementById(selectId) as HTMLSelectElement;

    if (paragraph !== null && paragraph.textContent && select !== null) {
      select.classList.remove('hidden');
      paragraph.classList.add('hidden');

      select.selectedOptions.namedItem(paragraph.textContent)
      select.onselect = function() {
        const button = document.getElementById(buttonId)?.classList.remove('hidden');
      };

      select.focus();

      select.onblur = function() {
        paragraph.textContent = select.options[select.selectedIndex].text;
        select.classList.add('hidden');
        paragraph.classList.remove('hidden');
      };
    }
  }

  editAssociation(i: number, buttonId: string) {
    this.isLoading = true;
    const editAssociationData: UpdateAssociationDto = {
      association_id: this.allAssociations[i].association_id,
      association_name: this.allAssociations[i].association_name,
      association_acronym: this.allAssociations[i].association_acronym,
      union_id: this.allAssociations[i].union_id
    };

    this.associationService.updateAssociation(editAssociationData).subscribe({
      next: res => {
        this.doneMessage = 'Associação editada com sucesso.';
        this.done = true;
        const button = document.getElementById(buttonId)?.classList.add('hidden');
        this.isLoading = false;
      },
      error: err => {
        this.errorMessage = 'Não foi possível atualizar a associação.';
        this.error = true;
        this.isLoading = false;
      }
    });
  }

  deleteAssociation(i: number) {
    this.isLoading = true;
    const associationId = this.allAssociations[i].association_id;

    this.associationService.deleteAssociation(associationId).subscribe({
      next: res => {
        this.doneMessage = 'Associação deletada com sucesso.';
        this.done = true;
        this.isLoading = false;
        this.ngOnInit();
      },
      error: err => {
        this.errorMessage = 'Não foi possível deletar a associação.';
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