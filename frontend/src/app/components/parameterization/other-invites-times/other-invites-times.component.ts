import { Component, Input } from '@angular/core'
import { IPermissions } from '../../shared/container/types'
import { ICreateOtherInvitesTime } from './types'
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
  @Input() shortNominatas: { nominataId: number; year: number }[] = []
  @Input() allAssociations: IAssociation[] = []

  createRegistryData: ICreateOtherInvitesTime = {
    nominataId: 0,
    fieldId: 0,
    invitesBegin: '',
  }

  showBox = true
  showForm = true
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
}
