import { Component, Input } from '@angular/core'
import { IPermissions } from '../../shared/container/types'
import { CreatePastEclExpDto, IPastEclExp, UpdatePastEclExpDto } from './types'
import { PastEclExpService } from './past-ecl-exps.service'
import { DataService } from '../../shared/shared.service.ts/data.service'

@Component({
  selector: 'app-past-ecl-exps',
  templateUrl: './past-ecl-exps.component.html',
  styleUrls: ['./past-ecl-exps.component.css'],
})
export class PastEclExpsComponent {
  @Input() permissions!: IPermissions

  allRegistries: IPastEclExp[] = []
  title = 'Experiências profissionais e evangelísticas passadas'
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

  ngOnInit() {
    this.getAllRegistries()
  }

  getAllRegistries() {
    this.isLoading = true
    this.service.findAllRegistries().subscribe({
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
        next: (res) => {
          this.doneMessage = 'Registro criado com sucesso.'
          this.done = true
          this.isLoading = false
          this.getAllRegistries()
          this.showForm = false
          this.resetCreationRegistry()
        },
        error: (err) => {
          this.errorMessage = err.message
          this.error = true
          this.isLoading = false
        },
      })
  }

  editRegistry(index: number, buttonId: string) {
    this.isLoading = true
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

    console.log(newRegistry)

    this.service.updateRegistry(newRegistry as UpdatePastEclExpDto).subscribe({
      next: (res) => {
        this.doneMessage = 'Registro editado com sucesso.'
        this.done = true
        document.getElementById(buttonId)?.classList.add('hidden')
        this.isLoading = false
      },
      error: (err) => {
        this.errorMessage = err.message
        this.error = true
        this.isLoading = false
      },
    })
  }

  deleteRegistry(id: number) {
    this.isLoading = true
    this.service.deleteRegistry(id).subscribe({
      next: (res) => {
        this.doneMessage = 'Registro removido com sucesso.'
        this.done = true
        this.isLoading = false
        this.ngOnInit()
      },
      error: (err) => {
        this.errorMessage = 'Não foi possível remover o registro.'
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
