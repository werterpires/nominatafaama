import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core'
import { IPermissions } from '../../shared/container/types'
import { DataService } from '../../shared/shared.service.ts/data.service'
import { OthersServices } from '../../shared/shared.service.ts/others.service'
import { ICity, IUF } from '../../shared/types'
import { SpouseService } from './spouses.service'
import { ICreateSpouse, ISpouse, IUpdateSpouse } from './types'
import { ValidateService } from '../../shared/shared.service.ts/validate.services'
import { AssociationService } from '../../parameterization/associations/associations.service'
import { IAssociation } from '../../parameterization/associations/types'

@Component({
  selector: 'app-spouses',
  templateUrl: './spouses.component.html',
  styleUrls: ['./spouses.component.css'],
})
export class SpousesComponent implements OnInit {
  constructor(
    private service: SpouseService,
    private associationService: AssociationService,
    private othersService: OthersServices,
    public dataService: DataService,
    private validateService: ValidateService,
  ) {}
  @ViewChild('phoneNumberInput') phoneNumberInput!: ElementRef
  @Input() permissions!: IPermissions

  possibleAssociantions!: IAssociation[]
  allAssociations: IAssociation[] = []
  allUnions: string[] = []
  allStates!: IUF[]
  allBirthCities!: ICity[]
  allSchoolCities!: ICity[]
  allMerryCities!: ICity[]
  selectedUnion = ''

  registry: ISpouse | null = null
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
  showForm = true
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
  confirm(response: { confirm: boolean; func: string }) {
    const { confirm, func } = response

    if (!confirm) {
      this.resetAlert()
    } else if (func == 'edit') {
      this.editRegistry()
      this.resetAlert()
    } else if (func == 'create') {
      this.createRegistry()
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
    this.possibleAssociantions = []
    this.allAssociations = []
    this.allUnions = []
    this.allStates = []
    this.allBirthCities = []
    this.allSchoolCities = []
    this.allMerryCities = []
    this.selectedUnion = ''
    this.selectedUnion = ''
    this.registry = null

    if (this.showBox) {
      this.getAllRegistries()
    }

    if (this.registry != null) {
      this.showForm = false
    }
  }

  toShowBox() {
    this.showBox = !this.showBox
    if (this.showBox) {
      this.getAllRegistries()
    } else if (!this.showBox) {
      this.registry = {
        alternative_email: '',
        baptism_date: '',
        baptism_place: '',
        birth_city: '',
        birth_date: '',
        birth_state: '',
        civil_marriage_city: '',
        civil_marriage_date: '',
        civil_marriage_state: '',
        is_whatsapp: false,
        justification: '',
        origin_field_id: 0,
        phone_number: '',
        primary_school_city: '',
        primary_school_state: '',
        registry: '',
        registry_number: '',
        association_acronym: '',
        association_id: 0,
        association_name: '',
        created_at: '',
        person_cpf: '',
        person_id: 0,
        person_name: '',
        updated_at: '',
        spouse_approved: null,
        spouse_id: 0,
        student_id: 0,
        union_acronym: '',
        union_id: 0,
        union_name: '',
      }
    }
  }

  getAllRegistries() {
    this.isLoading = true
    this.service.findRegistryById().subscribe({
      next: (res) => {
        if (res?.spouse_id > 0) {
          this.registry = res
          this.formatarCPF('update')
          this.formatarTelefone('update')
          this.selectedUnion = this.registry.union_acronym
        } else {
          this.showBox = true
          this.showForm = true
        }
        this.possibleAssociantions = []
        this.allBirthCities = []
        this.allMerryCities = []
        this.allSchoolCities = []
        this.allAssociations = []
        this.allStates = []

        this.getOtherData()

        this.isLoading = false
      },
      error: (err) => {
        this.showBox = true
        this.showForm = true
        this.errorMessage = err.message
        this.error = true
        this.getOtherData()
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
          } else if (a.union_name > b.union_name) {
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
        this.findCities('birth')
        this.findCities('merry')
        this.findCities('school')
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

    if (
      this.validateService.validateNameData(this.createRegistryData.name) ==
      false
    ) {
      this.errorMessage = 'Insira um nome válido para cadastrar o cônjuge.'
      this.error = true
      this.isLoading = false
      return
    }
    this.createRegistryData.cpf = this.createRegistryData.cpf.replace(
      /[^\d]/g,
      '',
    )
    if (
      this.validateService.validateCpfData(this.createRegistryData.cpf) == false
    ) {
      this.errorMessage = 'Insira um cpf válido para cadastrar o cônjuge.'
      this.error = true
      this.isLoading = false
      return
    }

    if (
      this.validateService.validatePhoneNumber(
        this.createRegistryData.phone_number,
      ) == false
    ) {
      this.showError('Digite um número de telefone válido.')
      return
    }

    if (
      this.validateService.validateEmailData(
        this.createRegistryData.alternative_email,
      ) == false
    ) {
      this.showError('Insira um email válido.')
      return
    }

    if (parseInt(this.createRegistryData.origin_field_id.toString()) < 1) {
      this.showError(
        'Escolha um campo de origem para prosseguir com o cadastro.',
      )
      return
    }

    if (this.createRegistryData.justification.length < 1) {
      this.showError(
        'Justifique por que você acha que esse é o campo de origem do seu cônjuge.',
      )
      return
    }

    if (this.createRegistryData.birth_date.length < 1) {
      this.showError(
        'Informe a data de nascimento para prosseguir com o cadastro.',
      )
      return
    }

    if (
      this.createRegistryData.birth_state.length < 1 ||
      this.createRegistryData.birth_city.length < 1
    ) {
      this.showError(
        'Informe um estado e uma cidade de nascimento para prosseguir com o cadastro.',
      )
      return
    }

    if (
      this.createRegistryData.primary_school_state.length < 1 ||
      this.createRegistryData.primary_school_city.length < 1
    ) {
      this.showError(
        'Informe o estado e a cidade onde completou o ensino fundamental para prosseguir com o cadastro.',
      )
      return
    }

    if (
      this.dataService.maritalStatusName == 'Casado' &&
      (this.createRegistryData.civil_marriage_date == null ||
        this.createRegistryData.civil_marriage_date.length != 10)
    ) {
      this.showError(
        'Informe a data de casamento para prosseguir com o cadastro.',
      )
      return
    }

    if (
      (this.dataService.maritalStatusName == 'Casado' &&
        (this.createRegistryData.civil_marriage_state == null ||
          this.createRegistryData.civil_marriage_state.length < 1 ||
          this.createRegistryData.civil_marriage_city == null ||
          this.createRegistryData.civil_marriage_city.length < 1)) ||
      this.createRegistryData.registry == null ||
      this.createRegistryData.registry.length < 1 ||
      this.createRegistryData.registry_number == null ||
      this.createRegistryData.registry_number.length < 1
    ) {
      this.showError(
        'Uma vez que você é casado, é obrigatório informar o estado, a cidade, o cartório e o número do registro do casamento.',
      )
      return
    }

    if (this.createRegistryData.baptism_date.length < 1) {
      this.showError(
        'Informe a data de batismo para prosseguir com o cadastro.',
      )
      return
    }

    if (this.createRegistryData.baptism_place.length < 1) {
      this.showError(
        'Informe o local de batismo para prosseguir com o cadastro.',
      )
      return
    }

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
        cpf: this.createRegistryData.cpf.replace(/\D/g, ''),
      })
      .subscribe({
        next: () => {
          this.doneMessage = 'Registro criado com sucesso.'
          this.done = true
          this.ngOnInit()
          this.showForm = false
          this.resetCreationRegistry()
          this.isLoading = false
        },
        error: (err) => {
          this.errorMessage = err.message
          this.error = true
          this.showForm = false
          this.isLoading = false
        },
      })
  }

  editRegistry() {
    this.isLoading = true
    if (this.registry == null) {
      return
    }

    if (
      this.validateService.validateNameData(this.registry.person_name) == false
    ) {
      this.errorMessage = 'Insira um nome válido para cadastrar o cônjuge.'
      this.error = true
      this.isLoading = false
      return
    }
    this.registry.person_cpf = this.registry.person_cpf.replace(/[^\d]/g, '')
    if (
      this.validateService.validateCpfData(this.registry.person_cpf) == false
    ) {
      this.errorMessage = 'Insira um cpf válido para cadastrar o cônjuge.'
      this.error = true
      this.isLoading = false
      return
    }

    if (
      this.validateService.validatePhoneNumber(this.registry.phone_number) ==
      false
    ) {
      this.showError('Digite um número de telefone válido.')
      return
    }

    if (
      this.validateService.validateEmailData(this.registry.alternative_email) ==
      false
    ) {
      this.showError('Insira um email válido.')
      return
    }

    if (parseInt(this.registry.origin_field_id.toString()) < 1) {
      this.showError(
        'Escolha um campo de origem para prosseguir com o cadastro.',
      )
      return
    }

    if (this.registry.justification.length < 1) {
      this.showError(
        'Justifique por que você acha que esse é o campo de origem do seu cônjuge.',
      )
      return
    }

    if (this.registry.birth_date.length < 1) {
      this.showError(
        'Informe a data de nascimento para prosseguir com o cadastro.',
      )
      return
    }

    if (
      this.registry.birth_state.length < 1 ||
      this.registry.birth_city.length < 1
    ) {
      this.showError(
        'Informe um estado e uma cidade de nascimento para prosseguir com o cadastro.',
      )
      return
    }

    if (
      this.registry.primary_school_state.length < 1 ||
      this.registry.primary_school_city.length < 1
    ) {
      this.showError(
        'Informe o estado e a cidade onde completou o ensino fundamental para prosseguir com o cadastro.',
      )
      return
    }

    if (
      this.dataService.maritalStatusName == 'Casado' &&
      (this.registry.civil_marriage_date == null ||
        this.registry.civil_marriage_date.length != 10)
    ) {
      this.showError(
        'Informe a data de casamento para prosseguir com o cadastro.',
      )
      return
    }

    if (
      (this.dataService.maritalStatusName == 'Casado' &&
        (this.registry.civil_marriage_state == null ||
          this.registry.civil_marriage_state.length < 1 ||
          this.registry.civil_marriage_city == null ||
          this.registry.civil_marriage_city.length < 1)) ||
      this.registry.registry == null ||
      this.registry.registry.length < 1 ||
      this.registry.registry_number == null ||
      this.registry.registry_number.length < 1
    ) {
      this.showError(
        'Uma vez que você é casado, é obrigatório informar o estado, a cidade, o cartório e o número do registro do casamento.',
      )
      return
    }

    if (this.registry.baptism_date.length < 1) {
      this.showError(
        'Informe a data de batismo para prosseguir com o cadastro.',
      )
      return
    }

    if (this.registry.baptism_place.length < 1) {
      this.showError(
        'Informe o local de batismo para prosseguir com o cadastro.',
      )
      return
    }
    const newRegistry: IUpdateSpouse = {
      alternative_email: this.registry.alternative_email,
      baptism_date: this.dataService.dateFormatter(this.registry.baptism_date),
      baptism_place: this.registry.baptism_place,
      birth_city: this.registry.birth_city,
      birth_date: this.dataService.dateFormatter(this.registry.birth_date),
      birth_state: this.registry.birth_state,
      civil_marriage_city: this.registry.civil_marriage_city,
      civil_marriage_date: this.registry.civil_marriage_date
        ? this.dataService.dateFormatter(this.registry.civil_marriage_date)
        : null,
      civil_marriage_state: this.registry.civil_marriage_state,
      cpf: this.registry.person_cpf,
      is_whatsapp: this.registry.is_whatsapp,
      justification: this.registry.justification,
      name: this.registry.person_name,
      origin_field_id: parseInt(this.registry.origin_field_id.toString()),
      person_id: this.registry.person_id,
      phone_number: this.registry.phone_number,
      primary_school_city: this.registry.primary_school_city,
      primary_school_state: this.registry.primary_school_state,
      registry: this.registry.registry,
      registry_number: this.registry.registry_number,
      spouse_id: this.registry.spouse_id,
    }

    this.service.updateRegistry(newRegistry as IUpdateSpouse).subscribe({
      next: () => {
        this.doneMessage = 'Registro editado com sucesso.'
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

  formatarCPF(type: string) {
    let formattedCPF = ''
    let cpf = ''
    if (type === 'create') {
      cpf = this.createRegistryData.cpf
    } else if (type == 'update') {
      cpf = this.registry ? this.registry.person_cpf : ''
    }
    cpf = cpf.replace(/\D/g, '')

    if (cpf.length > 3) {
      formattedCPF = cpf.replace(/(\d{3})/, '$1.')
    }
    if (cpf.length > 6) {
      formattedCPF = cpf.replace(/(\d{3})(\d{3})/, '$1.$2.')
    }
    if (cpf.length > 9) {
      formattedCPF = cpf.replace(/(\d{3})(\d{3})(\d{3})/, '$1.$2.$3-')
    }

    if (type === 'create') {
      this.createRegistryData.cpf = formattedCPF
    } else if (type === 'update') {
      this.registry
        ? (this.registry.person_cpf = formattedCPF)
        : (this.registry = null)
    }

    this.createRegistryData.cpf = formattedCPF
  }

  formatarTelefone(type: string) {
    let formatedNumber = ''
    let phoneNumber = ''
    if (type === 'create') {
      phoneNumber = this.createRegistryData.phone_number
    } else if (type == 'update') {
      phoneNumber = this.registry ? this.registry.phone_number : ''
    }
    phoneNumber = phoneNumber.replace(/\D/g, '')

    if (phoneNumber.length > 0) {
      formatedNumber = '(' + phoneNumber.substring(0, 2) + ') '
    }
    if (phoneNumber.length > 2) {
      formatedNumber += phoneNumber.substring(2, 6) + '-'
    }
    if (phoneNumber.length > 7) {
      formatedNumber += phoneNumber.substring(6, 10)
    }
    if (phoneNumber.length == 11) {
      formatedNumber = phoneNumber.replace(
        /(\d{2})(\d{5})(\d{4})/,
        '($1) $2-$3',
      )
    }

    if (type === 'create') {
      this.createRegistryData.phone_number = formatedNumber
    } else if (type === 'update') {
      this.registry
        ? (this.registry.phone_number = formatedNumber)
        : (this.registry = null)
    }
  }

  showError(message: string) {
    this.errorMessage = message
    this.error = true
    this.isLoading = false
  }

  filterAssociation(change?: boolean) {
    this.possibleAssociantions = this.allAssociations.filter((association) => {
      return association.union_acronym == this.selectedUnion
    })

    if (change && this.registry) {
      this.registry.origin_field_id =
        this.possibleAssociantions[0].association_id
    }
  }

  findCities(cityType: string) {
    let sigla = ''
    if (cityType == 'birth') {
      sigla = this.registry?.birth_state || this.createRegistryData.birth_state
    } else if (cityType == 'school') {
      sigla =
        this.registry?.primary_school_state ||
        this.createRegistryData.primary_school_state
    } else if (cityType == 'merry') {
      sigla =
        this.registry?.civil_marriage_state ||
        this.createRegistryData.civil_marriage_state ||
        ''
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
