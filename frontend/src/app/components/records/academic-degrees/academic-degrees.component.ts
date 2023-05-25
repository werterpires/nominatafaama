import {Component, Input, Renderer2} from '@angular/core'
import {IPermissions} from '../../shared/container/types'
import {DialogService} from '../../shared/shared.service.ts/dialog.service'
import {AcademicDegreeService} from './academic-degrees.service'
import {
  IAcademicDegree,
  ICreateAcademicDegreeDto,
  IUpdateAcademicDegree,
} from './types'

@Component({
  selector: 'app-academic-degrees',
  templateUrl: './academic-degrees.component.html',
  styleUrls: ['./academic-degrees.component.css'],
})
export class AcademicDegreesComponent {
  constructor(
    private academicDegreesService: AcademicDegreeService,
    private renderer: Renderer2,
    private dialogService: DialogService,
  ) {}

  @Input() permissions!: IPermissions
  allDegrees: IAcademicDegree[] = []
  creatingDegree: boolean = false
  editingDegree: boolean = false
  createAcademicDegreeData: ICreateAcademicDegreeDto = {
    degree_name: '',
  }

  isLoading: boolean = false
  done: boolean = false
  doneMessage: string = ''
  error: boolean = false
  errorMessage: string = ''

  shownBox: boolean = false

  ngOnInit() {
    this.isLoading = true
    this.academicDegreesService.findAllAcademicDegrees().subscribe({
      next: (res) => {
        this.allDegrees = res
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
    const box = document.getElementById('boxHeadAcademicDegres')
    const add = document.getElementById('degreeAddIcon')
    const see = document.getElementById('seeMoreIconDegrees')
    this.shownBox = !this.shownBox
    if (this.shownBox) {
      box?.classList.replace('smallSectionBox', 'sectionBox')
      add?.classList.remove('hidden')
      see?.classList.add('rotatedClock')
      this.editingDegree = false
    } else {
      box?.classList.replace('sectionBox', 'smallSectionBox')
      add?.classList.add('hidden')
      see?.classList.remove('rotatedClock')
    }
  }

  createForm() {
    this.creatingDegree = true
  }

  createAcademicDegree() {
    this.isLoading = true
    this.academicDegreesService
      .createAcademicDegree(this.createAcademicDegreeData)
      .subscribe({
        next: (res) => {
          this.doneMessage = 'Grau Acadêmico criado com sucesso.'
          this.done = true
          this.isLoading = false
          this.ngOnInit()
          this.createAcademicDegreeData.degree_name = ''
          this.creatingDegree = false
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

  editAcademicDegree(i: number, buttonId: string) {
    this.isLoading = true
    const editDegreeData: IUpdateAcademicDegree = {
      degree_id: this.allDegrees[i].degree_id,
      degree_name: this.allDegrees[i].degree_name,
    }

    this.academicDegreesService.editAcademicDegree(editDegreeData).subscribe({
      next: (res) => {
        this.doneMessage = 'Grau acadêmico editado com sucesso.'
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

  deleteAcademicDecree(i: number) {
    this.dialogService
      .new('Confirma a remoção?', [
        'Você tem certeza de que deseja remover este registro?',
      ])
      .then((confirmation) => {
        if (this.dialogService.checkConfirmation(confirmation)) {
          this.isLoading = true
          const publicationTypeId = this.allDegrees[i].degree_id

          this.academicDegreesService
            .deleteAcademicDegree(publicationTypeId)
            .subscribe({
              next: (res) => {
                this.doneMessage = 'Registro deletado com sucesso.'
                this.done = true
                this.isLoading = false
                this.ngOnInit()
              },
              error: (err) => {
                this.errorMessage = err.message
                this.error = true
                this.isLoading = false
              },
            })
        }
      })
  }

  closeError() {
    this.error = false
  }

  closeDone() {
    this.done = false
  }
}
