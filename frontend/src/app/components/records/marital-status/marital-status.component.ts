import { Component, Input, Renderer2 } from '@angular/core';
import { IPermissions } from '../../shared/container/types';
import { CreateMaritalStatusDto, IMaritalStatus, IUpdateMaritalStatus } from './types';
import { MaritalStatusService } from './marital-status.service';

@Component({
  selector: 'app-marital-status',
  templateUrl: './marital-status.component.html',
  styleUrls: ['./marital-status.component.css']
})
export class MaritalStatusComponent {
  constructor(
    private maritalStatusService:MaritalStatusService,
    private renderer: Renderer2){}

  @Input() permissions!: IPermissions
  allStatus:IMaritalStatus[] = []
  creatingStatus:boolean = false
  editingStatus:boolean = false
  createMaritalStatusData:CreateMaritalStatusDto = {
    marital_status_type_name: ""
  }

  isLoading: boolean = false
  done:boolean=false
  doneMessage:string = ''
  error:boolean = false
  errorMessage:string = ''

  shownBox:boolean=false

  ngOnInit(){
    this.isLoading = true
    this.maritalStatusService.findAllMaritalStatus().subscribe({
      next: res => {
        this.allStatus= res
        this.isLoading = false
      },
      error: err => {
        this.errorMessage = err.message
        this.error = true
        this.isLoading = false
      }
    });
  }

  showBox(){
    const box = document.getElementById("boxHeadMaritalStatus");
    const add = document.getElementById("statusAddIcon")
    const see = document.getElementById("seeMoreIconStatus")
    this.shownBox = !this.shownBox
    if (this.shownBox){
      box?.classList.replace("smallSectionBox", "sectionBox")
      add?.classList.remove("hidden")
      see?.classList.add("rotatedClock")
    }else{
      box?.classList.replace("sectionBox", "smallSectionBox")
      add?.classList.add("hidden")
      see?.classList.remove("rotatedClock")


    }
  }

  createForm(){
    this.creatingStatus = true
  }

  createMaritalStatus(){
    this.isLoading = true
    this.maritalStatusService.createMaritalStatus(this.createMaritalStatusData).subscribe({
      next: res => {
        this.doneMessage = 'Estado civil criado com sucesso.'
        this.done = true
        this.isLoading = false
        this.ngOnInit()
        this.createMaritalStatusData.marital_status_type_name = ""
        this.creatingStatus = false

      },
      error: err => {
        this.errorMessage = err.message
        this.error = true
        this.isLoading = false
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

  editMaritalStatus(i:number){
    this.isLoading = true
    const editStatusData:IUpdateMaritalStatus = {
      marital_status_type_id: this.allStatus[i].marital_status_type_id,
      marital_status_type_name: this.allStatus[i].marital_status_type_name
    }

    this.maritalStatusService.editMaritalStatus(editStatusData).subscribe({
      next: res => {
        this.doneMessage = 'Estado civil editado com sucesso.'
        this.done = true
        this.isLoading = false

      },
      error: err => {
        this.errorMessage = err.message
        this.error = true
        this.isLoading = false
      }
    })

  }

  closeError(){
    this.error = false
  }

  closeDone(){
    this.done = false
  }

}
