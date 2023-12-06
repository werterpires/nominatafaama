import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { IAssociation } from 'src/app/components/parameterization/associations/types'
import { IMaritalStatus } from 'src/app/components/parameterization/marital-status/types'
import { StudentService } from 'src/app/components/records/students/students.service'
import {
  IStudent,
  IUpdateStudent,
} from 'src/app/components/records/students/types'

import { DataService } from 'src/app/components/shared/shared.service.ts/data.service'
import { ErrorServices } from 'src/app/components/shared/shared.service.ts/error.service'
import { ValidateService } from 'src/app/components/shared/shared.service.ts/validate.services'
import { ICity, IUF } from 'src/app/components/shared/types'

@Component({
  selector: 'app-student-approve',
  templateUrl: './student-approve.component.html',
  styleUrls: [
    './student-approve.component.css',
    '../one-student-to-approve.component.css',
  ],
})
export class StudentApproveComponent implements OnInit {
  @Input() student!: IStudent
  @Input() allAssociations: IAssociation[] = []
  @Input() allMaritalStatus: IMaritalStatus[] = []
  @Input() allStates: IUF[] = []
  @Input() allBirthCities: ICity[] = []
  @Input() allSchoolCities: ICity[] = []

  @Output() atualizeEmitter = new EventEmitter()

  possibleAssociations: IAssociation[] = []
  allUnions: string[] = []

  done = false
  doneMessage = ''
  isLoading = false

  constructor(
    public dataService: DataService,
    private validateService: ValidateService,
    private errorService: ErrorServices,
    private studentsService: StudentService,
  ) {}

  ngOnInit(): void {
    if (!this.student) {
      return
    }
    this.student.phone_number = this.dataService.formatarTelefone(
      this.student.phone_number,
    )
    this.findAllUnions()

    this.dataService.filterAssociation(
      this.possibleAssociations,
      this.allAssociations,
      this.student.union_acronym,
    )
    this.dataService.findCities(
      this.student.birth_state,
      this.allStates,
      this.allBirthCities,
      this.student.birth_city,
    )
    this.dataService.findCities(
      this.student.primary_school_state,
      this.allStates,
      this.allSchoolCities,
      this.student.primary_school_city,
    )
  }

  findAllUnions() {
    this.allUnions = this.allAssociations.reduce(
      (accumulator: string[], association: IAssociation) => {
        if (!accumulator.includes(association.union_acronym)) {
          accumulator.push(association.union_acronym)
        }
        return accumulator
      },
      [],
    )
  }

  editRegistry() {
    this.isLoading = true

    if (
      this.validateService.validatePhoneNumber(this.student.phone_number) ==
      false
    ) {
      this.errorService.showError('Digite um número detelefone válido.')
      return
    }

    if (
      this.validateService.validateEmailData(this.student.alternative_email) ==
      false
    ) {
      this.errorService.showError(
        'Insira um email válido para adicionar os dados.',
      )
      return
    }

    if (parseInt(this.student.origin_field_id.toString()) < 1) {
      this.errorService.showError(
        'Escolha um campo de origem para prosseguir com o cadastro.',
      )
      return
    }

    if (this.student.justification.length < 1) {
      this.errorService.showError(
        'Justifique por que você acha que esse é seu campo de origem.',
      )
      return
    }

    if (this.student.marital_status_id < 1) {
      this.errorService.showError(
        'Escolha um estado civil para prosseguir com o cadastro.',
      )
      return
    }

    if (this.student.birth_date.length < 1) {
      this.errorService.showError(
        'Informe a data de nascimento para prosseguir com o cadastro.',
      )
      return
    }

    if (
      this.student.birth_state.length < 1 ||
      this.student.birth_city.length < 1
    ) {
      this.errorService.showError(
        'Informe um estado e uma cidade de nascimento para prosseguir com o cadastro.',
      )
      return
    }

    if (
      this.student.primary_school_state.length < 1 ||
      this.student.primary_school_city.length < 1
    ) {
      this.errorService.showError(
        'Informe o estado e a cidade onde completou o ensino fundamental para prosseguir com o cadastro.',
      )
      return
    }

    if (this.student.baptism_date.length < 1) {
      this.errorService.showError(
        'Informe a data de batismo para prosseguir com o cadastro.',
      )
      return
    }

    if (this.student.baptism_place.length < 12) {
      this.errorService.showError(
        'Informe o local de batismo para prosseguir com o cadastro.',
      )
      return
    }

    if (this.student.student_mensage.length < 12) {
      this.errorService.showError(
        'Escolha uma mensagem bíblica que represente seu estilo de ministério para prosseguir com o cadastro.',
      )
      return
    }
    this.student.origin_field_id = Number(this.student.origin_field_id)
    this.student.marital_status_id = Number(this.student.marital_status_id)
    this.student.hiring_status_id = Number(this.student.hiring_status_id)
    const isWhats = this.student.is_whatsapp == 1

    const editStudentData: IUpdateStudent = {
      student_id: this.student.student_id,
      phone_number: this.student.phone_number.replace(/\D/g, ''),
      is_whatsapp: isWhats,
      alternative_email: this.student.alternative_email,
      student_mensage: this.student.student_mensage,
      person_id: this.student.person_id,
      origin_field_id: this.student.origin_field_id,
      justification: this.student.justification,
      birth_city: this.student.birth_city,
      birth_state: this.student.birth_state,
      primary_school_city: this.student.primary_school_city,
      primary_school_state: this.student.primary_school_state,
      birth_date: this.dataService.dateFormatter(this.student.birth_date),
      baptism_date: this.dataService.dateFormatter(this.student.baptism_date),
      baptism_place: this.student.baptism_place,
      marital_status_id: Number(this.student.marital_status_id),
    }

    this.studentsService.updateStudent(editStudentData).subscribe({
      next: () => {
        this.doneMessage = 'Estudante editado com sucesso.'

        this.done = true
        this.isLoading = false
      },
      error: (err) => {
        this.errorService.showError(err.message)
        this.isLoading = false
      },
    })
  }

  emitAtualize() {
    this.atualizeEmitter.emit()
  }
  closeDone() {
    this.done = false
  }
}
