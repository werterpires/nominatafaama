import { Component, Input, OnInit } from '@angular/core'
import { IPermissions } from '../../shared/container/types'
import {
  CreateFieldRepresentationDto,
  IFieldRepresentation,
  UpdateFieldRepresentationDto,
} from './types'
import { RepresentationsService } from './representations.service'
import { UnionService } from '../unions/unions.service'
import { IUnion } from '../unions/types'
import { IAssociation } from '../../parameterization/associations/types'
import { AssociationService } from '../../parameterization/associations/associations.service'
import { DatePipe } from '@angular/common'

@Component({
  selector: 'app-representations',
  templateUrl: './representations.component.html',
  styleUrls: ['./representations.component.css'],
})
export class RepresentationsComponent implements OnInit {
  constructor(
    private representationsService: RepresentationsService,
    private unionsService: UnionService,
    private associationsService: AssociationService,
    public datePipe: DatePipe,
  ) {}

  @Input() permissions!: IPermissions
  registries: IFieldRepresentation[] = []
  allUnions: IUnion[] = []
  selectedUnion = 0
  selectedUnionGroup: number[] = []
  allAssociations: IAssociation[] = []
  filteredAssociations: IAssociation[] = []
  filteredAssociationsGroup: IAssociation[][] = []

  title = 'Representações de campo'

  showBox = false
  showForm = false
  isLoading = false
  done = false
  doneMessage = ''
  error = false
  errorMessage = ''

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

  createRegistryData: CreateFieldRepresentationDto = {
    representedFieldID: 0,
    functionn: '',
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
    } else if (func == 'create') {
      this.createRegistry()
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
    }
  }

  resetAlert() {
    this.index = null
    this.func = ''
    this.alertMessage = ''
    this.alert = false
  }

  ngOnInit() {
    if (this.showBox) {
      this.getRegistries()
    }
  }

  toShowBox() {
    this.showBox = !this.showBox
    if (this.showBox) {
      this.getRegistries()
    } else if (!this.showBox) {
      this.registries = []
    }
  }

  getRegistries() {
    this.isLoading = true
    this.representationsService.findRegistries().subscribe({
      next: (res) => {
        if (res && res.length > 0) {
          this.registries = []
          this.registries = res
        } else {
          this.registries = []
          this.showBox = true
          this.showForm = false
        }

        this.getUnions()
        this.getAssociations()

        this.isLoading = false
      },
      error: (err) => {
        this.showBox = true
        this.showForm = true
        this.errorMessage = err.message
        this.error = true
        this.isLoading = false
      },
    })
  }

  getUnions() {
    this.isLoading = true
    this.unionsService.findAllRegistries().subscribe({
      next: (res) => {
        this.allUnions = []
        if (res && res.length > 0) {
          this.allUnions = res
        } else {
          this.showBox = true
          this.showForm = false
        }
        this.isLoading = false
      },
      error: (err) => {
        this.showBox = true
        this.showForm = true
        this.errorMessage = err.message
        this.error = true
        this.isLoading = false
      },
    })
  }

  getAssociations() {
    this.isLoading = true
    this.associationsService.findAllRegistries().subscribe({
      next: (res) => {
        this.allAssociations = []
        if (res && res.length > 0) {
          this.allAssociations = res
          this.setGroups()
        } else {
          this.showBox = true
          this.showForm = false
        }
        this.isLoading = false
      },
      error: (err) => {
        this.showBox = true
        this.showForm = true
        this.errorMessage = err.message
        this.error = true
        this.isLoading = false
      },
    })
  }

  setGroups() {
    this.selectedUnionGroup = []

    this.filteredAssociationsGroup = []
    for (let i = 0; i < this.registries.length; i++) {
      this.selectedUnionGroup.push(this.setUnion(i))

      this.filteredAssociationsGroup.push(this.allAssociations)

      this.filterRegistryAssociations(i)
    }
  }

  setUnion(idx: number) {
    const unionId =
      this.allAssociations.find((association) => {
        if (
          association.association_id === this.registries[idx].representedFieldID
        ) {
          return true
        } else {
          return false
        }
      })?.union_id || 0

    return unionId
  }

  filterAssociation() {
    this.filteredAssociations = this.allAssociations.filter((association) => {
      return association.union_id == this.selectedUnion
    })
    this.createRegistryData.representedFieldID =
      this.filteredAssociations[0].association_id
  }

  filterRegistryAssociations(idx: number) {
    this.filteredAssociationsGroup[idx] = this.allAssociations.filter(
      (association) => {
        return association.union_id == this.selectedUnionGroup[idx]
      },
    )
    this.registries[idx].representedFieldID =
      this.filteredAssociationsGroup[idx][0].association_id
  }

  createRegistry() {
    this.isLoading = true
    if (this.createRegistryData.functionn.length < 1) {
      this.showError(
        'Escreva a função desempenhada para prosseguir com o registro.',
      )
      return
    }
    if (this.createRegistryData.representedFieldID < 1) {
      this.showError(
        'Escolha um campo ao qual representa para prosseguir com o registro.',
      )
      return
    }

    const newRepresentation: CreateFieldRepresentationDto = {
      functionn: this.createRegistryData.functionn,
      representedFieldID: parseInt(
        this.createRegistryData.representedFieldID.toString(),
      ),
    }
    this.representationsService
      .createRepresentation(newRepresentation)
      .subscribe({
        next: () => {
          this.doneMessage = 'Dados gravados com sucesso.'
          this.done = true
          this.showForm = false
          this.getRegistries()
          this.isLoading = false
        },
        error: (err) => {
          this.errorMessage = err.message
          this.error = true
          this.isLoading = false
        },
      })
  }

  editRegistry(i: number) {
    this.isLoading = true
    if (this.registries[i].functionn.length < 1) {
      this.showError(
        'Escreva a função desempenhada para prosseguir com a edição.',
      )
      return
    }
    if (this.registries[i].representedFieldID < 1) {
      this.showError(
        'Escolha um campo ao qual representa para prosseguir com a edição.',
      )
      return
    }
    const editRepresentation: UpdateFieldRepresentationDto = {
      functionn: this.registries[i].functionn,
      representedFieldID: parseInt(
        this.registries[i].representedFieldID.toString(),
      ),
      representationID: this.registries[i].representationID,
    }
    this.representationsService
      .updateRepresentation(editRepresentation)
      .subscribe({
        next: () => {
          this.doneMessage = 'Dados editados com sucesso.'
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

  deleteRegistry(representationID: number) {
    this.representationsService
      .deleteRepresentation(representationID)
      .subscribe({
        next: () => {
          this.doneMessage = 'Representação deletada com sucesso.'
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

  formatDate(date: string) {
    return this.datePipe.transform(date, 'dd/MM/yyyy')
  }

  showError(message: string) {
    this.errorMessage = message
    this.error = true
    this.isLoading = false
  }

  closeError() {
    this.error = false
  }

  closeDone() {
    this.done = false
  }
}
