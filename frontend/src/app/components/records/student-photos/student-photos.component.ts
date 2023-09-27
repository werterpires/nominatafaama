import { Component, Input } from '@angular/core'
import { IPermissions } from '../../shared/container/types'
import {
  IStudentPhoto,
  UpdateStudentPhotoDto,
} from '../small-alone-professor-photos/types'
import { StudentPhotosService } from './student-photos.service'

@Component({
  selector: 'app-student-photos',
  templateUrl: './student-photos.component.html',
  styleUrls: ['./student-photos.component.css'],
})
export class StudentPhotosComponent {
  @Input() permissions!: IPermissions
  allRegistries: IStudentPhoto[] = []
  title = 'Fotos dos estudantes'
  createRegistryData!: File[]
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

  onFilesSelected(event: any) {
    const files: FileList = event.target.files
    const createRegistryData: File[] = []

    for (let i = 0; i < files.length; i++) {
      createRegistryData.push(files[i])
    }
    this.createRegistryData = createRegistryData
  }

  okPhotos: string[] = []
  errPhotos: string[] = []

  createRegistry(index: number) {
    if (index >= this.createRegistryData.length) {
      let errMessage = 'As seguintes fotos não foram gravadas: '
      if (this.errPhotos.length > 0) {
        this.errPhotos.forEach((photo) => {
          errMessage += `${photo} |`
        })
        errMessage += `. 
        Todas as outras fotos foram gravadas com sucesso.
        
        Copie e cole os nomes das fotos e revise os CPFs e/ou tipos de fotos nos nomes dos arquivos.`

        this.errorMessage = errMessage
        this.error = true
        this.errPhotos = []
        this.isLoading = false
        return
      } else {
        this.doneMessage = `Todas as fotos foram gravadas com sucesso.`
        this.done = true
        this.isLoading = false
        return
      }
    }

    const data = this.createRegistryData[index]
    const formData = new FormData()
    formData.append('file', data, data.name)

    this.service.createRegistry(formData).subscribe({
      next: (res) => {
        if (res == 0) {
          this.errPhotos.push(data.name)
        } else if (res == 1) {
          this.okPhotos.push(data.name)
        }

        // Enviar a próxima foto após o sucesso da atual
        this.createRegistry(index + 1)
      },
      error: (err) => {
        this.errorMessage = err.message
        this.error = true
        this.isLoading = false
      },
    })
  }

  // createRegistry() {
  //   this.isLoading = true

  //   let formData
  //   this.createRegistryData.forEach((data) => {
  //     formData = new FormData()
  //     formData.append('file', data, data.name)
  //     this.service.createRegistry(formData).subscribe({
  //       next: (res) => {
  //         console.log(res)
  //         this.doneMessage = 'Registro criado com sucesso.'
  //         this.done = true
  //         this.isLoading = false
  //       },
  //       error: (err) => {
  //         this.errorMessage = err.message
  //         this.error = true
  //         this.isLoading = false
  //       },
  //     })
  //   })
  // }
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
