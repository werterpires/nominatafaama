import { Component, Input } from '@angular/core';
import { StudentService } from './students.service';
import { IPermissions } from '../../shared/container/types';
import { ICreateStudent, IStudent, IUpdateStudent } from './types';
import { AssociationService } from '../associations/associations.service';
import { IAssociation } from '../associations/types';
import { HiringStatusService } from '../hiring-status/hiring_status.service';
import { MaritalStatusService } from '../marital-status/marital-status.service';
import { IHiringStatus } from '../hiring-status/types';
import { IMaritalStatus } from '../marital-status/types';
import { OthersServices } from '../../shared/shared.service.ts/others.service';
import { ICity, IUF } from '../../shared/types';
import { IUnion } from '../unions/types';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent {
  constructor(
    private studentServices: StudentService,
    private associationService: AssociationService,
    private hiringStatusService: HiringStatusService,
    private maritalStatusService: MaritalStatusService,
    private othersService: OthersServices
    ){}

  @Input() permissions!: IPermissions;
  student: IStudent = {
    name:"",
    phone_number:"",
    is_whatsapp:false,
    alternative_email:"",
    student_mensage:"",
    person_id:0,
    origin_field_id:0,
    justification:"",
    birth_city:"",
    birth_state:"",
    primary_school_city:"",
    birth_date:"",
    baptism_date:"",
    baptism_place:"",
    marital_status_id:0,
    hiring_status_id:0,
    student_approved:null,
    student_active:false,
    student_id:0,
    association_name:"",
    association_acronym:"",
    union_name:"",
    union_acronym:"",
    union_id:0,
    marital_status_type_name:"",
    hiring_status_name:"",
    hiring_status_description:"",
    primary_school_state: ""



  }
  creatingStudent: boolean = false;
  editingStudent: boolean = false;
  createStudentData: ICreateStudent = {
    phone_number: "",
    is_whatsapp: false,
    alternative_email: "",
    student_mensage: "",
    origin_field_id: 0,
    justification: "",
    birth_city: "",
    birth_state: "",
    primary_school_city: "",
    birth_date: new Date(),
    baptism_date: new Date(),
    baptism_place: "",
    marital_status_id: 0,
    hiring_status_id: 0,
    primary_school_state:""
  };

  allAssociations:IAssociation[] = []
  allHiringStatus:IHiringStatus[] = []
  allMaritalStatus:IMaritalStatus[] = []
  allUnions:string[] = []
  selectedUnion!: string
  possibleAssociantions!:IAssociation[]
  allBirthStates!:IUF[]
  chosenBirthStateId!:number
  allBirthCities!:ICity[]
  chosenSchollStateId!:number
  allSchoolCities!:ICity[]
  originUnion!:string
  originAssociation!:IAssociation
  chosenUnionToEdit!:string

  isLoading: boolean = false;
  done: boolean = false;
  doneMessage: string = '';
  error: boolean = false;
  errorMessage: string = '';

  shownBox: boolean = false;

  ngOnInit() {
    this.isLoading = true;
    this.studentServices.findStudentByUserId().subscribe({
      next: res => {
        
        if(res.student_id ){
          
          this.student = res
          
        }
        
      },
      error: err => {
        this.errorMessage = err.message;
        this.error = true;
        this.isLoading = false;
      }
    });

    this.associationService.findAllAssociations().subscribe({
      next: res => {
        this.allAssociations = res.sort((a, b)=>{
          if(a.union_name < b.union_name){
            return -1
          }else if (a.union_name < b.union_name){
            return 1
          }else{
            return 0
          }
        });
        this.allAssociations.forEach(association=>{
          if (!this.allUnions.includes(association.union_acronym)){
            this.allUnions.push(association.union_acronym)
          }
        })
      
      },
      error: err => {
        this.errorMessage = err.message;
        this.error = true;
        this.isLoading = false;
      }
    });

    this.hiringStatusService.findAllHiringStatus().subscribe({
      next: res => {
        this.allHiringStatus = res.sort((a, b)=>{
          if(a.hiring_status_name < b.hiring_status_name){
            return -1
          }else if (a.hiring_status_name < b.hiring_status_name){
            return 1
          }else{
            return 0
          }
        });
    
      },
      error: err => {
        this.errorMessage = err.message;
        this.error = true;
        this.isLoading = false;
      }
    });

    this.maritalStatusService.findAllMaritalStatus().subscribe({
      next: res => {
        this.allMaritalStatus = res.sort((a, b)=>{
          if(a.marital_status_type_name < b.marital_status_type_name){
            return -1
          }else if (a.marital_status_type_name < b.marital_status_type_name){
            return 1
          }else{
            return 0
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

    this.othersService.findAllStates().subscribe({
      next: res=>{
        this.allBirthStates = res
       
      },
      error: err=>{
        this.errorMessage = err.message;
        this.error = true;
        this.isLoading=false;
        
      }
    })



  }

 
  showBox() {
    const box = document.getElementById('boxHeadStudents');
    const add = document.getElementById('studentAddIcon');
    const see = document.getElementById('seeMoreIconStudents');
    this.shownBox = !this.shownBox;
    if (this.shownBox) {
      box?.classList.replace('smallSectionBox', 'sectionBox');
      add?.classList.remove('hidden');
      see?.classList.add('rotatedClock');
      this.creatingStudent = false;
    } else {
      this.creatingStudent = false;
      box?.classList.replace('sectionBox', 'smallSectionBox');
      add?.classList.add('hidden');
      see?.classList.remove('rotatedClock');
    }
  }
  
  filterAssociation(){
    this.createStudentData.origin_field_id=0
    this.possibleAssociantions = this.allAssociations.filter(association=>{
      return association.union_acronym == this.selectedUnion
    })
  
  }

  createForm() {
    this.creatingStudent = true;
  }

  findCities(cityType:string){
    
    let id!:number
    if(cityType=="birth"){
      id = this.chosenBirthStateId
      console.log(id)
    }else if(cityType=="school"){
      id = this.chosenSchollStateId
    }
    
    this.othersService.findAllCities(id).subscribe({
      next: res=>{
        if(cityType=="birth"){
          this.allBirthCities = res
        }else if(cityType=="school"){
          this.allSchoolCities = res
        }
        
      },
      error: err=>{
        this.errorMessage = err.message;
        this.error = true;
        this.isLoading=false;
        
      }
    })
  }

  createStudent() {
    this.isLoading = true
    this.createStudentData.origin_field_id = Number(this.createStudentData.origin_field_id);
    this.createStudentData.marital_status_id = Number(this.createStudentData.marital_status_id);
    this.createStudentData.hiring_status_id = Number(this.createStudentData.hiring_status_id);
    const birthState = this.allBirthStates.find(state=>{return state.id == this.chosenBirthStateId})?.sigla;
    if(birthState){
      this.createStudentData.birth_state = birthState
    }

    const baptismState = this.allBirthStates.find(state=>{return state.id == this.chosenSchollStateId})?.sigla;
    if(baptismState){
      this.createStudentData.primary_school_state = baptismState
    }

    
  
    this.studentServices.createStudent(this.createStudentData).subscribe({
      next: res => {
        this.doneMessage = 'Estudante criado com sucesso.';
        this.done = true;
        this.isLoading = false;
        this.createStudentData.phone_number = '';
        this.createStudentData.is_whatsapp = false;
        this.createStudentData.alternative_email = '';
        this.createStudentData.student_mensage = '';
        this.createStudentData.origin_field_id = 0;
        this.createStudentData.justification = '';
        this.createStudentData.birth_city = '';
        this.createStudentData.birth_state = '';
        this.createStudentData.primary_school_city = '';
        this.createStudentData.birth_date = new Date();
        this.createStudentData.baptism_date = new Date();
        this.createStudentData.baptism_place = '';
        this.createStudentData.marital_status_id = 0;
        this.createStudentData.hiring_status_id = 0;
        this.createStudentData.primary_school_state = "";
        this.creatingStudent = false;
      },
      error: err => {
        this.errorMessage = 'Não foi possível criar o estudante.';
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

      select.onchange = function() {

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

  editStudent( buttonId: string) {
    this.isLoading = true;
    
    const isWhats = (this.student.is_whatsapp==1)
    
    const editStudentData: IUpdateStudent = {
      student_id: this.student.student_id,
      phone_number: this.student.phone_number,
      is_whatsapp: isWhats,
      alternative_email: this.student.alternative_email,
      student_mensage: this.student.student_mensage,
      person_id: this.student.person_id,
      origin_field_id: this.student.origin_field_id,
      justification: this.student.justification,
      birth_city: this.student.birth_city,
      birth_state: this.student.birth_state,
      primary_school_city: this.student.primary_school_city,
      primary_school_state: this.student.primary_school_state,
      birth_date: new Date(this.student.birth_date),
      baptism_date: new Date(this.student.baptism_date),
      baptism_place: this.student.baptism_place,
      marital_status_id: Number(this.student.marital_status_id),
      hiring_status_id: this.student.hiring_status_id,
    };
    console.log(editStudentData)

  
    this.studentServices.updateStudent(editStudentData).subscribe({
      next: res => {
        this.doneMessage = 'Estudante editado com sucesso.';
        this.done = true;
        const button = document.getElementById(buttonId)?.classList.add('hidden');
        this.isLoading = false;
      },
      error: err => {
        this.errorMessage = 'Não foi possível atualizar o estudante.';
        this.error = true;
        this.isLoading = false;
      }
    });
  }
  

  deleteStudent(i: number) {
    this.isLoading = true;
    const studentId = this.student.student_id;

    this.studentServices.deleteStudent(studentId).subscribe({
      next: res => {
        this.doneMessage = 'Associação deletada com sucesso.';
        this.done = true;
        this.isLoading = false;
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
