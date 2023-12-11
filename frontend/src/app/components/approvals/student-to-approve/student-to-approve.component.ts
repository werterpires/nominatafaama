import { Component, EventEmitter, Input, Output } from '@angular/core'
import { IPermissions, IUserApproved } from '../../shared/container/types'
import { ICompleteUser } from './types'
import { StudentsToApproveService } from './student-to-approve.service'
import { DataService } from '../../shared/shared.service.ts/data.service'
import {
  DomSanitizer,
  SafeResourceUrl,
  SafeUrl,
} from '@angular/platform-browser'
import { LoginService } from '../../shared/shared.service.ts/login.service'
import { Router } from '@angular/router'

@Component({
  selector: 'app-student-to-approve',
  templateUrl: './student-to-approve.component.html',
  styleUrls: ['./student-to-approve.component.css'],
})
export class StudentToApproveComponent {
  @Input() permissions: IPermissions = {
    estudante: false,
    secretaria: false,
    direcao: false,
    representacao: false,
    administrador: false,
    docente: false,
    ministerial: false,
    design: false,
    isApproved: false,
  }
  @Output() selectOne: EventEmitter<void> = new EventEmitter<void>()
  @Output() seeAll: EventEmitter<void> = new EventEmitter<void>()

  allRegistries: ICompleteUser[] = []
  title = 'Aprovações'

  searchString = ''

  showForm = false
  isLoading = false
  done = false
  doneMessage = ''
  error = false
  errorMessage = ''

  user: IUserApproved | null = null

  constructor(
    private service: StudentsToApproveService,
    private dataService: DataService,
    private sanitizer: DomSanitizer,
    private loginService: LoginService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.loginService.user$.subscribe((user) => {
      if (user === 'wait') {
        return
      }

      let roles: Array<string> = []

      if (typeof user !== 'string' && user) {
        this.user = user

        roles = this.user.roles.map((role) => role.role_name.toLowerCase())
        if (
          !roles.includes('docente') &&
          !roles.includes('direção') &&
          !roles.includes('ministerial') &&
          !roles.includes('administrador')
        ) {
          this.router.navigate(['nominata'])
        }

        this.permissions.isApproved = this.user.user_approved
      } else {
        this.user = null
        this.router.navigate(['nominata'])
        this.permissions.isApproved = false
      }
      this.permissions.estudante = roles.includes('estudante')
      this.permissions.secretaria = roles.includes('secretaria')
      this.permissions.direcao = roles.includes('direção')
      this.permissions.representacao = roles.includes('representante de campo')
      this.permissions.administrador = roles.includes('administrador')
      this.permissions.docente = roles.includes('docente')
      this.permissions.ministerial = roles.includes('ministerial')
      this.permissions.design = roles.includes('design')
    })

    this.getAllRegistries()
    this.seeAll.emit()
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
            const reader = new FileReader()
            reader.onload = (e: any) => {
              registry.imageUrl = e.target.result
              this.isLoading = false
            }
            reader.readAsDataURL(blob)
          } else {
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

  searchByNam() {
    this.isLoading = true
    if (this.searchString.length < 1) {
      this.errorMessage = 'Escreva algo para ser pesquisado'
      this.error = true
      this.isLoading = false
      return
    }
    const searchString = this.searchString.toLowerCase().replace(/\s+/g, '_')
    this.service.findRegistriesByName(searchString).subscribe({
      next: async (res) => {
        this.allRegistries = res

        this.allRegistries.forEach((registry) => {
          const blob = new Blob([new Uint8Array(registry.photo?.file.data)], {
            type: 'image/jpeg',
          })
          if (blob instanceof Blob) {
            const reader = new FileReader()
            reader.onload = (e: any) => {
              registry.imageUrl = e.target.result
              this.isLoading = false
            }
            reader.readAsDataURL(blob)
          } else {
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

  selectStudent(userId: string) {
    this.router.navigate(['approve/student/' + userId])
    // this.toStudent.emit({ option: 'student', studentId: studentId })
  }

  getOneStudent(userId: number) {
    this.isLoading = true
    this.service.findOneRegistry(userId).subscribe({
      next: async (res) => {
        this.dataService.selectedStudent = res
        this.selectOne.emit()
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
