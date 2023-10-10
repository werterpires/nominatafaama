import { Component, Input } from '@angular/core'
import { AssociationService } from '../parameterization/associations/associations.service'
import { IAssociation } from '../parameterization/associations/types'
import { HiringStatusService } from '../records/hiring-status/hiring_status.service'
import { IHiringStatus } from '../records/hiring-status/types'
import { ICreateDirectVacancy } from './types'
import { ModalVacancyService } from './modal-vacancy.service'

@Component({
  selector: 'app-modal-vacancy',
  templateUrl: './modal-vacancy.component.html',
  styleUrls: ['./modal-vacancy.component.css'],
})
export class ModalVacancyComponent {
  show = false
  isLoading = false
  error = false
  errorMessage = ''

  @Input() studentId!: number

  associations: IAssociation[] = []
  hiringStatus: IHiringStatus[] = []

  association = ''
  status = ''

  constructor(
    private associationsService: AssociationService,
    private hiringStatusService: HiringStatusService,
    private service: ModalVacancyService,
  ) {}

  getAllAssociations() {
    this.isLoading = true
    this.associationsService.findAllRegistries().subscribe({
      next: (res) => {
        this.associations = res.sort((a, b) => {
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

  getAllHiringStatus() {
    this.isLoading = true
    this.hiringStatusService.findAllRegistries().subscribe({
      next: (res) => {
        this.hiringStatus = res
      },
      error: (err) => {
        this.errorMessage = err.message
        this.error = true
        this.isLoading = false
      },
    })
  }

  createDirectVacancy() {
    if (this.association.length < 1) {
      this.errorMessage = 'Escolha uma associação válida.'
      this.error = true
      return
    }

    if (this.studentId < 1) {
      this.errorMessage = 'Não foi possível identificar o estudante.'
      this.error = true
      return
    }

    if (this.status.length < 1) {
      this.errorMessage = 'Escolha um status de contratação válido.'
      this.error = true
      return
    }

    const createDirectVacancyData: ICreateDirectVacancy = {
      field_id: parseInt(this.association.toString()),
      student_id: parseInt(this.studentId.toString()),
      hiring_status_id: parseInt(this.status.toString()),
    }

    this.isLoading = true
    this.service.createRegistry(createDirectVacancyData).subscribe({
      next: (res) => {
        console.log(res)
        // this.doneMessage = 'Registro criado com sucesso.'
        // this.done = true
        // this.ngOnInit()
        // this.showForm = false
        // this.resetCreationRegistry()
        // this.isLoading = false
      },
      error: (err) => {
        this.errorMessage = err.message
        this.error = true
        this.isLoading = false
      },
    })
  }

  showForm() {
    if (this.show === false) {
      this.getAllAssociations()
      this.getAllHiringStatus()
    }

    this.show = !this.show
  }
}
