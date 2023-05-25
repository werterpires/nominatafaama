import {Component, Input, Renderer2} from '@angular/core'
import {EvangExpTypesService} from './evang-exp-types.service'
import {IPermissions} from '../../shared/container/types'
import {
  IEvangExpType,
  ICreateEvangExpTypeDto,
  IUpdateEvangExpType,
} from './types'

@Component({
  selector: 'app-evang-exp-types',
  templateUrl: './evang-exp-types.component.html',
  styleUrls: ['./evang-exp-types.component.css'],
})
export class EvangExpTypesComponent {
  constructor(
    private evangExpTypesService: EvangExpTypesService,
    private renderer: Renderer2,
  ) {}

  @Input() permissions!: IPermissions
  allEvangExpTypes: IEvangExpType[] = []
  creatingEvangExpType: boolean = false
  editingEvangExpType: boolean = false
  createEvangExpTypeData: ICreateEvangExpTypeDto = {
    evang_exp_type_name: '',
  }

  isLoading: boolean = false
  done: boolean = false
  doneMessage: string = ''
  error: boolean = false
  errorMessage: string = ''

  shownBox: boolean = false

  ngOnInit() {
    this.isLoading = true
    this.evangExpTypesService.findAllEvangExpTypes().subscribe({
      next: (res) => {
        this.allEvangExpTypes = res
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
    const box = document.getElementById('boxHeadEvangExpTypes')
    const add = document.getElementById('evangExpTypeAddIcon')
    const see = document.getElementById('seeMoreIconEvangExpTypes')
    this.shownBox = !this.shownBox
    if (this.shownBox) {
      box?.classList.replace('smallSectionBox', 'sectionBox')
      add?.classList.remove('hidden')
      see?.classList.add('rotatedClock')
      this.editingEvangExpType = false
    } else {
      box?.classList.replace('sectionBox', 'smallSectionBox')
      add?.classList.add('hidden')
      see?.classList.remove('rotatedClock')
    }
  }

  createForm() {
    this.creatingEvangExpType = true
  }

  createEvangExpType() {
    this.isLoading = true
    this.evangExpTypesService
      .createEvangExpType(this.createEvangExpTypeData)
      .subscribe({
        next: (res) => {
          this.doneMessage =
            'Tipo de experiência evangélica criado com sucesso.'
          this.done = true
          this.isLoading = false
          this.ngOnInit()
          this.createEvangExpTypeData.evang_exp_type_name = ''
          this.creatingEvangExpType = false
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

  editEvangExpType(i: number, buttonId: string) {
    this.isLoading = true
    const editEvangExpTypeData: IUpdateEvangExpType = {
      evang_exp_type_id: this.allEvangExpTypes[i].evang_exp_type_id,
      evang_exp_type_name: this.allEvangExpTypes[i].evang_exp_type_name,
    }

    this.evangExpTypesService.editEvangExpType(editEvangExpTypeData).subscribe({
      next: (res) => {
        this.doneMessage = 'Tipo de experiência evangélica editado com sucesso.'
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
    const associationId = this.allEvangExpTypes[i].evang_exp_type_id

    this.evangExpTypesService.deleteRegistry(associationId).subscribe({
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
