import { Component, Input } from '@angular/core'
import {
  CreatePreviousMarriageDto,
  IPreviousMarriage,
  UpdatePreviousMarriageDto,
} from './types'
import { PreviousMarriageService } from './previous-marriage.service'
import { IPermissions } from '../../shared/container/types'
import { UpdateOrdinationDto } from '../ordinations/types'
import { DataService } from '../../shared/shared.service.ts/data.service'

@Component({
  selector: 'app-previous-marriage',
  templateUrl: './previous-marriage.component.html',
  styleUrls: ['./previous-marriage.component.css'],
})
export class PreviousMarriageComponent {
  @Input() permissions!: IPermissions

  allRegistries: IPreviousMarriage[] = []
  title = 'Casamento Prévio'
  createRegistryData: CreatePreviousMarriageDto = {
    marriage_end_date: '',
  }

  showBox = false
  showForm = false
  isLoading = false
  done = false
  doneMessage = ''
  error = false
  errorMessage = ''

  constructor(
    private service: PreviousMarriageService,
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
        marriage_end_date: this.dataService.dateFormatter(
          this.createRegistryData.marriage_end_date,
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
    const newRegistry: Partial<IPreviousMarriage> = {
      marriage_end_date: this.dataService.dateFormatter(
        this.allRegistries[index].marriage_end_date,
      ),
      previous_marriage_id: parseInt(
        this.allRegistries[index].previous_marriage_id.toString(),
      ),
      student_id: parseInt(this.allRegistries[index].student_id.toString()),
    }
    delete newRegistry.created_at
    delete newRegistry.updated_at
    delete newRegistry.previous_marriage_approved

    this.service
      .updateRegistry(newRegistry as UpdatePreviousMarriageDto)
      .subscribe({
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
