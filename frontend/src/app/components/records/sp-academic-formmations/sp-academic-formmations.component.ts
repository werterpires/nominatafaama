import {Component, Input, Renderer2} from '@angular/core'
import {IPermissions} from '../../shared/container/types'
import {IAcademicDegree} from '../academic-degrees/types'
import {AcademicDegreeService} from '../academic-degrees/academic-degrees.service'
import {SpAcademicFormationsService} from './sp-academic-formmations.service'
import {
  ISpAcademicFormation,
  ISpCreateAcademicFormation,
  ISpUpdateAcademicFormation,
} from './types'

@Component({
  selector: 'app-sp-academic-formations',
  templateUrl: './sp-academic-formmations.component.html',
  styleUrls: ['./sp-academic-formmations.component.css'],
})
export class SpAcademicFormmationsComponent {
  constructor(
    private spAcademicFormationService: SpAcademicFormationsService,
    private renderer: Renderer2,
    private academicDegreeService: AcademicDegreeService,
  ) {}

  @Input() permissions!: IPermissions
  spAllFormations: ISpAcademicFormation[] = []
  spAllDegrees: IAcademicDegree[] = []
  creatingFormation: boolean = false
  editingFormation: boolean = false
  createSpAcademicFormationData: ISpCreateAcademicFormation = {
    course_area: '',
    institution: '',
    begin_date: '',
    conclusion_date: null,
    degree_id: 0,
  }

  isLoading: boolean = false
  done: boolean = false
  doneMessage: string = ''
  error: boolean = false
  errorMessage: string = ''

  shownBox: boolean = false

  ngOnInit() {
    this.isLoading = true
    this.spAcademicFormationService.findAllSpAcademicFormations().subscribe({
      next: (res) => {
        this.spAllFormations = res
        this.spAllFormations.sort((a, b) => {
          if (a.begin_date > b.begin_date) {
            return -1
          } else if (a.begin_date < b.begin_date) {
            return 1
          } else {
            return 0
          }
        })
        this.isLoading = false
      },
      error: (err) => {
        this.errorMessage = err.message
        this.error = true
        this.isLoading = false
      },
    })

    this.academicDegreeService.findAllAcademicDegrees().subscribe({
      next: (res) => {
        this.spAllDegrees = res
        this.isLoading = false
      },
      error: (err) => {
        this.errorMessage = err.message
        this.error = true
        this.isLoading = false
      },
    })
  }

  showBox() {
    const box = document.getElementById('boxHeadSpAcademicFormations')
    const add = document.getElementById('spFormationAddIcon')
    const see = document.getElementById('seeMoreIconSpFormations')
    this.shownBox = !this.shownBox
    if (this.shownBox) {
      box?.classList.replace('smallSectionBox', 'sectionBox')
      add?.classList.remove('hidden')
      see?.classList.add('rotatedClock')
      this.editingFormation = false
    } else {
      box?.classList.replace('sectionBox', 'smallSectionBox')
      add?.classList.add('hidden')
      see?.classList.remove('rotatedClock')
    }
  }

  createForm() {
    this.creatingFormation = true
  }

  createSpAcademicFormation() {
    this.isLoading = true
    this.createSpAcademicFormationData.degree_id = Number(
      this.createSpAcademicFormationData.degree_id,
    )
    this.spAcademicFormationService
      .createSpAcademicFormation(this.createSpAcademicFormationData)
      .subscribe({
        next: (res) => {
          this.doneMessage = 'Formação acadêmica criado com sucesso.'
          this.done = true
          this.isLoading = false
          this.ngOnInit()
          ;(this.createSpAcademicFormationData.course_area = ''),
            (this.createSpAcademicFormationData.institution = ''),
            (this.createSpAcademicFormationData.begin_date = ''),
            (this.createSpAcademicFormationData.conclusion_date = null),
            (this.createSpAcademicFormationData.degree_id = 0)
          this.creatingFormation = false
        },
        error: (err) => {
          this.errorMessage = err.message
          this.error = true
          this.isLoading = false
        },
      })
  }

  changeTagType(paragraphId: string, buttonId: string, inputId: string) {
    const paragraph = document.getElementById(paragraphId)
    const input = document.getElementById(inputId) as HTMLInputElement

    if (paragraph !== null && paragraph.textContent && input !== null) {
      input.classList.remove('hidden')
      paragraph.classList.add('hidden')

      input.value = paragraph.textContent
      input.oninput = function () {
        const button = document
          .getElementById(buttonId)
          ?.classList.remove('hidden')
      }

      input.focus()

      input.onblur = function () {
        paragraph.textContent = input.value
        input.classList.add('hidden')
        paragraph.classList.remove('hidden')
      }
    }
  }

  changeTagTypeToSelect(
    paragraphId: string,
    buttonId: string,
    selectId: string,
  ) {
    const paragraph = document.getElementById(paragraphId)
    const select = document.getElementById(selectId) as HTMLSelectElement

    if (paragraph !== null && paragraph.textContent && select !== null) {
      select.classList.remove('hidden')
      paragraph.classList.add('hidden')

      select.selectedOptions.namedItem(paragraph.textContent)

      select.onchange = function () {
        const button = document
          .getElementById(buttonId)
          ?.classList.remove('hidden')
      }

      select.focus()

      select.onblur = function () {
        paragraph.textContent = select.options[select.selectedIndex].text
        select.classList.add('hidden')
        paragraph.classList.remove('hidden')
      }
    }
  }

  editSpAcademicFormation(i: number, buttonId: string) {
    this.isLoading = true
    const editFormationData: ISpUpdateAcademicFormation = {
      degree_id: Number(this.spAllFormations[i].degree_id),
      course_area: this.spAllFormations[i].course_area,
      institution: this.spAllFormations[i].institution,
      begin_date: this.spAllFormations[i].begin_date,
      conclusion_date: this.spAllFormations[i].conclusion_date
        ? this.spAllFormations[i].conclusion_date
        : null,
      formation_id: this.spAllFormations[i].formation_id,
    }

    this.spAcademicFormationService
      .editSpAcademicFormation(editFormationData)
      .subscribe({
        next: (res) => {
          this.doneMessage = 'Formação acadêmica editada com sucesso.'
          this.done = true
          const button = document
            .getElementById(buttonId)
            ?.classList.add('hidden')
          this.isLoading = false
        },
        error: (err) => {
          this.errorMessage = err.message
          this.error = true
          this.isLoading = false
        },
      })
  }

  deleteRegistry(i: number) {
    this.isLoading = true
    const associationId = this.spAllFormations[i].formation_id

    this.spAcademicFormationService.deleteRegistry(associationId).subscribe({
      next: (res) => {
        this.doneMessage = 'Associação deletada com sucesso.'
        this.done = true
        this.isLoading = false
        this.ngOnInit()
      },
      error: (err) => {
        this.errorMessage = 'Não foi possível deletar a associação.'
        this.error = true
        this.isLoading = false
      },
    })
  }

  closeError() {
    this.error = false
  }

  closeDone() {
    this.done = false
  }
}
