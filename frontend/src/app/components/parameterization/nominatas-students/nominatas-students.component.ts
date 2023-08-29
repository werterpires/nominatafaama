import { Component, Input } from '@angular/core'
import { IPermissions } from '../../shared/container/types'
import { IStudent } from '../../records/students/types'
import { INominata } from '../nominatas/types'
import { CreateNominataStudents, ISinteticStudent } from './types'
import { NominatasStudentsService } from './nominatas-students.service'
import { NominatasService } from '../nominatas/nominatas.service'

@Component({
  selector: 'app-nominatas-students',
  templateUrl: './nominatas-students.component.html',
  styleUrls: ['./nominatas-students.component.css'],
})
export class NominatasStudentsComponent {
  @Input() permissions!: IPermissions

  allRegistries: ISinteticStudent[] = []
  allNominatas: INominata[] = []
  title = 'Estudantes de cada nominata'
  createRegistryData: CreateNominataStudents = {
    nominata_id: 0,
    student_id: [],
  }

  atualNominataStudents: ISinteticStudent[] = []
  atualOtherStudents: ISinteticStudent[] = []
  filteredOtherStudents: ISinteticStudent[] = []
  chosenStudent!: string

  showBox = false
  showForm = true
  isLoading = false
  done = false
  doneMessage = ''
  error = false
  errorMessage = ''

  constructor(
    private service: NominatasStudentsService,
    private nominataService: NominatasService,
  ) {}

  ngOnInit() {
    this.createRegistryData = {
      nominata_id: 0,
      student_id: [],
    }
    this.getAllNominatas()
  }

  getAllNominatas() {
    this.isLoading = true
    this.service.findAllNominatas().subscribe({
      next: (res) => {
        this.allNominatas = res.sort((a, b) => {
          if (a.year > b.year) {
            return -1
          } else if (a.year < b.year) {
            return 1
          } else {
            return 0
          }
        })
        this.createRegistryData.nominata_id = this.allNominatas[0].nominata_id
        this.getAllNominataStudents()
        this.isLoading = false
      },
      error: (err) => {
        this.errorMessage = err.message
        this.error = true
        this.isLoading = false
      },
    })
  }

  getAllNominataStudents() {
    this.isLoading = true
    this.service.findAllStudents().subscribe({
      next: (res) => {
        this.allRegistries = res.sort((a, b) => {
          if (a.name < b.name) {
            return -1
          } else if (a.name > b.name) {
            return 1
          } else {
            return 0
          }
        })

        this.filterStudents()

        this.isLoading = false
      },
      error: (err) => {
        this.errorMessage = err.message
        this.error = true
        this.isLoading = false
      },
    })
  }

  filterStudents() {
    this.atualNominataStudents = []
    this.atualOtherStudents = []

    this.allRegistries.forEach((student) => {
      if (
        student.nominata_id?.includes(
          parseInt(this.createRegistryData.nominata_id.toString()),
        )
      ) {
        this.atualNominataStudents.push(student)
      } else {
        this.atualOtherStudents.push(student)
      }
    })
    this.filterOtherStudents()
  }

  filterOtherStudents() {
    this.filteredOtherStudents = []
    if (!this.chosenStudent) {
      this.filteredOtherStudents = this.atualOtherStudents
    } else {
      this.filteredOtherStudents = this.atualOtherStudents.filter(
        (student) =>
          student.name.includes(this.chosenStudent) ||
          student.cpf.includes(this.chosenStudent),
      )
    }
  }

  deleteStudentFromNominata(id: number) {
    const index = this.atualNominataStudents.findIndex(
      (obj) => obj.student_id === id,
    )

    if (index !== -1) {
      const removedObject = this.atualNominataStudents.splice(index, 1)[0]
      this.atualOtherStudents.push(removedObject)
      this.atualOtherStudents.sort((a, b) => a.name.localeCompare(b.name))
    }
    this.filterOtherStudents()
  }

  addStudentToNominata(id: number) {
    const index = this.atualOtherStudents.findIndex(
      (obj) => obj.student_id === id,
    )

    if (index !== -1) {
      const removedObject = this.atualOtherStudents.splice(index, 1)[0]
      this.atualNominataStudents.push(removedObject)
      this.atualNominataStudents.sort((a, b) => a.name.localeCompare(b.name))
    }
    this.filterOtherStudents()
  }

  createRegistry() {
    this.isLoading = true
    let studentIds: number[]
    this.createRegistryData.nominata_id = parseInt(
      this.createRegistryData.nominata_id.toString(),
    )
    this.atualNominataStudents.forEach((student) => {
      this.createRegistryData.student_id.push(student.student_id)
    })

    this.service.createRegistry(this.createRegistryData).subscribe({
      next: (res) => {
        this.doneMessage = 'Registro criado com sucesso.'
        this.done = true
        this.createRegistryData.student_id = []
        this.getAllNominataStudents()
        this.isLoading = false
      },
      error: (err) => {
        this.errorMessage = err.message
        this.error = true
        this.isLoading = false
      },
    })
  }

  // deleteRegistry(id: number) {
  //   this.isLoading = true
  //   this.service.deleteRegistry(id).subscribe({
  //     next: (res) => {
  //       this.doneMessage = 'Registro removido com sucesso.'
  //       this.done = true
  //       this.isLoading = false
  //       this.ngOnInit()
  //     },
  //     error: (err) => {
  //       this.errorMessage = 'Não foi possível remover o registro.'
  //       this.error = true
  //       this.isLoading = false
  //     },
  //   })
  // }

  closeError() {
    this.error = false
  }

  closeDone() {
    this.done = false
  }
}
