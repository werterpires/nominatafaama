import { Component, Input } from '@angular/core';
import { IPermissions } from '../../shared/container/types';
import { CreateUnionDto, IUnion, UpdateUnionDto } from './types';
import { UnionService } from './unions.service';

@Component({
  selector: 'app-unions',
  templateUrl: './unions.component.html',
  styleUrls: ['./unions.component.css']
})
export class UnionsComponent {
  constructor(
    private unionService: UnionService
  ) { }

  @Input() permissions!: IPermissions;
  allUnions: IUnion[] = [];
  creatingUnion: boolean = false;
  editingUnion: boolean = false;
  createUnionData: CreateUnionDto = {
    union_name: '',
    union_acronym:''
  };

  isLoading: boolean = false;
  done: boolean = false;
  doneMessage: string = '';
  error: boolean = false;
  errorMessage: string = '';

  shownBox:boolean=false

  ngOnInit() {
    this.isLoading = true;
    this.unionService.findAllUnions().subscribe({
      next: res => {
        this.allUnions = res;
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
    const box = document.getElementById("boxHeadUnions");
    const add = document.getElementById("unionAddIcon")
    const see = document.getElementById("seeMoreIconUnions")
    this.shownBox = !this.shownBox
    if (this.shownBox){
      box?.classList.replace("smallSectionBox", "sectionBox")
      add?.classList.remove("hidden")
      see?.classList.add("rotatedClock")
    }else{
      this.creatingUnion = false
      box?.classList.replace("sectionBox", "smallSectionBox")
      add?.classList.add("hidden")
      see?.classList.remove("rotatedClock")
      


    }
  }

  createForm() {
    this.creatingUnion = true;
  }

  createUnion() {
    this.isLoading = true;
    this.unionService.createUnion(this.createUnionData).subscribe({
      next: res => {
        this.doneMessage = 'Union criada com sucesso.';
        this.done = true;
        this.isLoading = false;
        this.ngOnInit();
        this.createUnionData.union_name = '';
        this.creatingUnion = false;
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
        const button = document.getElementById(buttonId)?.classList.remove('hidden')
      }

      input.focus();

      

      input.onblur = function() {
  
        paragraph.textContent = input.value;
        input.classList.add('hidden')
        paragraph.classList.remove('hidden')
      }
   
    
    };
    
  }

  editUnion(i: number, buttonId:string) {
    this.isLoading = true;
    const editUnionData: UpdateUnionDto = {
      union_id: this.allUnions[i].union_id,
      union_name: this.allUnions[i].union_name,
      union_acronym: this.allUnions[i].union_acronym
    };

    this.unionService.updateUnion(editUnionData).subscribe({
      next: res => {
        this.doneMessage = 'Union editada com sucesso.';
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

  deleteUnion(i: number) {
    this.isLoading = true;
    const unionId = this.allUnions[i].union_id;

    this.unionService.deleteUnion(unionId).subscribe({
      next: res => {
        this.doneMessage = 'Union deletada com sucesso.';
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