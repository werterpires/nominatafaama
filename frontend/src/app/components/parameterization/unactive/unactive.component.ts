import { Component, Input } from '@angular/core'
import { IPermissions } from '../../shared/container/types'
import { UnactiveService } from './unactive.service'
import { StringArray } from './types'
import * as XLSX from 'xlsx'

@Component({
  selector: 'app-unactive',
  templateUrl: './unactive.component.html',
  styleUrls: ['./unactive.component.css'],
})
export class UnactiveComponent {
  @Input() permissions!: IPermissions

  title = 'Inativação de estudantes'

  activeStudents: { cpf: string; name: string }[] = []

  createRegistryData!: StringArray
  showBox = false
  showForm = false
  isLoading = false
  done = false
  doneMessage = ''
  error = false
  errorMessage = ''

  constructor(private service: UnactiveService) {}
  ngOnInit() {
    this.createRegistryData = { strings: [] }
    this.activeStudents = []
    this.getActiveStudents()
  }

  onFileSelected(event: any) {
    this.isLoading = true
    this.createRegistryData = { strings: [] }
    const file: File = event.target.files[0]
    if (file) {
      this.readExcelFile(file)
    }
    this.isLoading = false
  }

  async readExcelFile(file: File) {
    this.isLoading = true
    const data = await this.readFile(file)
    const workbook = XLSX.read(data, { type: 'array' })
    if (workbook.Sheets['ativos']) {
      const cpfs = workbook.Sheets['ativos']
      for (const prop in cpfs) {
        if (cpfs[prop].v) {
          this.createRegistryData.strings.push(
            cpfs[prop].v.toString().replace(/[.,-]/g, ''),
          )
        }
      }
    }
    console.log(this.createRegistryData)
    this.isLoading = false
  }

  async readFile(file: File) {
    return new Promise<ArrayBuffer>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target) {
          resolve(e.target.result as ArrayBuffer)
        }
      }
      reader.onerror = (e) => {
        reject(new Error('Error reading file'))
      }
      reader.readAsArrayBuffer(file)
    })
  }

  sendActiveCpfs() {
    this.isLoading = true

    this.service.sendActiveStudents(this.createRegistryData).subscribe({
      next: (res) => {
        this.doneMessage = 'Registro criado com sucesso.'
        this.ngOnInit()
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

  getActiveStudents() {
    this.isLoading = true

    this.service.getActiveStudents().subscribe({
      next: (res) => {
        this.activeStudents = res

        this.activeStudents = res.sort((a, b) => a.name.localeCompare(b.name))
        this.isLoading = false
      },
      error: (err) => {
        this.errorMessage = err.message
        this.error = true
        this.isLoading = false
      },
    })
  }

  formatarCPF(cpf: string | undefined) {
    if (cpf === undefined) {
      return ''
    }
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }

  closeError() {
    this.error = false
  }
  closeDone() {
    this.done = false
  }
}
