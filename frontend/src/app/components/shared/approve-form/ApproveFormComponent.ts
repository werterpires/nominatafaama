import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { ApproveDto } from '../../approvals/one-student-to-approve/types'
import { OneStudentToApproveService } from '../../approvals/one-student-to-approve/one-student-to-approve.service'
import { ErrorServices } from '../shared.service.ts/error.service'

@Component({
  selector: 'app-approve-form',
  templateUrl: './approve-form.component.html',
  styleUrls: ['./approve-form.component.css'],
})
export class ApproveFormComponent implements OnInit {
  @Input() registryId!: number
  @Input() approved: boolean | null | undefined = false
  @Input() table!: string

  @Output() editRegistry = new EventEmitter<{
    id: number
    saveButtonId: string
  }>()

  @Output() atualize = new EventEmitter<void>()

  isLoading = false
  doneMessage = ''
  done = false
  error = false

  constructor(
    private service: OneStudentToApproveService,
    private errorService: ErrorServices,
  ) {}

  ngOnInit() {
    this.errorService.error$.subscribe((error) => {
      this.error = error
    })
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

  closeDone() {
    this.done = false
  }

  doNothing(m: string) {
    console.log(m)
  }
}
