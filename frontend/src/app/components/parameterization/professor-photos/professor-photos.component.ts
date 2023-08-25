import { Component, Input } from '@angular/core'
import {
  CreateStudentPhotoDto,
  IStudentPhoto,
  UpdateStudentPhotoDto,
  receiveStudentPhoto,
} from './types'
import { ProfessorsPhotosService } from './professor-photos.service'
import { IPermissions } from '../../shared/container/types'
import { ISinteticProfessor } from '../nominatas-professors/types'

@Component({
  selector: 'app-professor-photos',
  templateUrl: './professor-photos.component.html',
  styleUrls: ['./professor-photos.component.css'],
})
export class ProfessorPhotosComponent {
  @Input() permissions!: IPermissions
  allRegistries: ISinteticProfessor[] = []
  photo: IStudentPhoto[] = []
  title = 'Pequena foto do professor'
  selectedProfessor!: number
  createRegistryData!: File
  showBox = true
  showForm = false
  isLoading = false
  done = false
  doneMessage = ''
  error = false
  errorMessage = ''
  constructor(private service: ProfessorsPhotosService) {}
  ngOnInit() {
    this.allRegistries = []
    this.imageUrl = null
    this.getAllRegistries()
  }

  getAllRegistries() {
    this.isLoading = true
    this.service.findAllRegistries().subscribe({
      next: (res) => {
        this.allRegistries = res
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
  imageUrl: string | null = null

  getPhoto() {
    this.isLoading = true
    console.log(this.selectedProfessor)
    this.service.findAllPhotos(this.selectedProfessor).subscribe({
      next: (res) => {
        if (res instanceof Blob) {
          const reader = new FileReader()
          reader.onload = (e: any) => {
            this.imageUrl = e.target.result
            this.isLoading = false
          }
          reader.readAsDataURL(res)
        } else {
          this.imageUrl = null
          this.showForm = true
          this.isLoading = false
        }
      },
      error: (err) => {
        if (err.status == 404) {
          this.imageUrl = null
          this.isLoading = false
        } else {
          this.errorMessage = err.message
          this.error = true
          this.isLoading = false
        }
      },
    })
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0]
    const reader = new FileReader()

    reader.onload = (e: any) => {
      this.imageUrl = e.target.result
    }
    reader.readAsDataURL(file)
    this.createRegistryData = event.srcElement.files[0]
  }

  createRegistry() {
    this.isLoading = true

    if (this.createRegistryData) {
    }
    const formData = new FormData()
    formData.append(
      'file',
      this.createRegistryData,
      this.createRegistryData.name,
    )

    this.service.createRegistry(formData, this.selectedProfessor).subscribe({
      next: (res) => {
        this.doneMessage = 'Registro criado com sucesso.'
        this.done = true
        // this.ngOnInit()
        this.isLoading = false
      },
      error: (err) => {
        this.errorMessage = err.message
        this.error = true
        this.isLoading = false
      },
    })
  }
  editRegistry(index: number, buttonId: string) {
    this.isLoading = true
    const newRegistry: Partial<IStudentPhoto> = {
      ...this.photo[index],
    }
    delete newRegistry.created_at
    delete newRegistry.updated_at
    this.service
      .updateRegistry(newRegistry as UpdateStudentPhotoDto)
      .subscribe({
        next: (res) => {
          this.doneMessage = 'Registro editado com sucesso.'
          this.done = true
          document.getElementById(buttonId)?.classList.add('hidden')
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
