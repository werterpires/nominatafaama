import { Component, Input } from '@angular/core'
import { IPermissions } from '../../shared/container/types'
import { ICompleteUser } from './types'
import { StudentsToApproveService } from './student-to-approve.service'
import { DataService } from '../../shared/shared.service.ts/data.service'
import {
  DomSanitizer,
  SafeResourceUrl,
  SafeUrl,
} from '@angular/platform-browser'

@Component({
  selector: 'app-student-to-approve',
  templateUrl: './student-to-approve.component.html',
  styleUrls: ['./student-to-approve.component.css'],
})
export class StudentToApproveComponent {
  @Input() permissions!: IPermissions

  allRegistries: ICompleteUser[] = []
  title = 'Aprovações'
  showForm = false
  isLoading = false
  done = false
  doneMessage = ''
  error = false
  errorMessage = ''

  constructor(
    private service: StudentsToApproveService,
    private dataService: DataService,
    private sanitizer: DomSanitizer,
  ) {}

  ngOnInit() {
    this.getAllRegistries()
  }

  getAllRegistries() {
    this.isLoading = true
    this.service.findAllRegistries().subscribe({
      next: async (res) => {
        this.allRegistries = res

        this.allRegistries.forEach((registry) => {
          const blob = new Blob([new Uint8Array(registry.photo?.file.data)], {
            type: 'image/jpeg',
          })
          if (blob instanceof Blob) {
            console.log('é um blob')
            const reader = new FileReader()
            reader.onload = (e: any) => {
              registry.imageUrl = e.target.result
              this.isLoading = false
            }
            reader.readAsDataURL(blob)
          } else {
            console.log('não é um blob')
            this.showForm = true
            this.isLoading = false
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
  }

  getPhotoUrl(fileData: Uint8Array): Promise<string> {
    return new Promise((resolve, reject) => {
      const blob = new Blob([fileData], { type: 'image/jpeg' })
      console.log(blob)
      const reader = new FileReader()
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string
        resolve(imageUrl)
      }
      reader.onerror = (event) => {
        reject(event.target?.error)
      }
      reader.readAsDataURL(blob)
    })
  }

  editRegistry(index: number, buttonId: string) {
    this.isLoading = true
    this.isLoading = false

    // const updateRegistry: Partial<ICompleteUser> = {
    //   ...this.allRegistries[index],
    //   child_birth_date: this.dataService.dateFormatter(
    //     this.allRegistries[index].child_birth_date,
    //   ),
    //   marital_status_id: parseInt(
    //     this.allRegistries[index].marital_status_id.toString(),
    //   ),
    //   person_id: parseInt(this.allRegistries[index].person_id.toString()),
    // }

    // delete updateRegistry.child_approved
    // delete updateRegistry.created_at
    // delete updateRegistry.updated_at
    // delete updateRegistry.marital_status_type_name

    // this.service.updateRegistry(updateRegistry as UpdateChildDto).subscribe({
    //   next: (res) => {
    //     this.doneMessage = 'Registro editado com sucesso.'
    //     this.done = true
    //     document.getElementById(buttonId)?.classList.add('hidden')
    //     this.isLoading = false
    //   },
    //   error: (err) => {
    //     this.errorMessage = err.message
    //     this.error = true
    //     this.isLoading = false
    //   },
    // })
  }

  deleteRegistry(id: number) {
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
  }

  closeError() {
    this.error = false
  }

  closeDone() {
    this.done = false
  }
}
