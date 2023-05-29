import { Component, Input } from '@angular/core'
import { IPermissions } from '../../shared/container/types'
import { DataService } from '../../shared/shared.service.ts/data.service'
import { OthersServices } from '../../shared/shared.service.ts/others.service'
import { ICity, IUF } from '../../shared/types'
import { AssociationService } from '../associations/associations.service'
import { IAssociation } from '../associations/types'
import { IHiringStatus } from '../hiring-status/types'
import { IMaritalStatus } from '../marital-status/types'
import { SpouseService } from './spouses.service'
import { ICreateSpouse, ISpouse, IUpdateSpouse } from './types'

@Component({
  selector: 'app-spouses',
  templateUrl: './spouses.component.html',
  styleUrls: ['./spouses.component.css'],
})
export class SpousesComponent {
  @Input() permissions!: IPermissions

  possibleAssociantions!: IAssociation[]
  allAssociations: IAssociation[] = []
  allHiringStatus: IHiringStatus[] = []
  allMaritalStatus: IMaritalStatus[] = []
  allUnions: string[] = []
  allStates!: IUF[]
  allBirthCities!: ICity[]
  allSchoolCities!: ICity[]
  allMerryCities!: ICity[]
  selectedUnion = ''

  registry!: ISpouse
  title = 'Dados do Cônjuge'
  createRegistryData: ICreateSpouse = {
    alternative_email: '',
    baptism_date: '',
    baptism_place: '',
    birth_city: '',
    birth_date: '',
    birth_state: '',
    civil_marriage_city: '',
    civil_marriage_date: '',
    civil_marriage_state: '',
    cpf: '',
    is_whatsapp: false,
    justification: '',
    name: '',
    origin_field_id: 0,
    phone_number: '',
    primary_school_city: '',
    primary_school_state: '',
    registry: '',
    registry_number: '',
  }

  showBox = false
  showForm = false
  isLoading = false
  done = false
  doneMessage = ''
  error = false
  errorMessage = ''

  constructor(
    private service: SpouseService,
    private associationService: AssociationService,
    private othersService: OthersServices,
    public dataService: DataService,
  ) {}

  ngOnInit() {
    this.getAllRegistries()
  }

  getAllRegistries() {
    this.isLoading = true
    this.service.findRegistryById().subscribe({
      next: (res) => {
        if (res?.spouse_id > 0) {
          this.registry = res

          console.log(this.registry.baptism_date)
        }
        this.getOtherData()
        this.isLoading = false
      },
      error: (err) => {
        this.errorMessage = err.message
        this.error = true
        this.isLoading = false
      },
    })
  }

  getOtherData() {
    this.isLoading = true
    this.associationService.findAllRegistries().subscribe({
      next: (res) => {
        this.allAssociations = res.sort((a, b) => {
          if (a.union_name < b.union_name) {
            return -1
          } else if (a.union_name < b.union_name) {
            return 1
          } else {
            return 0
          }
        })
        this.allAssociations.forEach((association) => {
          if (!this.allUnions.includes(association.union_acronym)) {
            this.allUnions.push(association.union_acronym)
          }
        })
        this.filterAssociation()
        console.log('Possible associations:', this.possibleAssociantions)
        this.isLoading = false
      },
      error: (err) => {
        this.errorMessage = err.message
        this.error = true
        this.isLoading = false
      },
    })

    this.othersService.findAllStates().subscribe({
      next: (res) => {
        this.allStates = res
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
        origin_field_id: parseInt(
          this.createRegistryData.origin_field_id.toString(),
        ),
        birth_date: this.dataService.dateFormatter(
          this.createRegistryData.birth_date,
        ),
        baptism_date: this.dataService.dateFormatter(
          this.createRegistryData.baptism_date,
        ),
        civil_marriage_date: this.dataService.dateFormatter(
          this.createRegistryData.civil_marriage_date || '',
        ),
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

  editRegistry() {
    this.isLoading = true

    const newRegistry: IUpdateSpouse = {
      alternative_email: this.registry.alternative_email,
      baptism_date: this.registry.baptism_date,
      baptism_place: this.registry.baptism_place,
      birth_city: this.registry.birth_city,
      birth_date: this.registry.birth_date,
      birth_state: this.registry.birth_state,
      civil_marriage_city: this.registry.civil_marriage_city,
      civil_marriage_date: this.registry.civil_marriage_date,
      civil_marriage_state: this.registry.civil_marriage_state,
      cpf: this.registry.person_cpf,
      is_whatsapp: this.registry.is_whatsapp,
      justification: this.registry.justification,
      name: this.registry.person_name,
      origin_field_id: this.registry.origin_field_id,
      person_id: this.registry.person_id,
      phone_number: this.registry.phone_number,
      primary_school_city: this.registry.primary_school_city,
      primary_school_state: this.registry.primary_school_state,
      registry: this.registry.registry,
      registry_number: this.registry.registry_number,
      spouse_approved: !!this.registry.spouse_approved,
      spouse_id: this.registry.spouse_id,
    }

    this.service.updateRegistry(newRegistry as IUpdateSpouse).subscribe({
      next: (res) => {
        this.doneMessage = 'Registro editado com sucesso.'
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

  filterAssociation() {
    this.possibleAssociantions = this.allAssociations.filter((association) => {
      return association.union_acronym == this.registry.union_acronym
    })
  }

  findCities(cityType: string) {
    let sigla = ''
    if (cityType == 'birth') {
      sigla = this.registry.birth_state
    } else if (cityType == 'school') {
      sigla = this.registry.primary_school_state
    } else if (cityType == 'merry') {
      sigla = this.registry.civil_marriage_state || ''
    }

    const state = this.allStates.find((st) => st.sigla === sigla)

    if (state) {
      this.othersService.findAllCities(state.id).subscribe({
        next: (res) => {
          if (cityType == 'birth') {
            this.allBirthCities = res
          } else if (cityType == 'school') {
            this.allSchoolCities = res
          } else if (cityType == 'merry') {
            this.allMerryCities = res
          }
        },
        error: (err) => {
          this.errorMessage = err.message
          this.error = true
          this.isLoading = false
        },
      })
    } else {
      throw Error('Estado não encontrado')
    }
  }

  closeError() {
    this.error = false
  }

  closeDone() {
    this.done = false
  }
}
