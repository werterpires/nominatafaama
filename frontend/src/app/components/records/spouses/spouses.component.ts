import { Component, Input } from '@angular/core';
import { IPermissions } from '../../shared/container/types';
import { OthersServices } from '../../shared/shared.service.ts/others.service';
import { IUF, ICity } from '../../shared/types';
import { AssociationService } from '../associations/associations.service';
import { IAssociation } from '../associations/types';
import { HiringStatusService } from '../hiring-status/hiring_status.service';
import { IHiringStatus } from '../hiring-status/types';
import { MaritalStatusService } from '../marital-status/marital-status.service';
import { IMaritalStatus } from '../marital-status/types';
import { SpouseService } from './spouses.service';
import { ISpouse, ICreateSpouse, IUpdateSpouse } from './types';
import { DataService } from '../../shared/shared.service.ts/data.service';

@Component({
  selector: 'app-spouses',
  templateUrl: './spouses.component.html',
  styleUrls: ['./spouses.component.css']
})
export class SpousesComponent {

  constructor(
    private spouseServices: SpouseService,
    private associationService: AssociationService,
    private othersService: OthersServices,
    public dataService: DataService
    ){}

  @Input() permissions!: IPermissions;
  spouse: ISpouse = {
    person_name: "",
    phone_number: "",
    is_whatsapp: false,
    alternative_email: "",
    person_id: 0,
    origin_field_id: 0,
    justification: "",
    birth_city: "",
    birth_state: "",
    primary_school_city: "",
    birth_date: "",
    baptism_date: "",
    baptism_place: "",
    spouse_approved: null,
    spouse_id: 0,
    association_name: "",
    association_acronym: "",
    union_name: "",
    union_acronym: "",
    union_id: 0,
    civil_marriage_date: "",
    civil_marriage_city: "",
    registry: "",
    registry_number: "",
    primary_school_state: "",
    created_at: '',
    updated_at: '',
    civil_marriage_state: null
  }
  creatingSpouse: boolean = false;
  editingSpouse: boolean = false;
  createSpouseData: ICreateSpouse = {
    phone_number: "",
    is_whatsapp: false,
    alternative_email: "",
    origin_field_id: 0,
    justification: "",
    birth_city: "",
    birth_state: "",
    primary_school_city: "",
    birth_date: "",
    baptism_date: "",
    baptism_place: "",
    civil_marriage_date: null,
    civil_marriage_city: null,
    registry: null,
    registry_number: null,
    name: '',
    cpf: '',
    primary_school_state: '',
    civil_marriage_state: null
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
  chosenMerryStateId!: number;
  allMerryCities!: ICity[];
  cpf!:string;

  realBirthDate!:Date

  isLoading: boolean = false;
  done: boolean = false;
  doneMessage: string = '';
  error: boolean = false;
  errorMessage: string = '';

  shownBox: boolean = false;

  ngOnInit() {
    this.isLoading = true;
    this.spouseServices.findSpouseByUserId().subscribe({
      next: res => {

        if(res?.spouse_id>0 ){

          this.spouse = res

          console.log(this.spouse.baptism_date)

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

    this.othersService.findAllStates().subscribe({
      next: res=>{
        this.allBirthStates = res
        this.isLoading=false;
      },
      error: err=>{
        this.errorMessage = err.message;
        this.error = true;
        this.isLoading=false;

      }
    })

  }


  showBox() {
    const box = document.getElementById('boxHeadSpouses');
    const add = document.getElementById('spouseAddIcon');
    const see = document.getElementById('seeMoreIconSpouses');
    this.shownBox = !this.shownBox;
    if (this.shownBox) {
      box?.classList.replace('smallSectionBox', 'sectionBox');
      add?.classList.remove('hidden');
      see?.classList.add('rotatedClock');
      this.creatingSpouse = false;
    } else {
      this.creatingSpouse = false;
      box?.classList.replace('sectionBox', 'smallSectionBox');
      add?.classList.add('hidden');
      see?.classList.remove('rotatedClock');
    }
  }

  filterAssociation(){
    this.createSpouseData.origin_field_id=0
    this.possibleAssociantions = this.allAssociations.filter(association=>{
      return association.union_acronym == this.selectedUnion
    })

  }

  createForm() {
    this.creatingSpouse = true;
  }

  findCities(cityType:string){

    let id!:number
    if(cityType=="birth"){
      id = this.chosenBirthStateId
    }else if(cityType=="school"){
      id = this.chosenSchollStateId
    }else if(cityType=="merry"){
      id = this.chosenMerryStateId
    }

    this.othersService.findAllCities(id).subscribe({
      next: res=>{
        if(cityType=="birth"){
          this.allBirthCities = res
        }else if(cityType=="school"){
          this.allSchoolCities = res
        }else if(cityType == "merry"){
          this.allMerryCities = res
        }

      },
      error: err=>{
        this.errorMessage = err.message;
        this.error = true;
        this.isLoading=false;

      }
    })
  }

  createSpouse() {
    this.isLoading = true
    this.createSpouseData.origin_field_id = Number(this.createSpouseData.origin_field_id);
    const birthState = this.allBirthStates.find(state=>{return state.id == this.chosenBirthStateId})?.sigla;

    if(birthState){
      this.createSpouseData.birth_state = birthState
    }

    const primarySchoolState = this.allBirthStates.find(state=>{return state.id == this.chosenSchollStateId})?.sigla;
    if(primarySchoolState){
      this.createSpouseData.primary_school_state = primarySchoolState
    }

    const civilMerryState = this.allBirthStates.find(state=>{return state.id == this.chosenMerryStateId})?.sigla;
    if(civilMerryState){
      this.createSpouseData.civil_marriage_state = civilMerryState
    }

    this.createSpouseData.baptism_date = this.createSpouseData.baptism_date.slice(5,7)+ '/'+ this.createSpouseData.baptism_date.slice(8,10)+'/'+this.createSpouseData.baptism_date.slice(0,4)
    this.createSpouseData.birth_date = this.createSpouseData.birth_date.slice(5,7)+ '/'+ this.createSpouseData.birth_date.slice(8,10)+'/'+this.createSpouseData.birth_date.slice(0,4)

    if(this.createSpouseData.civil_marriage_date!=null){
      this.createSpouseData.civil_marriage_date = this.createSpouseData.civil_marriage_date?.slice(5,7)+ '/'+ this.createSpouseData.civil_marriage_date?.slice(8,10)+'/'+this.createSpouseData.civil_marriage_date?.slice(0,4)
    }

    this.spouseServices.createSpouse(this.createSpouseData).subscribe({
      next: res => {
        this.doneMessage = 'Estudante criado com sucesso.';
        this.done = true;
        this.isLoading = false;
        this.createSpouseData.phone_number = '';
        this.createSpouseData.is_whatsapp = false;
        this.createSpouseData.alternative_email = '';
        this.createSpouseData.origin_field_id = 0;
        this.createSpouseData.justification = '';
        this.createSpouseData.birth_city = '';
        this.createSpouseData.birth_state = '';
        this.createSpouseData.primary_school_city = '';
        this.createSpouseData.birth_date = "";
        this.createSpouseData.baptism_date = "";
        this.createSpouseData.baptism_place = '';
        this.createSpouseData.primary_school_state = "";
        this.creatingSpouse = false;
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

  editSpouse( buttonId: string) {
    this.isLoading = true
    this.spouse.origin_field_id = Number(this.spouse.origin_field_id);

    const birthState = this.allBirthStates.find(state=>{return state.id == this.chosenBirthStateId})?.sigla;
    if(birthState){
      this.spouse.birth_state = birthState
    }

    const baptismState = this.allBirthStates.find(state=>{return state.id == this.chosenSchollStateId})?.sigla;
    if(baptismState){
      this.spouse.primary_school_state = baptismState
    }

    const merryState = this.allBirthStates.find(state=>{return state.id == this.chosenMerryStateId})?.sigla;
    if(merryState){
      this.spouse.civil_marriage_state = merryState
    }

    const isWhats = (this.spouse.is_whatsapp==1)

    const baptism_date:string = this.spouse.baptism_date.slice(5,7)+ '/'+ this.spouse.baptism_date.slice(8,10)+'/'+this.spouse.baptism_date.slice(0,4)
    const birth_date:string = this.spouse.birth_date.slice(5,7)+ '/'+ this.spouse.birth_date.slice(8,10)+'/'+this.spouse.birth_date.slice(0,4)

    let merry_date:string | null = null

    if(this.spouse.civil_marriage_date!=null){
      merry_date = this.spouse.civil_marriage_date?.slice(5,7)+ '/'+ this.spouse.civil_marriage_date?.slice(8,10)+'/'+this.spouse.civil_marriage_date?.slice(0,4)
    }

    const editSpouseData: IUpdateSpouse = {
      spouse_id: this.spouse.spouse_id,
      phone_number: this.spouse.phone_number,
      is_whatsapp: isWhats,
      alternative_email: this.spouse.alternative_email,
      person_id: this.spouse.person_id,
      origin_field_id: this.spouse.origin_field_id,
      justification: this.spouse.justification,
      birth_city: this.spouse.birth_city,
      birth_state: this.spouse.birth_state,
      primary_school_city: this.spouse.primary_school_city,
      primary_school_state: this.spouse.primary_school_state,
      birth_date: birth_date,
      baptism_date: baptism_date,
      baptism_place: this.spouse.baptism_place,
      civil_marriage_date: merry_date,
      civil_marriage_city: this.spouse.civil_marriage_city,
      registry: this.spouse.registry,
      registry_number: this.spouse.registry_number,
      spouse_approved: false,
      name: this.spouse.person_name,
      cpf: this.cpf,
      civil_marriage_state: this.spouse.civil_marriage_state
    };

    console.log(editSpouseData)

    this.spouseServices.updateSpouse(editSpouseData).subscribe({
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


  deleteSpouse(i: number) {
    this.isLoading = true;
    const spouseId = this.spouse.spouse_id;

    this.spouseServices.deleteSpouse(spouseId).subscribe({
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
