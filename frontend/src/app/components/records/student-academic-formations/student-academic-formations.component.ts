import { Component, Input, Renderer2 } from '@angular/core';
import { IPermissions } from '../../shared/container/types';
import { StudentAcademicFormationsService } from './student-academic-formations.service';
import { IStAcademicFormation, IStCreateAcademicFormation, IStUpdateAcademicFormation } from './types';
import { IAcademicDegree } from '../academic-degrees/types';
import { AcademicDegreeService } from '../academic-degrees/academic-degrees.service';


@Component({
  selector: 'app-student-academic-formations',
  templateUrl: './student-academic-formations.component.html',
  styleUrls: ['./student-academic-formations.component.css']
})
export class StudentAcademicFormationsComponent {
  constructor(
    private stAcademicFormationService:StudentAcademicFormationsService,
    private renderer: Renderer2,
    private academicDegreeService:AcademicDegreeService){}

  @Input() permissions!: IPermissions
  allFormations:IStAcademicFormation[] = []
  allDegrees:IAcademicDegree[]=[]
  creatingFormation:boolean = false
  editingFormation:boolean = false
  createStAcademicFormationData:IStCreateAcademicFormation = {
    course_area: '',
    institution: '',
    begin_date: '',
    conclusion_date: null,
    degree_id: 0,
  }

  isLoading: boolean = false
  done:boolean=false
  doneMessage:string = ''
  error:boolean = false
  errorMessage:string = ''

  shownBox:boolean=false

  ngOnInit(){
    this.isLoading = true
    this.stAcademicFormationService.findAllStudentAcademicFormations().subscribe({
      next: res => {
        this.allFormations= res
        this.allFormations.sort((a, b)=>{
          if (a.begin_date > b.begin_date) {
            return -1;
          } else if (a.begin_date < b.begin_date) {
            return 1;
          } else {
            return 0;
          }
        })
        this.isLoading = false
      },
      error: err => {
        this.errorMessage = err.message
        this.error = true
        this.isLoading = false
      }
    });

    this.academicDegreeService.findAllAcademicDegrees().subscribe({
      next: res => {
        this.allDegrees= res
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
    const box = document.getElementById("boxHeadStAcademicFormations");
    const add = document.getElementById("formationAddIcon")
    const see = document.getElementById("seeMoreIconStFormations")
    this.shownBox = !this.shownBox
    if (this.shownBox){
      box?.classList.replace("smallSectionBox", "sectionBox")
      add?.classList.remove("hidden")
      see?.classList.add("rotatedClock")
      this.editingFormation = false
    }else{
      box?.classList.replace("sectionBox", "smallSectionBox")
      add?.classList.add("hidden")
      see?.classList.remove("rotatedClock")

    }
  }

  createForm(){
    this.creatingFormation = true
  }

  createStAcademicFormation(){
    this.isLoading = true
    this.createStAcademicFormationData.degree_id = Number(this.createStAcademicFormationData.degree_id)
    console.log(this.createStAcademicFormationData)
    this.stAcademicFormationService.createStudentAcademicFormation(this.createStAcademicFormationData).subscribe({
      next: res => {
        this.doneMessage = 'Grau Acadêmico criado com sucesso.'
        this.done = true
        this.isLoading = false
        this.ngOnInit()
        this.createStAcademicFormationData.course_area= '',
        this.createStAcademicFormationData.institution= '',
        this.createStAcademicFormationData.begin_date= '',
        this.createStAcademicFormationData.conclusion_date= null,
        this.createStAcademicFormationData.degree_id= 0
        this.creatingFormation = false

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

  editStAcademicFormation(i:number, buttonId:string){
    this.isLoading = true
    const editFormationData:IStUpdateAcademicFormation = {
      degree_id: Number(this.allFormations[i].degree_id),
      course_area: this.allFormations[i].course_area,
      institution: this.allFormations[i].institution,
      begin_date: this.allFormations[i].begin_date,
      conclusion_date: this.allFormations[i].conclusion_date? this.allFormations[i].conclusion_date:null,
      formation_id: this.allFormations[i].formation_id
    }

    this.stAcademicFormationService.editStudentAcademicFormation(editFormationData).subscribe({
      next: res => {
        this.doneMessage = 'Formação acadêmica editada com sucesso.'
        this.done = true
        const button = document.getElementById(buttonId)?.classList.add('hidden')
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
