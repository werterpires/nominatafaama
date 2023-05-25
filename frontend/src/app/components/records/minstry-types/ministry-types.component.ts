import {Component, Input} from '@angular/core'
import {IPermissions} from '../../shared/container/types'
import {
  IMinistryType,
  ICreateMinistryTypeDto,
  IUpdateMinistryType,
} from './types'
import {MinistryTypesService} from './ministry-types.service'

@Component({
  selector: 'app-ministry-types',
  templateUrl: './ministry-types.component.html',
  styleUrls: ['./ministry-types.component.css'],
})
export class MinistryTypesComponent {
  constructor(private ministryTypesService: MinistryTypesService) {}
  @Input() permissions!: IPermissions
  allMinistryTypes: IMinistryType[] = []
  creatingMinistryType: boolean = false
  editingMinistryType: boolean = false
  createMinistryTypeData: ICreateMinistryTypeDto = {
    ministry_type_name: '',
  }

  isLoading: boolean = false
  done: boolean = false
  doneMessage: string = ''
  error: boolean = false
  errorMessage: string = ''

  shownBox: boolean = false

  ngOnInit() {
    this.isLoading = true
    this.ministryTypesService.findAllMinistryTypes().subscribe({
      next: (res) => {
        this.allMinistryTypes = res
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
    const box = document.getElementById('boxHeadMinistryTypes')
    const add = document.getElementById('ministryTypeAddIcon')
    const see = document.getElementById('seeMoreIconMinistryTypes')
    this.shownBox = !this.shownBox
    if (this.shownBox) {
      box?.classList.replace('smallSectionBox', 'sectionBox')
      add?.classList.remove('hidden')
      see?.classList.add('rotatedClock')
      this.editingMinistryType = false
    } else {
      box?.classList.replace('sectionBox', 'smallSectionBox')
      add?.classList.add('hidden')
      see?.classList.remove('rotatedClock')
    }
  }

  createForm() {
    this.creatingMinistryType = true
  }

  createMinistryType() {
    this.isLoading = true
    this.ministryTypesService
      .createMinistryType(this.createMinistryTypeData)
      .subscribe({
        next: (res) => {
          this.doneMessage = 'Tipo de ministério criado com sucesso.'
          this.done = true
          this.isLoading = false
          this.ngOnInit()
          this.createMinistryTypeData.ministry_type_name = ''
          this.creatingMinistryType = false
        },
        error: (err) => {
          this.errorMessage = err.message
          this.error = true
          this.isLoading = false
        },
      })
  }

  editMinistryType(i: number, buttonId: string) {
    this.isLoading = true
    const editMinistryTypeData: IUpdateMinistryType = {
      ministry_type_id: this.allMinistryTypes[i].ministry_type_id,
      ministry_type_name: this.allMinistryTypes[i].ministry_type_name,
    }

    this.ministryTypesService.editMinistryType(editMinistryTypeData).subscribe({
      next: (res) => {
        this.doneMessage = 'Tipo de ministério editado com sucesso.'
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

  deleteRegistry(i: number) {
    this.isLoading = true
    const associationId = this.allMinistryTypes[i].ministry_type_id

    this.ministryTypesService.deleteRegistry(associationId).subscribe({
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
