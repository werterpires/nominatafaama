import { Component, Input, OnInit } from '@angular/core'
import { IPermissions } from '../../shared/container/types'
import { EclExpTypesService } from '../../parameterization/ecl-exp-types/ecl-exp-types.service'
import { IEclExperienceList } from '../../parameterization/ecl-exp-types/types'
import { EclExperiencesService } from './ecl-experiences.service'
import { IEclExperience, UpdateEclExperiencesDto } from './types'

@Component({
  selector: 'app-ecl-experiences',
  templateUrl: './ecl-experiences.component.html',
  styleUrls: ['./ecl-experiences.component.css'],
})
export class EclExperiencesComponent implements OnInit {
  @Input() permissions!: IPermissions

  allRegistries: IEclExperience[] = []
  title = 'Experiências Eclesiásticas (durante o Salt)'
  allRegistriesWithChecks: IEclExperienceList[] = []

  showBox = false
  isLoading = false
  done = false
  doneMessage = ''
  error = false
  errorMessage = ''

  constructor(
    private service: EclExperiencesService,
    private eclExptypesService: EclExpTypesService,
  ) {}

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
  confirm(response: { confirm: boolean; func: string }) {
    const { confirm, func } = response

    if (!confirm) {
      this.resetAlert()
    } else if (func == 'edit') {
      this.editRegistry()
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
    this.allRegistries = []
    this.allRegistriesWithChecks = []
    if (this.showBox) {
      this.getAllEclExpTypes()
    }
  }

  toShowBox() {
    this.showBox = !this.showBox
    if (this.showBox) {
      console.log('entrou')
      this.getAllEclExpTypes()
    } else if (!this.showBox) {
      this.allRegistries = []
      this.allRegistriesWithChecks = []
    }
  }

  getAllEclExpTypes() {
    this.isLoading = true
    this.allRegistries = []
    this.allRegistriesWithChecks = []
    this.eclExptypesService.findAllRegistries().subscribe({
      next: (res) => {
        this.service.findAllRegistries().subscribe({
          next: (ress) => {
            this.allRegistriesWithChecks.splice(0)
            res.forEach((registry) => {
              this.allRegistriesWithChecks.push({
                ...registry,
                checked: !!ress.find(
                  (reg) => reg.ecl_exp_type_id == registry.ecl_exp_type_id,
                ),
                approved: !!ress.find((reg) => {
                  if (
                    reg.ecl_exp_type_id == registry.ecl_exp_type_id &&
                    reg.ecl_exp_approved == true
                  ) {
                    return true
                  } else if (
                    reg.ecl_exp_type_id == registry.ecl_exp_type_id &&
                    reg.ecl_exp_approved == false
                  ) {
                    return false
                  } else {
                    return null
                  }
                }),
              })
            })
            this.isLoading = false
          },
          error: (err) => {
            this.errorMessage = err.message
            this.error = true
            this.isLoading = false
          },
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

  editRegistry() {
    this.isLoading = true

    const typeIds: number[] = []
    this.allRegistriesWithChecks.forEach((registry) => {
      if (registry.checked) {
        typeIds.push(registry.ecl_exp_type_id)
      }
    })

    const newRegistry: UpdateEclExperiencesDto = {
      ecl_exp_type_id: typeIds,
    }

    this.service.updateRegistry(newRegistry).subscribe({
      next: (res) => {
        this.doneMessage =
          'Todos os registros passíveis de edição foram editados com sucesso.'
        this.ngOnInit()
        this.done = true
        this.isLoading = false
      },
      error: (err) => {
        this.errorMessage = err.message
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
