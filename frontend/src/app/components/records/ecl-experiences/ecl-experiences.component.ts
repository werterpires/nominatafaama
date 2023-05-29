import { Component, Input } from '@angular/core'
import { IPermissions } from '../../shared/container/types'
import { EclExpTypesService } from '../ecl-exp-types/ecl-exp-types.service'
import { IEclExperienceList } from '../ecl-exp-types/types'
import { EclExperiencesService } from './ecl-experiences.service'
import { IEclExperience, UpdateEclExperiencesDto } from './types'

@Component({
  selector: 'app-ecl-experiences',
  templateUrl: './ecl-experiences.component.html',
  styleUrls: ['./ecl-experiences.component.css'],
})
export class EclExperiencesComponent {
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

  ngOnInit() {
    this.getAllEclExpTypes()
  }

  getAllRegistries() {}

  getAllEclExpTypes() {
    this.isLoading = true
    this.eclExptypesService.findAllRegistries().subscribe({
      next: (res) => {
        this.isLoading = true
        this.service.findAllRegistries().subscribe({
          next: (ress) => {
            this.allRegistriesWithChecks.splice(0)
            res.forEach((registry) => {
              this.allRegistriesWithChecks.push({
                ...registry,
                checked: !!ress.find(
                  (reg) => reg.ecl_exp_type_id == registry.ecl_exp_type_id,
                ),
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

        console.log('Registros com checks: ', this.allRegistriesWithChecks)
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
        this.doneMessage = 'Registro editado com sucesso.'
        this.getAllEclExpTypes()
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
