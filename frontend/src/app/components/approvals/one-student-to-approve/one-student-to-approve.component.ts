import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  OnDestroy,
} from '@angular/core'
import { IPermissions, IUserApproved } from '../../shared/container/types'

import { ActivatedRoute, Router } from '@angular/router'
import { DatePipe } from '@angular/common'
import { LoginService } from '../../shared/shared.service.ts/login.service'
import { ApproveFormServices } from '../../shared/approve-form/approve-form.service'
import { Subscription } from 'rxjs'
import { ErrorServices } from '../../shared/shared.service.ts/error.service'
import { RecordsService } from '../../records/records.service'
import { DataService } from '../../shared/shared.service.ts/data.service'

@Component({
  selector: 'app-one-student-to-approve',
  templateUrl: './one-student-to-approve.component.html',
  styleUrls: ['./one-student-to-approve.component.css'],
})
export class OneStudentToApproveComponent implements OnInit, OnDestroy {
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
  @Output() seeAll: EventEmitter<void> = new EventEmitter<void>()

  isLoading = false
  done = false
  doneMessage = ''
  error = false

  constructor(
    public datePipe: DatePipe,
    private activatedRoute: ActivatedRoute,
    private loginService: LoginService,
    private router: Router,
    private approveFormService: ApproveFormServices,
    private recordsService: RecordsService,
    private errorService: ErrorServices,
    public dataService: DataService,
  ) {}

  userId!: number
  user: IUserApproved | null = null

  private atualizeStudentSub!: Subscription

  async ngOnInit() {
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

    this.errorService.error$.subscribe((error) => {
      this.error = error
    })

    this.activatedRoute.paramMap.subscribe((params) => {
      const userId = params.get('userId')

      if (userId) {
        this.userId = parseInt(userId)
      }
    })

    this.atualizeStudentSub = this.approveFormService
      .atualizeStudentObservable()
      .subscribe(() => {
        location.reload()
      })
    this.getMaritalStatus()
  }

  getMaritalStatus() {
    this.isLoading = true
    this.recordsService.getStudentMaritalStatus(this.userId).subscribe({
      next: (res) => {
        if (res) {
          this.dataService.maritalStatusName = res.marital_status_type_name
        }
        this.isLoading = false
      },
      error: (err) => {
        this.errorService.showError(err.message)
        this.isLoading = false
      },
    })
  }

  saveAll() {
    try {
      this.isLoading = true

      this.approveFormService.approveAll()

      this.isLoading = false
      return
    } catch (error: any) {
      this.errorService.showError(error.message)
      this.isLoading = false
    }
  }

  closeDone() {
    this.done = false
  }

  ngOnDestroy() {
    this.atualizeStudentSub.unsubscribe()
  }
}
