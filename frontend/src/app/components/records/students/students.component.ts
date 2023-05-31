import { Component, Input } from '@angular/core'
import { IPermissions } from '../../shared/container/types'
import { DataService } from '../../shared/shared.service.ts/data.service'
import { OthersServices } from '../../shared/shared.service.ts/others.service'
import { ICity, IUF } from '../../shared/types'
import { AssociationService } from '../associations/associations.service'
import { IAssociation } from '../associations/types'
import { HiringStatusService } from '../hiring-status/hiring_status.service'
import { IHiringStatus } from '../hiring-status/types'
import { MaritalStatusService } from '../marital-status/marital-status.service'
import { IMaritalStatus } from '../marital-status/types'
import { StudentService } from './students.service'
import { ICreateStudent, IStudent, IUpdateStudent } from './types'

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css'],
})
export class StudentsComponent {
  constructor(
    private studentServices: StudentService,
    private associationService: AssociationService,
    private hiringStatusService: HiringStatusService,
    private maritalStatusService: MaritalStatusService,
    private othersService: OthersServices,
    private dataService: DataService,
  ) {}

  @Input() permissions!: IPermissions
  registry: IStudent = {
    name: '',
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
  showForm = false
  isLoading = false
  done = false
  doneMessage = ''
  error = false
  errorMessage = ''

  ngOnInit() {
    this.getRegistry()
  }

  getRegistry() {
    this.isLoading = true
    this.studentServices.findRegistry().subscribe({
      next: (res) => {
        if (res && res.student_id) {
          this.registry = res
          this.dataService.maritalStatusName =
            this.registry.marital_status_type_name
        }
        this.getAllOtherData()
      },
      error: (err) => {
        this.errorMessage = err.message
        this.error = true
        this.isLoading = false
        this.getAllOtherData()
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
        console.log('Uniões', this.allUnions)
        if (this.registry.student_id) {
          this.filterAssociation()
          console.log('Possíveis associações', this.possibleAssociantions)
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
          } else if (a.hiring_status_name < b.hiring_status_name) {
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
          } else if (a.marital_status_type_name < b.marital_status_type_name) {
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
    this.isLoading = true

    console.log(
      'birthDate:',
      new Date(this.registry.birth_date),
      'baptism_date:',
      new Date(this.registry.baptism_date),
    )

    const newStudent: ICreateStudent = {
      alternative_email: this.registry.alternative_email,
      baptism_date: this.dataService.dateFormatter(this.registry.baptism_date),
      baptism_place: this.registry.baptism_place,
      birth_city: this.registry.birth_city,
      birth_date: this.dataService.dateFormatter(this.registry.birth_date),
      birth_state: this.registry.birth_state,
      hiring_status_id: parseInt(this.registry.hiring_status_id.toString()),
      is_whatsapp: !!this.registry.is_whatsapp,
      justification: this.registry.justification,
      marital_status_id: parseInt(this.registry.marital_status_id.toString()),
      origin_field_id: parseInt(this.registry.origin_field_id.toString()),
      phone_number: this.registry.phone_number,
      primary_school_city: this.registry.primary_school_city,
      primary_school_state: this.registry.primary_school_state,
      student_mensage: this.registry.student_mensage,
    }

    this.studentServices.createStudent(newStudent).subscribe({
      next: (res) => {
        this.doneMessage = 'Estudante criado com sucesso.'
        this.done = true
        this.isLoading = false
        this.getRegistry()
      },
      error: (err) => {
        this.errorMessage = 'Não foi possível criar o estudante.'
        this.error = true
        this.isLoading = false
      },
    })
  }

  editRegistry() {
    this.isLoading = true
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
      hiring_status_id: this.registry.hiring_status_id,
    }

    this.studentServices.updateStudent(editStudentData).subscribe({
      next: (res) => {
        this.doneMessage = 'Estudante editado com sucesso.'
        this.done = true
        this.isLoading = false
      },
      error: (err) => {
        this.errorMessage = 'Não foi possível atualizar o estudante.'
        this.error = true
        this.isLoading = false
      },
    })
  }

  deleteRegistry(id: number) {
    this.isLoading = true
    const studentId = this.registry.student_id

    this.studentServices.deleteStudent(studentId).subscribe({
      next: (res) => {
        this.doneMessage = 'Associação deletada com sucesso.'
        this.done = true
        this.isLoading = false
      },
      error: (err) => {
        this.errorMessage = 'Não foi possível deletar a associação.'
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

  closeError() {
    this.error = false
  }

  closeDone() {
    this.done = false
  }
}
