import { Component, Input } from '@angular/core'
import { IPermissions } from '../../shared/container/types'
import {
  ICreateOtherInvitesTime,
  IOtherInvitesTime,
  IUpdateOtherInvitesTime,
} from './types'
import { IAssociation } from '../associations/types'
import { OtherInvitesTimesService } from './other-invites-times.service'
import { DataService } from '../../shared/shared.service.ts/data.service'

@Component({
  selector: 'app-other-invites-times',
  templateUrl: './other-invites-times.component.html',
  styleUrls: ['./other-invites-times.component.css'],
})
export class OtherInvitesTimesComponent {
  @Input() permissions!: IPermissions
  @Input() shortNominatas: { nominataId: number; year: string }[] = []
  @Input() allAssociations: IAssociation[] = []

  allRegistries: IOtherInvitesTime[] = []

  chosenNominata = ''

  createRegistryData: ICreateOtherInvitesTime = {
    nominataId: 0,
    fieldId: 0,
    invitesBegin: '',
  }

  showBox = false
  showForm = false
  title = 'Campos com exceções para convites'

  isLoading = false
  done = false
  doneMessage = ''
  error = false
  errorMessage = ''

  constructor(
    private service: OtherInvitesTimesService,
    private dataService: DataService,
  ) {}

  findAllRegistries() {
    if (this.chosenNominata === '') {
      return
    }
    this.isLoading = true
    this.service
      .findAllRegistriesByNominata(parseInt(this.chosenNominata))
      .subscribe({
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

  createRegistry() {
    this.isLoading = true
    this.service
      .createRegistry({
        nominataId: parseInt(this.createRegistryData.nominataId.toString()),
        fieldId: parseInt(this.createRegistryData.fieldId.toString()),
        invitesBegin: this.dataService.dateFormatter(
          this.createRegistryData.invitesBegin,
        ),
      })
      .subscribe({
        next: () => {
          this.doneMessage = 'Registro criado com sucesso.'
          this.findAllRegistries()
          this.done = true
          this.isLoading = false
          this.showForm = false
          this.createRegistryData = {
            nominataId: 0,
            fieldId: 0,
            invitesBegin: '',
          }
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
    const updateData: IUpdateOtherInvitesTime = {
      otherInvitesTimeId: this.allRegistries[index].fields_invites_id,
      invitesBegin: this.dataService.dateFormatter(
        this.allRegistries[index].invites_begin,
      ),
    }

    this.service.updateRegistry(updateData).subscribe({
      next: () => {
        this.doneMessage = 'Registro editado com sucesso.'
        this.done = true
        document.getElementById(buttonId)?.classList.add('hidden')
        this.findAllRegistries()
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
      next: () => {
        this.doneMessage = 'Registro removido com sucesso.'
        this.done = true
        this.findAllRegistries()
        this.isLoading = false
      },
      error: (err) => {
        this.errorMessage = err.message
        this.error = true
        this.isLoading = false
      },
    })
  }
}
