import { Component, Input } from '@angular/core'
import {
  CreateStudentPhotoDto,
  IStudentPhoto,
  UpdateStudentPhotoDto,
  receiveStudentPhoto,
} from './types'
import { StudentPhotosService } from './small-alone-student-photos.service'
import { IPermissions } from '../../shared/container/types'

@Component({
  selector: 'app-small-alone-student-photos',
  templateUrl: './small-alone-student-photos.component.html',
  styleUrls: ['./small-alone-student-photos.component.css'],
})
export class SmallAloneStudentPhotosComponent {
  @Input() permissions!: IPermissions
  allRegistries: IStudentPhoto[] = []
  title = 'Pequena foto do estudante'
  createRegistryData!: File
  showBox = false
  showForm = false
  isLoading = false
  done = false
  doneMessage = ''
  error = false
  errorMessage = ''
  constructor(private service: StudentPhotosService) {}
  ngOnInit() {
    this.getAllRegistries()
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

  getAllRegistries() {
    this.isLoading = true
    this.service.findAllRegistries().subscribe({
      next: (res) => {
        console.log(res)
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
    console.log(event)

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

    this.service.createRegistry(formData).subscribe({
      next: (res) => {
        this.doneMessage = 'Registro criado com sucesso.'
        this.done = true
        this.isLoading = false
        this.getAllRegistries()
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
      ...this.allRegistries[index],
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
