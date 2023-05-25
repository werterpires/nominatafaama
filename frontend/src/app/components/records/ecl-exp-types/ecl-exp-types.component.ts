import {Component, Input, Renderer2} from '@angular/core'
import {EclExpTypesService} from './ecl-exp-types.service'
import {IPermissions} from '../../shared/container/types'
import {IEclExpType, ICreateEclExpTypeDto, IUpdateEclExpType} from './types'

@Component({
  selector: 'app-ecl-exp-types',
  templateUrl: './ecl-exp-types.component.html',
  styleUrls: ['./ecl-exp-types.component.css'],
})
export class EclExpTypesComponent {
  constructor(
    private eclExpTypesService: EclExpTypesService,
    private renderer: Renderer2,
  ) {}

  @Input() permissions!: IPermissions
  allEclExpTypes: IEclExpType[] = []
  creatingEclExpType: boolean = false
  editingEclExpType: boolean = false
  createEclExpTypeData: ICreateEclExpTypeDto = {
    ecl_exp_type_name: '',
  }

  isLoading: boolean = false
  done: boolean = false
  doneMessage: string = ''
  error: boolean = false
  errorMessage: string = ''

  shownBox: boolean = false

  ngOnInit() {
    this.isLoading = true
    this.eclExpTypesService.findAllEclExpTypes().subscribe({
      next: (res) => {
        this.allEclExpTypes = res
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
    const box = document.getElementById('boxHeadEclExpTypes')
    const add = document.getElementById('eclExpTypeAddIcon')
    const see = document.getElementById('seeMoreIconEclExpTypes')
    this.shownBox = !this.shownBox
    if (this.shownBox) {
      box?.classList.replace('smallSectionBox', 'sectionBox')
      add?.classList.remove('hidden')
      see?.classList.add('rotatedClock')
      this.editingEclExpType = false
    } else {
      box?.classList.replace('sectionBox', 'smallSectionBox')
      add?.classList.add('hidden')
      see?.classList.remove('rotatedClock')
    }
  }

  createForm() {
    this.creatingEclExpType = true
  }

  createEclExpType() {
    this.isLoading = true
    this.eclExpTypesService
      .createEclExpType(this.createEclExpTypeData)
      .subscribe({
        next: (res) => {
          this.doneMessage = 'Tipo de experiência ECL criado com sucesso.'
          this.done = true
          this.isLoading = false
          this.ngOnInit()
          this.createEclExpTypeData.ecl_exp_type_name = ''
          this.creatingEclExpType = false
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

  editEclExpType(i: number, buttonId: string) {
    this.isLoading = true
    const editEclExpTypeData: IUpdateEclExpType = {
      ecl_exp_type_id: this.allEclExpTypes[i].ecl_exp_type_id,
      ecl_exp_type_name: this.allEclExpTypes[i].ecl_exp_type_name,
    }

    this.eclExpTypesService.editEclExpType(editEclExpTypeData).subscribe({
      next: (res) => {
        this.doneMessage = 'Tipo de experiência ECL editado com sucesso.'
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
    const associationId = this.allEclExpTypes[i].ecl_exp_type_id

    this.eclExpTypesService.deleteRegistry(associationId).subscribe({
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
