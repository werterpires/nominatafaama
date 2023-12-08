import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core'
import { ApproveDto } from '../../approvals/one-student-to-approve/types'
import { OneStudentToApproveService } from '../../approvals/one-student-to-approve/one-student-to-approve.service'
import { ErrorServices } from '../shared.service.ts/error.service'
import { ApproveFormServices } from './approve-form.service'
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-approve-form',
  templateUrl: './approve-form.component.html',
  styleUrls: ['./approve-form.component.css'],
})
export class ApproveFormComponent implements OnInit, OnDestroy {
  @Input() registryId!: number
  @Input() approved: boolean | null | undefined = false
  @Input() table!: string

  @Output() atualize = new EventEmitter<void>()
  @ViewChild('approveItem') approveItem!: ElementRef
  @ViewChild('rejectItem') rejectItem!: ElementRef

  isLoading = false
  doneMessage = ''
  done = false
  error = false

  private saveAll!: Subscription

  count = 0

  constructor(
    private service: OneStudentToApproveService,
    private errorService: ErrorServices,
    private approveFormService: ApproveFormServices,
  ) {}

  ngOnInit() {
    this.errorService.error$.subscribe((error) => {
      this.error = error
    })
    this.saveAll = this.approveFormService.approveAll$.subscribe(() => {
      if (this.count) {
        this.approveAll()
      }
      this.count += 1
    })
    this.approveFormService.addForm()
  }

  approve(
    elementTrue: HTMLInputElement,
    elementFalse: HTMLInputElement,
    id: number,
  ) {
    this.isLoading = true
    let approve: boolean | null = null

    if (elementTrue.checked) {
      approve = true
    } else if (elementFalse.checked) {
      approve = false
    } else {
      throw new Error('Você precisa escolher entre aprovado ou desaprovado.')
    }

    const data: ApproveDto = {
      approve: approve,
      id: id,
    }

    this.service.approveAny(data, this.table).subscribe({
      next: () => {
        this.atualize.emit()

        this.doneMessage = 'Aprovação feita com sucesso.'
        this.done = true
        this.isLoading = false
      },
      error: (err) => {
        this.errorService.showError(err.message)
        this.isLoading = false
      },
    })
  }

  ngOnDestroy() {
    this.approveFormService.removeForm()
    this.saveAll.unsubscribe()
  }

  approveAll() {
    this.isLoading = true

    let approve: boolean | null = null

    if (this.rejectItem.nativeElement.checked) {
      approve = false
    } else {
      approve = true
    }

    const data: ApproveDto = {
      approve: approve,
      id: this.registryId,
    }

    this.service.approveAny(data, this.table).subscribe({
      next: () => {
        console.log('aprovacao:', approve, this.registryId, this.table)
        this.doneMessage = 'Aprovação feita com sucesso.'
        this.done = true
        this.approveFormService.finishApprove()
        this.isLoading = false
      },
      error: (err) => {
        this.errorService.showError(err.message)
        this.isLoading = false
      },
    })
  }

  closeDone() {
    this.done = false
  }
}
