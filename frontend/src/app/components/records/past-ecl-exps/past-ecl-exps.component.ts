import { Component, Input, OnInit } from '@angular/core'
import { IPermissions } from '../../shared/container/types'
import { CreatePastEclExpDto, IPastEclExp, UpdatePastEclExpDto } from './types'
import { PastEclExpService } from './past-ecl-exps.service'
import { DataService } from '../../shared/shared.service.ts/data.service'

@Component({
  selector: 'app-past-ecl-exps',
  templateUrl: './past-ecl-exps.component.html',
  styleUrls: ['./past-ecl-exps.component.css'],
})
export class PastEclExpsComponent implements OnInit {
  @Input() permissions!: IPermissions
  @Input() del = true
  @Input() new = true
  @Input() approve = false
  @Input() userId: number | null = null

  allRegistries: IPastEclExp[] = []
  title = 'Experiências eclesiásticas e evangelísticas anteriores ao Salt'
  createRegistryData: CreatePastEclExpDto = {
    function: '',
    past_exp_begin_date: '',
    past_exp_end_date: '',
    place: '',
  }

  showBox = false
  showForm = false
  isLoading = false
  done = false
  doneMessage = ''
  error = false
  errorMessage = ''

  constructor(
    private service: PastEclExpService,
    private dataService: DataService,
  ) {}

  alert = false
  alertMessage = ''
  func = ''
  index: number | null = null

  showAlert(func: string, message: string, idx?: number) {
    this.index = idx ?? this.index
    this.func = func
    this.alertMessage = message
    this.alert = true
  }
  confirm(response: { confirm: boolean; func: string }) {
    const { confirm, func } = response

    if (!confirm) {
      this.resetAlert()
    } else if (func == 'edit') {
      if (this.index == null) {
        this.errorMessage = 'Index não localizado. Impossível editar.'
        this.error = true
        this.resetAlert()
        return
      }
      this.editRegistry(this.index)
      this.resetAlert()
    } else if (func == 'delete') {
      if (this.index == null) {
        this.errorMessage = 'Index não localizado. Impossível deletar.'
        this.error = true
        this.resetAlert()
        return
      }
      this.deleteRegistry(this.index)
      this.resetAlert()
    } else if (func == 'create') {
      this.createRegistry()
      this.resetAlert()
    }
  }

  resetAlert() {
    this.index = null
    this.func = ''
    this.alertMessage = ''
    this.alert = false
  }

  ngOnInit() {
    this.allRegistries = []
    if (this.showBox) {
      this.getAllRegistries()
    }
  }

  toShowBox() {
    this.showBox = !this.showBox
    if (this.showBox) {
      this.getAllRegistries()
    } else if (!this.showBox) {
      this.allRegistries = []
    }
  }

  getAllRegistries() {
    this.isLoading = true
    this.service.findAllRegistries(this.userId).subscribe({
      next: (res) => {
        this.allRegistries = res
        this.isLoading = false
      },
      error: (err) => {
        this.errorMessage = err.message
        this.error = true
        this.isLoading = false
      },
    })
  }

  resetCreationRegistry() {
    Object.keys(this.createRegistryData).forEach((key) => {
      switch (typeof key) {
        case 'boolean':
          Object.defineProperty(this.createRegistryData, key, { value: false })
          break
        case 'number':
          Object.defineProperty(this.createRegistryData, key, { value: 0 })
          break
        case 'string':
          Object.defineProperty(this.createRegistryData, key, { value: '' })
          break
      }
    })
  }

  createRegistry() {
    this.isLoading = true

    if (this.createRegistryData.function.length < 1) {
      this.showError('Informe a função desempenhada.')
      return
    }

    if (this.createRegistryData.place.length < 1) {
      this.showError('Informe o local em que conseguiu tal experiência.')
      return
    }

    if (this.createRegistryData.past_exp_begin_date.length != 10) {
      this.showError('Informe a data de início da experiência.')
      return
    }

    if (this.createRegistryData.past_exp_end_date.length != 10) {
      this.showError('Informe a data de fim da experiência.')
      return
    }

    this.service
      .createRegistry({
        ...this.createRegistryData,
        past_exp_begin_date: this.dataService.dateFormatter(
          this.createRegistryData.past_exp_begin_date,
        ),
        past_exp_end_date: this.dataService.dateFormatter(
          this.createRegistryData.past_exp_end_date,
        ),
      })
      .subscribe({
        next: () => {
          this.doneMessage = 'Registro criado com sucesso.'
          this.done = true
          this.ngOnInit()
          this.showForm = false
          this.resetCreationRegistry()
          this.isLoading = false
        },
        error: (err) => {
          this.errorMessage = err.message
          this.error = true
          this.isLoading = false
        },
      })
  }

  editRegistry(index: number) {
    this.isLoading = true

    if (this.allRegistries[index].function.length < 1) {
      this.showError('Informe a função desempenhada.')
      return
    }

    if (this.allRegistries[index].place.length < 1) {
      this.showError('Informe o local em que conseguiu tal experiência.')
      return
    }

    if (this.allRegistries[index].past_exp_begin_date.length != 10) {
      this.showError('Informe a data de início da experiência.')
      return
    }

    if (this.allRegistries[index].past_exp_end_date.length != 10) {
      this.showError('Informe a data de fim da experiência.')
      return
    }

    const newRegistry: Partial<IPastEclExp> = {
      ...this.allRegistries[index],
      past_exp_begin_date: this.dataService.dateFormatter(
        this.allRegistries[index].past_exp_begin_date,
      ),
      past_exp_end_date: this.dataService.dateFormatter(
        this.allRegistries[index].past_exp_end_date,
      ),
    }
    delete newRegistry.created_at
    delete newRegistry.updated_at
    delete newRegistry.past_ecl_approved

    this.service.updateRegistry(newRegistry as UpdatePastEclExpDto).subscribe({
      next: () => {
        this.doneMessage = 'Registro editado com sucesso.'
        this.done = true
        this.ngOnInit()
        this.isLoading = false
      },
      error: (err) => {
        this.errorMessage = err.message
        this.error = true
        this.isLoading = false
      },
    })
  }

  showError(message: string) {
    this.errorMessage = message
    this.error = true
    this.isLoading = false
  }

  deleteRegistry(id: number) {
    this.isLoading = true
    this.service.deleteRegistry(id).subscribe({
      next: () => {
        this.doneMessage = 'Registro removido com sucesso.'
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

  closeError() {
    this.error = false
  }

  closeDone() {
    this.done = false
  }
}
