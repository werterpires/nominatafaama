import { Component, Input } from '@angular/core'
import { IPermissions } from '../../shared/container/types'
import { DataService } from '../../shared/shared.service.ts/data.service'
import { OthersServices } from '../../shared/shared.service.ts/others.service'
import { ICity, IUF } from '../../shared/types'
import { HiringStatusService } from '../../parameterization/hiring-status/hiring_status.service'
import { IHiringStatus } from '../../parameterization/hiring-status/types'
import { MaritalStatusService } from '../../parameterization/marital-status/marital-status.service'
import { IMaritalStatus } from '../../parameterization/marital-status/types'
import { StudentService } from './students.service'
import { ICreateStudent, IStudent, IUpdateStudent } from './types'
import { OnInit, ElementRef, ViewChild } from '@angular/core'
import { ValidateService } from '../../shared/shared.service.ts/validate.services'
import { AssociationService } from '../../parameterization/associations/associations.service'
import { IAssociation } from '../../parameterization/associations/types'

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css'],
})
export class StudentsComponent implements OnInit {
  constructor(
    private studentServices: StudentService,
    private associationService: AssociationService,
    private hiringStatusService: HiringStatusService,
    private maritalStatusService: MaritalStatusService,
    private othersService: OthersServices,
    private dataService: DataService,
    private validateService: ValidateService,
  ) {}
  @ViewChild('phoneNumberInput') phoneNumberInput!: ElementRef

  @Input() permissions!: IPermissions
  @Input() del = false

  @Input() approve = false
  @Input() userId: number | null = null

  registry: IStudent = {
    person_name: '',
    phone_number: '',
    is_whatsapp: false,
    alternative_email: '',
    student_mensage: '',
    person_id: 0,
    origin_field_id: 0,
    justification: '',
    birth_city: '',
    birth_state: '',
    primary_school_city: '',
    birth_date: '',
    baptism_date: '',
    baptism_place: '',
    marital_status_id: 0,
    hiring_status_id: 0,
    student_approved: null,
    student_active: false,
    student_id: 0,
    association_name: '',
    association_acronym: '',
    union_name: '',
    union_acronym: '',
    union_id: 0,
    marital_status_type_name: '',
    hiring_status_name: '',
    hiring_status_description: '',
    primary_school_state: '',
  }

  title = 'Dados gerais'
  allAssociations: IAssociation[] = []
  possibleAssociantions!: IAssociation[]
  allHiringStatus: IHiringStatus[] = []
  allMaritalStatus: IMaritalStatus[] = []
  allUnions: string[] = []
  allStates!: IUF[]
  chosenBirthStateId!: number
  allBirthCities!: ICity[]
  chosenSchollStateId!: number
  allSchoolCities!: ICity[]
  originUnion!: string
  originAssociation!: IAssociation
  chosenUnionToEdit!: string

  showBox = false
  showForm = true
  isLoading = false
  done = false
  doneMessage = ''
  error = false
  errorMessage = ''

  phoneNumber = ''

  alert = false
  alertMessage = ''
  func = ''

  ngOnInit() {
    if (this.showBox) {
      this.getRegistry()
    }

    if (this.registry.person_id == null) {
      this.showForm = false
    }
  }

  showAlert(func: string, message: string) {
    this.func = func
    this.alertMessage = message
    this.alert = true
  }

  confirm(response: { confirm: boolean; func: string }) {
    const { confirm, func } = response

    if (!confirm) {
      this.alert = false
    } else if (func == 'edit') {
      this.editRegistry()
      this.alert = false
    } else if (func == 'create') {
      this.createRegistry()
    }
  }

  toShowBox() {
    this.showBox = !this.showBox
    if (this.showBox) {
      this.getRegistry()
    } else {
      this.registry = {
        person_name: '',
        phone_number: '',
        is_whatsapp: false,
        alternative_email: '',
        student_mensage: '',
        person_id: 0,
        origin_field_id: 0,
        justification: '',
        birth_city: '',
        birth_state: '',
        primary_school_city: '',
        birth_date: '',
        baptism_date: '',
        baptism_place: '',
        marital_status_id: 0,
        hiring_status_id: 0,
        student_approved: null,
        student_active: false,
        student_id: 0,
        association_name: '',
        association_acronym: '',
        union_name: '',
        union_acronym: '',
        union_id: 0,
        marital_status_type_name: '',
        hiring_status_name: '',
        hiring_status_description: '',
        primary_school_state: '',
      }
    }
  }

  getRegistry() {
    this.isLoading = true
    this.registry = {
      person_name: '',
      phone_number: '',
      is_whatsapp: false,
      alternative_email: '',
      student_mensage: '',
      person_id: 0,
      origin_field_id: 0,
      justification: '',
      birth_city: '',
      birth_state: '',
      primary_school_city: '',
      birth_date: '',
      baptism_date: '',
      baptism_place: '',
      marital_status_id: 0,
      hiring_status_id: 0,
      student_approved: null,
      student_active: false,
      student_id: 0,
      association_name: '',
      association_acronym: '',
      union_name: '',
      union_acronym: '',
      union_id: 0,
      marital_status_type_name: '',
      hiring_status_name: '',
      hiring_status_description: '',
      primary_school_state: '',
    }
    this.studentServices.findRegistry(this.userId).subscribe({
      next: (res) => {
        if (res && res.student_id) {
          this.registry = res
          this.phoneNumber = this.registry.phone_number
          this.formatarTelefone()
          this.dataService.maritalStatusName =
            this.registry.marital_status_type_name
        } else {
          this.showBox = true
          this.showForm = true
        }

        this.allStates = []
        this.allMaritalStatus = []
        this.allAssociations = []
        this.possibleAssociantions = []
        this.getAllOtherData()
        this.isLoading = false
      },
      error: (err) => {
        this.showBox = true
        this.showForm = true
        this.errorMessage = err.message
        this.error = true
        this.getAllOtherData()
        this.isLoading = false
      },
    })
  }

  getAllOtherData() {
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
        if (this.registry.student_id) {
          this.filterAssociation()
        }
      },
      error: (err) => {
        this.errorMessage = err.message
        this.error = true
        this.isLoading = false
      },
    })

    this.hiringStatusService.findAllRegistries().subscribe({
      next: (res) => {
        this.allHiringStatus = res.sort((a, b) => {
          if (a.hiring_status_name < b.hiring_status_name) {
            return -1
          } else if (a.hiring_status_name > b.hiring_status_name) {
            return 1
          } else {
            return 0
          }
        })
      },
      error: (err) => {
        this.errorMessage = err.message
        this.error = true
        this.isLoading = false
      },
    })

    this.maritalStatusService.findAllRegistries().subscribe({
      next: (res) => {
        this.allMaritalStatus = res.sort((a, b) => {
          if (a.marital_status_type_name < b.marital_status_type_name) {
            return -1
          } else if (a.marital_status_type_name > b.marital_status_type_name) {
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

    this.othersService.findAllStates().subscribe({
      next: (res) => {
        this.allStates = res
        if (this.registry.student_id) {
          this.findCities('birth')
          this.findCities('school')
        }
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

    if (this.validateService.validatePhoneNumber(this.phoneNumber) == false) {
      this.showError('Digite um número de telefone válido.')
      return
    }

    if (
      this.validateService.validateEmailData(this.registry.alternative_email) ==
      false
    ) {
      this.showError('Insira um email válido para adicionar os dados.')
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
        'Justifique por que você acha que esse é seu campo de origem.',
      )
      return
    }

    if (this.registry.marital_status_id < 1) {
      this.showError('Escolha um estado civil para prosseguir com o cadastro.')
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

    if (this.registry.baptism_date.length < 1) {
      this.showError(
        'Informe a data de batismo para prosseguir com o cadastro.',
      )
      return
    }

    if (this.registry.baptism_place.length < 12) {
      this.showError(
        'Informe o local de batismo para prosseguir com o cadastro.',
      )
      return
    }

    if (this.registry.student_mensage.length < 12) {
      this.showError(
        'Escolha uma mensagem bíblica que represente seu estilo de ministério para prosseguir com o cadastro.',
      )
      return
    }

    const newStudent: ICreateStudent = {
      alternative_email: this.registry.alternative_email,
      baptism_date: this.dataService.dateFormatter(this.registry.baptism_date),
      baptism_place: this.registry.baptism_place,
      birth_city: this.registry.birth_city,
      birth_date: this.dataService.dateFormatter(this.registry.birth_date),
      birth_state: this.registry.birth_state,
      is_whatsapp: !!this.registry.is_whatsapp,
      justification: this.registry.justification,
      marital_status_id: parseInt(this.registry.marital_status_id.toString()),
      origin_field_id: parseInt(this.registry.origin_field_id.toString()),
      phone_number: this.phoneNumber.replace(/\D/g, ''),
      primary_school_city: this.registry.primary_school_city,
      primary_school_state: this.registry.primary_school_state,
      student_mensage: this.registry.student_mensage,
    }

    this.studentServices.createStudent(newStudent).subscribe({
      next: () => {
        this.doneMessage = 'Estudante criado com sucesso.'
        this.done = true
        this.isLoading = false
        this.getRegistry()
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

    if (this.validateService.validatePhoneNumber(this.phoneNumber) == false) {
      this.showError('Digite um número detelefone válido.')
      return
    }

    if (
      this.validateService.validateEmailData(this.registry.alternative_email) ==
      false
    ) {
      this.showError('Insira um email válido para adicionar os dados.')
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
        'Justifique por que você acha que esse é seu campo de origem.',
      )
      return
    }

    if (this.registry.marital_status_id < 1) {
      this.showError('Escolha um estado civil para prosseguir com o cadastro.')
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

    if (this.registry.baptism_date.length < 1) {
      this.showError(
        'Informe a data de batismo para prosseguir com o cadastro.',
      )
      return
    }

    if (this.registry.baptism_place.length < 12) {
      this.showError(
        'Informe o local de batismo para prosseguir com o cadastro.',
      )
      return
    }

    if (this.registry.student_mensage.length < 12) {
      this.showError(
        'Escolha uma mensagem bíblica que represente seu estilo de ministério para prosseguir com o cadastro.',
      )
      return
    }
    this.registry.origin_field_id = Number(this.registry.origin_field_id)
    this.registry.marital_status_id = Number(this.registry.marital_status_id)
    this.registry.hiring_status_id = Number(this.registry.hiring_status_id)
    const isWhats = this.registry.is_whatsapp == 1

    const editStudentData: IUpdateStudent = {
      student_id: this.registry.student_id,
      phone_number: this.registry.phone_number,
      is_whatsapp: isWhats,
      alternative_email: this.registry.alternative_email,
      student_mensage: this.registry.student_mensage,
      person_id: this.registry.person_id,
      origin_field_id: this.registry.origin_field_id,
      justification: this.registry.justification,
      birth_city: this.registry.birth_city,
      birth_state: this.registry.birth_state,
      primary_school_city: this.registry.primary_school_city,
      primary_school_state: this.registry.primary_school_state,
      birth_date: this.dataService.dateFormatter(this.registry.birth_date),
      baptism_date: this.dataService.dateFormatter(this.registry.baptism_date),
      baptism_place: this.registry.baptism_place,
      marital_status_id: Number(this.registry.marital_status_id),
    }

    this.studentServices.updateStudent(editStudentData).subscribe({
      next: () => {
        this.doneMessage = 'Estudante editado com sucesso.'
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

  filterAssociation(change?: boolean) {
    this.possibleAssociantions = this.allAssociations.filter((association) => {
      return association.union_acronym == this.registry.union_acronym
    })

    if (change) {
      this.registry.origin_field_id =
        this.possibleAssociantions[0].association_id
    }
  }

  findCities(cityType: 'birth' | 'school', specificSigla?: string) {
    let sigla!: string
    if (specificSigla) {
      sigla = specificSigla
    } else if (cityType == 'birth') {
      sigla = this.registry.birth_state
      this.allBirthCities = []
    } else if (cityType == 'school') {
      sigla = this.registry.primary_school_state
      this.allSchoolCities = []
    }

    const state = this.allStates.find((state) => state.sigla === sigla)

    if (state) {
      this.othersService.findAllCities(state.id).subscribe({
        next: (res) => {
          if (cityType == 'birth') {
            this.allBirthCities = res
            if (
              !this.allBirthCities.find(
                (cit) => cit.nome === this.registry.birth_city,
              )
            ) {
              this.registry.birth_city = ''
            }
          } else if (cityType == 'school') {
            this.allSchoolCities = res
            if (
              !this.allSchoolCities.find(
                (cit) => cit.nome === this.registry.primary_school_city,
              )
            ) {
              this.registry.primary_school_city = ''
            }
          }
        },
        error: (err) => {
          this.errorMessage = err.message
          this.error = true
          this.isLoading = false
        },
      })
    } else {
      console.error('State Id not found.')
    }
  }

  formatarTelefone() {
    let formatedNumber = ''
    this.phoneNumber = this.phoneNumber.replace(/\D/g, '')

    if (this.phoneNumber.length > 0) {
      formatedNumber = '(' + this.phoneNumber.substring(0, 2) + ') '
    }
    if (this.phoneNumber.length > 2) {
      formatedNumber += this.phoneNumber.substring(2, 6) + '-'
    }
    if (this.phoneNumber.length > 7) {
      formatedNumber += this.phoneNumber.substring(6, 10)
    }
    if (this.phoneNumber.length == 11) {
      formatedNumber = this.phoneNumber.replace(
        /(\d{2})(\d{5})(\d{4})/,
        '($1) $2-$3',
      )
    }

    this.phoneNumber = formatedNumber
  }

  showError(message: string) {
    this.errorMessage = message
    this.error = true
    this.isLoading = false
  }

  closeError() {
    this.error = false
  }

  closeDone() {
    this.done = false
  }
}
