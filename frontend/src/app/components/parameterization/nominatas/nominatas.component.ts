import { Component, Input } from '@angular/core'
import { IPermissions } from '../../shared/container/types'
import { ICreateNominataDto, INominata, IUpdateNominata } from './types'
import { NominatasService } from './nominatas.service'
import { DataService } from '../../shared/shared.service.ts/data.service'

@Component({
  selector: 'app-nominatas',
  templateUrl: './nominatas.component.html',
  styleUrls: ['./nominatas.component.css'],
})
export class NominatasComponent {
  @Input() permissions!: IPermissions

  allRegistries: INominata[] = []
  title = 'Nominatas'
  createRegistryData: ICreateNominataDto = {
    orig_field_invites_begin: '',
    year: '',
  }

  showBox = false
  showForm = false
  isLoading = false
  done = false
  doneMessage = ''
  error = false
  errorMessage = ''

  constructor(
    private service: NominatasService,
    private dataService: DataService,
  ) {}

  ngOnInit() {
    this.createRegistryData = {
      orig_field_invites_begin: '',
      year: '',
    }
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

    const updateNominataData: IUpdateNominata = {
      nominata_id: this.allRegistries[index].nominata_id,
      orig_field_invites_begin: this.dataService.dateFormatter(
        this.allRegistries[index].orig_field_invites_begin,
      ),
      year: this.allRegistries[index].year,
    }

    this.service.updateRegistry(updateNominataData).subscribe({
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
