import { Component, Input, OnInit } from '@angular/core'
import { IPermissions } from '../../shared/container/types'
import { EclExpTypesService } from '../../parameterization/ecl-exp-types/ecl-exp-types.service'
import {
  IEclExpType,
  IEclExperienceList,
} from '../../parameterization/ecl-exp-types/types'
import { EclExperiencesService } from './ecl-experiences.service'
import { IEclExperience, UpdateEclExperiencesDto } from './types'

@Component({
  selector: 'app-ecl-experiences',
  templateUrl: './ecl-experiences.component.html',
  styleUrls: ['./ecl-experiences.component.css'],
})
export class EclExperiencesComponent implements OnInit {
  @Input() permissions!: IPermissions
  @Input() approve = false
  @Input() userId: number | null = null

  allRegistries: IEclExperience[] = []
  title = 'Experiências Eclesiásticas (durante o Salt)'
  allRegistriesWithChecks: IEclExperienceList[] = []
  allTypes: IEclExpType[] = []

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
      next: (resType) => {
        this.allTypes = resType
        this.service.findAllRegistries(this.userId).subscribe({
          next: (ressEcl) => {
            this.allRegistries = ressEcl
            this.allRegistriesWithChecks.splice(0)
            resType.forEach((registryType) => {
              this.allRegistriesWithChecks.push({
                ...registryType,
                checked: !!ressEcl.find(
                  (regEcl) =>
                    regEcl.ecl_exp_type_id == registryType.ecl_exp_type_id,
                ),
                approved: ((): null | boolean => {
                  // Utilize uma variável local para manter o escopo de registryType
                  const specificRegistry = ressEcl.find(
                    (someEcl) =>
                      someEcl.ecl_exp_type_id == registryType.ecl_exp_type_id,
                  )
                  if (!specificRegistry) {
                    return null
                  }
                  return specificRegistry.ecl_exp_approved
                })(),
              })
            })
            this.addIds()
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

  addIds() {
    let AtualRegistry
    this.allRegistriesWithChecks.forEach((registry) => {
      AtualRegistry = this.allRegistries.find(
        (reg) => reg.ecl_exp_type_id == registry.ecl_exp_type_id,
      )
      registry.ecl_exp_id = AtualRegistry?.ecl_exp_id
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
      next: () => {
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
