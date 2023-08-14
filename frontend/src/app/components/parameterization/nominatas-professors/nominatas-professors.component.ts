import { Component, Input } from '@angular/core'
import { IPermissions } from '../../shared/container/types'
import { INominata } from '../nominatas/types'
import { CreateNominataProfessors, ISinteticProfessor } from './types'
import { NominatasProfessorsService } from './nominatas-professors.service'
import { NominatasService } from '../nominatas/nominatas.service'

@Component({
  selector: 'app-nominatas-professors',
  templateUrl: './nominatas-professors.component.html',
  styleUrls: ['./nominatas-professors.component.css'],
})
export class NominatasProfessorsComponent {
  @Input() permissions!: IPermissions

  allRegistries: ISinteticProfessor[] = []
  allNominatas: INominata[] = []
  title = 'Professores de cada nominata'
  createRegistryData: CreateNominataProfessors = {
    nominata_id: 0,
    professor_id: [],
  }

  atualNominataProfessors: ISinteticProfessor[] = []
  atualOtherProfessors: ISinteticProfessor[] = []
  filteredOtherProfessors: ISinteticProfessor[] = []
  chosenProfessor!: string

  showBox = false
  showForm = true
  isLoading = false
  done = false
  doneMessage = ''
  error = false
  errorMessage = ''

  constructor(
    private service: NominatasProfessorsService,
    private nominataService: NominatasService,
  ) {}

  ngOnInit() {
    this.createRegistryData = {
      nominata_id: 0,
      professor_id: [],
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
        this.getAllNominataProfessors()
        this.isLoading = false
      },
      error: (err) => {
        this.errorMessage = err.message
        this.error = true
        this.isLoading = false
      },
    })
  }

  getAllNominataProfessors() {
    this.isLoading = true
    this.service.findAllProfessors().subscribe({
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

        this.filterProfessors()

        this.isLoading = false
      },
      error: (err) => {
        this.errorMessage = err.message
        this.error = true
        this.isLoading = false
      },
    })
  }

  filterProfessors() {
    this.atualNominataProfessors = []
    this.atualOtherProfessors = []
    console.log('avaliando a nominata', this.createRegistryData.nominata_id),
      this.allRegistries.forEach((professor) => {
        if (
          professor.nominata_id?.includes(
            parseInt(this.createRegistryData.nominata_id.toString()),
          )
        ) {
          this.atualNominataProfessors.push(professor)
        } else {
          this.atualOtherProfessors.push(professor)
          console.log(professor.nominata_id)
        }
      })
    this.filterOtherProfessors()
  }

  filterOtherProfessors() {
    this.filteredOtherProfessors = []
    if (!this.chosenProfessor) {
      this.filteredOtherProfessors = this.atualOtherProfessors
    } else {
      this.filteredOtherProfessors = this.atualOtherProfessors.filter(
        (professor) =>
          professor.name.includes(this.chosenProfessor) ||
          professor.cpf.includes(this.chosenProfessor),
      )
    }
    console.log(this.filteredOtherProfessors)
  }

  deleteProfessorFromNominata(id: number) {
    const index = this.atualNominataProfessors.findIndex(
      (obj) => obj.professor_id === id,
    )

    if (index !== -1) {
      const removedObject = this.atualNominataProfessors.splice(index, 1)[0]
      this.atualOtherProfessors.push(removedObject)
      this.atualOtherProfessors.sort((a, b) => a.name.localeCompare(b.name))
    }
    this.filterOtherProfessors()
  }

  addProfessorToNominata(id: number) {
    const index = this.atualOtherProfessors.findIndex(
      (obj) => obj.professor_id === id,
    )

    console.log(index)
    if (index !== -1) {
      const removedObject = this.atualOtherProfessors.splice(index, 1)[0]
      this.atualNominataProfessors.push(removedObject)
      this.atualNominataProfessors.sort((a, b) => a.name.localeCompare(b.name))
    }
    this.filterOtherProfessors()
  }

  createRegistry() {
    this.isLoading = true
    let professorIds: number[]
    this.createRegistryData.nominata_id = parseInt(
      this.createRegistryData.nominata_id.toString(),
    )
    this.atualNominataProfessors.forEach((professor) => {
      this.createRegistryData.professor_id.push(professor.professor_id)
    })

    this.service.createRegistry(this.createRegistryData).subscribe({
      next: (res) => {
        this.doneMessage = 'Registro criado com sucesso.'
        this.done = true
        this.createRegistryData.professor_id = []
        this.getAllNominataProfessors()
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
