import { Component, Input, OnInit } from '@angular/core'
import { IStudentPhoto, UpdateStudentPhotoDto } from './types'
import { ProfessorPhotosService } from './small-alone-professor-photos.service'
import { IPermissions } from '../../shared/container/types'

@Component({
  selector: 'app-small-alone-professor-photos',
  templateUrl: './small-alone-professor-photos.component.html',
  styleUrls: ['./small-alone-professor-photos.component.css'],
})
export class SmallAloneProfessorPhotosComponent implements OnInit {
  @Input() permissions!: IPermissions
  allRegistries: IStudentPhoto[] = []
  title = 'Pequena foto do professor'
  createRegistryData!: File
  showBox = false
  showForm = false
  isLoading = false
  done = false
  doneMessage = ''
  error = false
  errorMessage = ''
  constructor(private service: ProfessorPhotosService) {}
  ngOnInit() {
    this.allRegistries = []
    this.imageUrl = null
    if (this.showBox) {
      this.getAllRegistries()
    }
  }
  toShowBox() {
    this.showBox = !this.showBox
    if (this.showBox) {
      this.getAllRegistries()
    } else if (!this.showBox) {
      this.allRegistries = []
    }
  }
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
    this.allRegistries = []
    this.imageUrl = null
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

  createRegistry() {
    this.isLoading = true

    const formData = new FormData()
    formData.append(
      'file',
      this.createRegistryData,
      this.createRegistryData.name,
    )

    this.service.createRegistry(formData).subscribe({
      next: () => {
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
  // editRegistry(index: number, buttonId: string) {
  //   this.isLoading = true
  //   const newRegistry: Partial<IStudentPhoto> = {
  //     ...this.allRegistries[index],
  //   }
  //   delete newRegistry.created_at
  //   delete newRegistry.updated_at
  //   this.service
  //     .updateRegistry(newRegistry as UpdateStudentPhotoDto)
  //     .subscribe({
  //       next: () => {
  //         this.doneMessage = 'Registro editado com sucesso.'
  //         this.done = true
  //         document.getElementById(buttonId)?.classList.add('hidden')
  //         this.isLoading = false
  //       },
  //       error: (err) => {
  //         this.errorMessage = err.message
  //         this.error = true
  //         this.isLoading = false
  //       },
  //     })
  // }
  // deleteRegistry(id: number) {
  //   this.isLoading = true
  //   this.service.deleteRegistry(id).subscribe({
  //     next: () => {
  //       this.doneMessage = 'Registro removido com sucesso.'
  //       this.done = true
  //       this.isLoading = false
  //       this.ngOnInit()
  //     },
  //     error: () => {
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
