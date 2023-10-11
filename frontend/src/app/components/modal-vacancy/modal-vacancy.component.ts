import { Component, EventEmitter, Input, Output } from '@angular/core'
import { AssociationService } from '../parameterization/associations/associations.service'
import { IAssociation } from '../parameterization/associations/types'
import { HiringStatusService } from '../records/hiring-status/hiring_status.service'
import { IHiringStatus } from '../records/hiring-status/types'
import { ICreateDirectVacancy } from './types'
import { ModalVacancyService } from './modal-vacancy.service'
import { IHiringField } from '../nominata/types'

@Component({
  selector: 'app-modal-vacancy',
  templateUrl: './modal-vacancy.component.html',
  styleUrls: ['./modal-vacancy.component.css'],
})
export class ModalVacancyComponent {
  show = false
  gotten = false
  isLoading = false
  error = false
  errorMessage = ''
  done = false
  doneMessage = ''

  @Input() studentId!: number
  @Output() changeHiring = new EventEmitter<void>()

  associations: IAssociation[] = []
  hiringStatus: IHiringStatus[] = []

  @Input() hiringField!: IHiringField | null

  association = ''
  @Input() status = ''

  constructor(
    private associationsService: AssociationService,
    private hiringStatusService: HiringStatusService,
    private service: ModalVacancyService,
  ) {}

  getAllAssociations(): Promise<void> {
    this.isLoading = true
    return new Promise<void>((resolve, reject) => {
      this.associationsService.findAllRegistries().subscribe({
        next: (res) => {
          this.associations = res
          this.isLoading = false
          resolve()
        },
        error: (err) => {
          this.errorMessage = err.message
          this.error = true
          this.isLoading = false
          reject(err)
        },
      })
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
        this.changeHiring.emit()
        this.doneMessage = 'Registro criado com sucesso.'
        this.done = true
        this.show = false
        this.isLoading = false
      },
      error: (err) => {
        this.errorMessage = err.message
        this.error = true
        this.isLoading = false
      },
    })

    console.log('chegou aqui')
  }

  showForm() {
    if (!this.show && !this.gotten) {
      this.getAllAssociations().then(() => {
        if (this.hiringField) {
          const matchingAssociation = this.associations.find((association) => {
            return (
              association.association_acronym ===
              this.hiringField?.association_acronym
            )
          })

          if (matchingAssociation) {
            this.association = matchingAssociation.association_id.toString()
          } else {
            this.association = '0'
          }
        } else {
          this.association = '0' // Defina o valor padrão '0' se hiringField for nulo.
        }
      })
      this.getAllHiringStatus()
      this.gotten = !this.gotten
    }

    this.show = !this.show
  }

  closeDone() {
    this.done = false
  }

  closeError() {
    this.error = false
  }
}
