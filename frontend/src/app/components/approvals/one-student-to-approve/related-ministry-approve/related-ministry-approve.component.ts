import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { IMinistryType } from 'src/app/components/parameterization/minstry-types/types'
import { RelatedMinistriesService } from 'src/app/components/records/related-ministries/related-ministries.service'
import {
  IRelatedMinistry,
  UpdateRelatedMinistryDto,
} from 'src/app/components/records/related-ministries/types'
import { ErrorServices } from 'src/app/components/shared/shared.service.ts/error.service'

@Component({
  selector: 'app-related-ministry-approve',
  templateUrl: './related-ministry-approve.component.html',
  styleUrls: ['./related-ministry-approve.component.css'],
})
export class RelatedMinistryApproveComponent implements OnInit {
  done = false
  doneMessage = ''
  error = false
  isLoading = false

  @Input() ministry!: IRelatedMinistry
  @Input() ministryTypeList: IMinistryType[] = []

  @Output() atualizeEmitter = new EventEmitter()

  constructor(
    private service: RelatedMinistriesService,
    private errorService: ErrorServices,
  ) {}

  ngOnInit(): void {
    this.errorService.error$.subscribe({
      next: (error) => {
        this.error = error
      },
    })
  }

  editRegistry() {
    this.isLoading = true

    const newRegistry: UpdateRelatedMinistryDto = {
      ministry_type_id: parseInt(this.ministry.ministry_type_id.toString()),
      person_id: parseInt(this.ministry.person_id.toString()),
      priority: parseInt(this.ministry.priority.toString()),
      related_ministry_id: parseInt(
        this.ministry.related_ministry_id.toString(),
      ),
    }

    this.service
      .updateRegistry(newRegistry as UpdateRelatedMinistryDto)
      .subscribe({
        next: () => {
          this.doneMessage = 'Registro editado com sucesso.'
          this.done = true
          this.isLoading = false
          this.atualizeEmitter.emit()
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
    this.doneMessage = ''
  }
}
