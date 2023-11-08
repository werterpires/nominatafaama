import { Component, Input, OnInit } from '@angular/core'
import { IPermissions } from '../../shared/container/types'
import { ValidateService } from '../../shared/shared.service.ts/validate.services'
import { ICreateFieldRep, IFieldRep, IUpdateFieldRep } from './types'
import { FieldRepsService } from './field-reps.service'

@Component({
  selector: 'app-field-reps',
  templateUrl: './field-reps.component.html',
  styleUrls: ['./field-reps.component.css'],
})
export class FieldRepsComponent implements OnInit {
  constructor(
    private fieldRepsService: FieldRepsService,
    private validateService: ValidateService,
  ) {}

  @Input() permissions!: IPermissions
  registry: IFieldRep = {
    personId: 0,
    personName: '',
    phoneNumber: '',
    repId: 0,
  }

  title = 'Dados do representante de campo'

  showBox = false
  showForm = true
  isLoading = false
  done = false
  doneMessage = ''
  error = false
  errorMessage = ''

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
    } else if (func == 'edit') {
      this.editRegistry()
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

  ngOnInit() {
    if (this.showBox) {
      this.getRegistry()
    }
    if (this.registry.personId == null) {
      this.showForm = false
    }
  }

  toShowBox() {
    this.showBox = !this.showBox
    if (this.showBox) {
      this.getRegistry()
    } else if (!this.showBox) {
      this.registry = {
        personId: 0,
        personName: '',
        phoneNumber: '',
        repId: 0,
      }
    }
  }

  getRegistry() {
    this.isLoading = true
    this.fieldRepsService.findRegistry().subscribe({
      next: (res) => {
        console.log(res)
        if (res && res.repId) {
          this.registry = res
          this.formatarTelefone()
        } else {
          this.showBox = true
          this.showForm = true
        }
        this.isLoading = false
      },
      error: (err) => {
        this.showBox = true
        this.showForm = true
        this.errorMessage = err.message
        this.error = true
        this.isLoading = false
      },
    })
  }

  createRegistry() {
    this.isLoading = true

    if (
      this.validateService.validatePhoneNumber(this.registry.phoneNumber) ==
      false
    ) {
      this.showError(
        'Escreva seu número de telefone para prosseguir com o registro.',
      )
      return
    }

    const newRep: ICreateFieldRep = {
      phoneNumber: this.registry.phoneNumber.replace(/\D/g, ''),
    }

    this.fieldRepsService.createFieldRep(newRep).subscribe({
      next: () => {
        this.doneMessage = 'Dados gravados com sucesso.'
        this.done = true
        this.isLoading = false
        this.getRegistry()
      },
      error: (err) => {
        this.errorMessage = err.message
        this.error = true
        this.isLoading = false
      },
    })
  }

  editRegistry() {
    this.isLoading = true

    if (
      this.validateService.validatePhoneNumber(this.registry.phoneNumber) ==
      false
    ) {
      this.showError(
        'Escreva seu número de telefone para prosseguir com a edição.',
      )
      return
    }

    const editFieldRepData: IUpdateFieldRep = {
      phoneNumber: this.registry.phoneNumber.replace(/\D/g, ''),
      repId: this.registry.repId,
    }

    this.fieldRepsService.updateFieldRep(editFieldRepData).subscribe({
      next: () => {
        this.doneMessage = 'Dados editados com sucesso.'
        this.done = true
        this.isLoading = false
      },
      error: (err) => {
        this.errorMessage = err.message
        this.error = true
        this.isLoading = false
      },
    })
  }

  formatarTelefone() {
    let formatedNumber = ''
    this.registry.phoneNumber = this.registry.phoneNumber.replace(/\D/g, '')

    if (this.registry.phoneNumber.length > 0) {
      formatedNumber = '(' + this.registry.phoneNumber.substring(0, 2) + ') '
    }
    if (this.registry.phoneNumber.length > 2) {
      formatedNumber += this.registry.phoneNumber.substring(2, 6) + '-'
    }
    if (this.registry.phoneNumber.length > 7) {
      formatedNumber += this.registry.phoneNumber.substring(6, 10)
    }
    if (this.registry.phoneNumber.length == 11) {
      formatedNumber = this.registry.phoneNumber.replace(
        /(\d{2})(\d{5})(\d{4})/,
        '($1) $2-$3',
      )
    }

    this.registry.phoneNumber = formatedNumber
  }

  showError(message: string) {
    this.errorMessage = message
    this.error = true
    this.isLoading = false
  }

  closeError() {
    this.error = false
  }

  closeDone() {
    this.done = false
  }
}
