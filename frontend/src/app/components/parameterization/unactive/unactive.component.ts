import { Component, Input } from '@angular/core'
import { IPermissions } from '../../shared/container/types'
import { UnactiveService } from './unactive.service'
import { StringArray } from './types'

@Component({
  selector: 'app-unactive',
  templateUrl: './unactive.component.html',
  styleUrls: ['./unactive.component.css'],
})
export class UnactiveComponent {
  @Input() permissions!: IPermissions

  title = 'Inativação de estudantes'

  createRegistryData!: StringArray
  showBox = true
  showForm = false
  isLoading = false
  done = false
  doneMessage = ''
  error = false
  errorMessage = ''

  constructor(private service: UnactiveService) {}
  ngOnInit() {
    this.createRegistryData = { strings: [] }
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0]
    const reader = new FileReader()

    // reader.onload = (e: any) => {
    //   this.imageUrl = e.target.result
    // }
    reader.readAsDataURL(file)
    this.createRegistryData = event.srcElement.files[0]
  }

  sendActiveCpfs() {
    this.isLoading = true

    this.service.sendActiveStudents(this.createRegistryData).subscribe({
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

  closeError() {
    this.error = false
  }
  closeDone() {
    this.done = false
  }
}
