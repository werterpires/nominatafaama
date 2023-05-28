import { Component, Input } from '@angular/core'
import { IPermissions } from '../../shared/container/types'
import { IUnion } from '../unions/types'
import { UnionService } from '../unions/unions.service'
import { AssociationService } from './associations.service'
import { CreateAssociationDto, IAssociation } from './types'

@Component({
  selector: 'app-associations',
  templateUrl: './associations.component.html',
  styleUrls: ['./associations.component.css'],
})
export class AssociationsComponent {
  @Input() permissions!: IPermissions

  allRegistries: IAssociation[] = []
  allUnions: IUnion[] = []
  title = 'Associações'
  createRegistryData: CreateAssociationDto = {
    association_acronym: '',
    association_name: '',
    union_id: 0,
  }

  showBox = false
  showForm = false
  isLoading = false
  done = false
  doneMessage = ''
  error = false
  errorMessage = ''

  constructor(
    private service: AssociationService,
    private unionService: UnionService,
  ) {}

  ngOnInit() {
    this.getAllRegistries()
    this.getAllUnions()
  }

  getAllRegistries() {
    this.isLoading = true
    this.service.findAllRegistries().subscribe({
      next: (res) => {
        this.allRegistries = res.sort((a, b) => {
          if (a.union_name < b.union_name) {
            return -1
          } else if (a.union_name > b.union_name) {
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
  }

  getAllUnions() {
    this.isLoading = true
    this.unionService.findAllUnions().subscribe({
      next: (res) => {
        this.allUnions = res.sort((a, b) => {
          if (a.union_name < b.union_name) {
            return -1
          } else if (a.union_name < b.union_name) {
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
        union_id: parseInt(this.createRegistryData.union_id.toString()),
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

    const newRegisgry: Partial<IAssociation> = {
      ...this.allRegistries[index],
    }

    delete newRegisgry.union_name
    delete newRegisgry.union_acronym
    delete newRegisgry.created_at
    delete newRegisgry.updated_at

    this.service.updateRegistry(newRegisgry as IAssociation).subscribe({
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
