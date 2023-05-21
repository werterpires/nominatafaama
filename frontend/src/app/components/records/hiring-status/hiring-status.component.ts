import { Component, Input } from '@angular/core';
import { IPermissions } from '../../shared/container/types';
import { HiringStatusService } from './hiring_status.service';
import { CreateHiringStatusDto, IHiringStatus, UpdateHiringStatusDto } from './types';

@Component({
  selector: 'app-hiring-status',
  templateUrl: './hiring-status.component.html',
  styleUrls: ['./hiring-status.component.css']
})
export class HiringStatusComponent {
  constructor(
    private hiringStatusService: HiringStatusService
  ) { }

  @Input() permissions!: IPermissions;
  allHiringStatus: IHiringStatus[] = [];
  creatingHiringStatus: boolean = false;
  editingHiringStatus: boolean = false;
  createHiringStatusData: CreateHiringStatusDto = {
    hiring_status_name:"",
    hiring_status_description: ""
  };

  isLoading: boolean = false;
  done: boolean = false;
  doneMessage: string = '';
  error: boolean = false;
  errorMessage: string = '';

  shownBox:boolean=false

  ngOnInit() {
    this.isLoading = true;
    this.hiringStatusService.findAllHiringStatus().subscribe({
      next: res => {
        this.allHiringStatus = res;
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
    const box = document.getElementById("boxHeadHiringStatus");
    const add = document.getElementById("hiring_statusAddIcon")
    const see = document.getElementById("seeMoreIconHiringStatus")
    this.shownBox = !this.shownBox
    if (this.shownBox){
      box?.classList.replace("smallSectionBox", "sectionBox")
      add?.classList.remove("hidden")
      see?.classList.add("rotatedClock")
    }else{
      this.creatingHiringStatus = false
      this.editingHiringStatus = false
      box?.classList.replace("sectionBox", "smallSectionBox")
      add?.classList.add("hidden")
      see?.classList.remove("rotatedClock")
      


    }
  }

  createForm() {
    this.creatingHiringStatus = true;
  }

  createHiringStatus() {
    this.isLoading = true;
    this.hiringStatusService.createHiringStatus(this.createHiringStatusData).subscribe({
      next: res => {
        this.doneMessage = 'HiringStatus criada com sucesso.';
        this.done = true;
        this.isLoading = false;
        this.ngOnInit();
        this.createHiringStatusData.hiring_status_name = '';
        this.creatingHiringStatus = false;
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

  editHiringStatus(i: number, buttonId:string) {
    this.isLoading = true;
    const editHiringStatusData: UpdateHiringStatusDto = {
      hiring_status_id: this.allHiringStatus[i].hiring_status_id,
      hiring_status_name: this.allHiringStatus[i].hiring_status_name,
      hiring_status_description: this.allHiringStatus[i].hiring_status_description
    };

    this.hiringStatusService.updateHiringStatus(editHiringStatusData).subscribe({
      next: res => {
        this.doneMessage = 'HiringStatus editada com sucesso.';
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

  deleteHiringStatus(i: number) {
    this.isLoading = true;
    const hiring_statusId = this.allHiringStatus[i].hiring_status_id;

    this.hiringStatusService.deleteHiringStatus(hiring_statusId).subscribe({
      next: res => {
        this.doneMessage = 'HiringStatus deletada com sucesso.';
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