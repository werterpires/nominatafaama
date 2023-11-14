import { Component } from '@angular/core'
import { CreateVacancyDto } from './types'
import { IMinistryType } from '../parameterization/minstry-types/types'
import { IVacancy } from './vacancy/Types'
import { VacanciesService } from './vacancies.service'
import { IHiringStatus } from '../parameterization/hiring-status/types'
import { HiringStatusService } from '../parameterization/hiring-status/hiring_status.service'
import { MinistryTypesService } from '../parameterization/minstry-types/ministry-types.service'

@Component({
  selector: 'app-vacancies',
  templateUrl: './vacancies.component.html',
  styleUrls: ['./vacancies.component.css'],
})
export class VacanciesComponent {
  showForm = false
  alert = false
  alertMessage = ''
  func = ''
  index: number | null = null
  isLoading = false
  done = false
  doneMessage = ''
  error = false
  errorMessage = ''

  createRegistryData: CreateVacancyDto = {
    description: '',
    hiringStatusId: 0,
    ministryId: 0,
    nominataId: 0,
    title: '',
  }
  allVacancies: IVacancy[] = []
  allNominatas: { nominataId: number; year: number }[] = []
  allMinistries: IMinistryType[] = []
  selectedNominata!: number
  allHiringStatus: IHiringStatus[] = []

  constructor(
    private vacanciesService: VacanciesService,
    private hiringStatusService: HiringStatusService,
    private ministryTypesService: MinistryTypesService,
  ) {}

  showAlert(func: string, message: string, idx?: number) {
    this.index = idx ?? this.index
    this.func = func
    this.alertMessage = message
    this.alert = true
  }

  async ngOnInit() {
    this.getAllMinistries()
  }

  async getAllVacancies() {
    this.isLoading = true
    this.vacanciesService
      .findAllRegistries(parseInt(this.selectedNominata.toString()))
      .subscribe({
        next: (res) => {
          this.allVacancies = res

          this.isLoading = false
        },
        error: (err) => {
          this.errorMessage = err
          this.error = true
          this.isLoading = false
        },
      })
  }

  getAllNominatasYears() {
    this.isLoading = true
    this.vacanciesService.findAllNominataYearsRegistries().subscribe({
      next: async (res) => {
        this.allNominatas = res
        this.selectedNominata = this.allNominatas[0].nominataId
        this.getAllVacancies()
        this.isLoading = false
      },
      error: (err) => {
        this.errorMessage = err
        this.error = true
        this.isLoading = false
      },
    })
  }
  getAllHiringStatus() {
    this.isLoading = true
    this.hiringStatusService.findAllRegistries().subscribe({
      next: (res) => {
        this.allHiringStatus = res

        this.getAllNominatasYears()
        this.isLoading = false
      },
      error: (err) => {
        this.errorMessage = err
        this.error = true
        this.isLoading = false
      },
    })
  }

  getAllMinistries() {
    this.isLoading = true
    this.ministryTypesService.findAllRegistries().subscribe({
      next: (res) => {
        this.allMinistries = res

        this.getAllHiringStatus()
        this.isLoading = false
      },
      error: (err) => {
        this.errorMessage = err
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

  createVacancy() {
    this.isLoading = true
    if (this.selectedNominata < 1) {
      this.showError('Selecione um ano para prosseguir com o registro.')
      return
    }
    if (this.createRegistryData.title.length < 3) {
      this.showError('Insira um título para prosseguir com o registro.')
      return
    }
    if (this.createRegistryData.description.length < 5) {
      this.showError('Insira uma descrição para prosseguir com o registro.')
      return
    }
    if (this.createRegistryData.ministryId < 1) {
      this.showError('Selecione um ministério para prosseguir com o registro.')
      return
    }
    if (this.createRegistryData.hiringStatusId < 1) {
      this.showError(
        'Selecione um status de contratação para prosseguir com o registro.',
      )
      return
    }
    this.createRegistryData.nominataId = parseInt(
      this.selectedNominata.toString(),
    )

    this.createRegistryData.ministryId = parseInt(
      this.createRegistryData.ministryId.toString(),
    )
    this.createRegistryData.hiringStatusId = parseInt(
      this.createRegistryData.hiringStatusId.toString(),
    )

    this.vacanciesService.createRegistry(this.createRegistryData).subscribe({
      next: () => {
        this.ngOnInit()
        this.isLoading = false
        this.showForm = false
        this.createRegistryData = {
          title: '',
          description: '',
          ministryId: 0,
          nominataId: 0,
          hiringStatusId: 0,
        }
      },
      error: (err) => {
        this.errorMessage = err
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
  confirm(response: { confirm: boolean; func: string }) {
    const { confirm, func } = response

    if (!confirm) {
      this.resetAlert()
    } else if (func == 'edit') {
      // if (this.index == null) {
      //   this.errorMessage = 'Index não localizado. Impossível editar.'
      //   this.error = true
      //   this.resetAlert()
      //   return
      // }
      // this.editRegistry(this.index)
      // this.resetAlert()
    } else if (func == 'delete') {
      // if (this.index == null) {
      //   this.errorMessage = 'Index não localizado. Impossível deletar.'
      //   this.error = true
      //   this.resetAlert()
      //   return
      // }
      // this.deleteRegistry(this.index)
      // this.resetAlert()
    } else if (func == 'create') {
      this.createVacancy()
      this.resetAlert()
    }
  }

  resetAlert() {
    this.index = null
    this.func = ''
    this.alertMessage = ''
    this.alert = false
  }
}
