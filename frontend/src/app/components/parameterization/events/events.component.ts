import { Component, Input } from '@angular/core'
import { IPermissions } from '../../shared/container/types'
import { CreateEventDto, IEvent } from './types'
import { INominata } from '../nominatas/types'
import { EventsService } from './events.service'
import { NominatasService } from '../nominatas/nominatas.service'
import { DataService } from '../../shared/shared.service.ts/data.service'

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css'],
})
export class EventsComponent {
  @Input() permissions!: IPermissions

  allRegistries: IEvent[] = []
  allNominatas: INominata[] = []
  title = 'Eventos'
  createRegistryData: CreateEventDto = {
    nominata_id: 0,
    event_address: '',
    event_date: '',
    event_place: '',
    event_time: '',
    event_title: '',
  }

  showBox = false
  showForm = true
  isLoading = false
  done = false
  doneMessage = ''
  error = false
  errorMessage = ''

  constructor(
    private service: EventsService,
    private nominatasService: NominatasService,
    private dataService: DataService,
  ) {}

  ngOnInit() {
    this.getAllNominatas()
  }

  getAllNominatas() {
    this.isLoading = true
    this.nominatasService.findAllRegistries().subscribe({
      next: (res) => {
        this.allNominatas = res.sort(
          (a, b) => parseInt(b.year) - parseInt(a.year),
        )
        this.createRegistryData.nominata_id = this.allNominatas[0].nominata_id
        this.getAllEvents()
        this.showForm = false
        this.isLoading = false
      },
      error: (err) => {
        this.errorMessage = err.message
        this.error = true
        this.isLoading = false
      },
    })
  }

  getAllEvents() {
    this.isLoading = true
    this.service
      .getAllEvents(parseInt(this.createRegistryData.nominata_id.toString()))
      .subscribe({
        next: (res) => {
          this.allRegistries = res
          this.showForm = false
          this.isLoading = false
        },
        error: (err) => {
          this.errorMessage = err.message
          this.error = true
          this.isLoading = false
        },
      })
  }

  createRegistry() {
    this.isLoading = true
    this.service
      .createRegistry({
        ...this.createRegistryData,
        event_date: this.dataService.dateFormatter(
          this.createRegistryData.event_date,
        ),
        nominata_id: parseInt(this.createRegistryData.nominata_id.toString()),
      })
      .subscribe({
        next: (res) => {
          this.doneMessage = 'Registro criado com sucesso.'
          this.done = true
          this.isLoading = false
          this.createRegistryData = {
            nominata_id: this.createRegistryData.nominata_id,
            event_address: '',
            event_date: '',
            event_place: '',
            event_time: '',
            event_title: '',
          }
          this.getAllEvents()
          this.showForm = false
        },
        error: (err) => {
          this.errorMessage = err.message
          this.error = true
          this.isLoading = false
        },
      })
  }

  editRegistry(id: number, event: string) {
    this.isLoading = true
    const { created_at, updated_at, ...updateData } = this.allRegistries[id]
    this.service
      .updateRegistry({
        ...updateData,
        event_date: this.dataService.dateFormatter(updateData.event_date),
        nominata_id: parseInt(updateData.nominata_id.toString()),
      })
      .subscribe({
        next: (res) => {
          this.doneMessage = 'Registro editado com sucesso.'
          this.done = true
          this.isLoading = false
          this.getAllEvents()
          this.showForm = false
        },
        error: (err) => {
          this.errorMessage = err.message
          this.error = true
          this.isLoading = false
        },
      })
  }

  deleteRegistry(id: number) {
    this.isLoading = true
    this.service.deleteRegistry(parseInt(id.toString())).subscribe({
      next: (res) => {
        this.doneMessage = 'Registro deletado com sucesso.'
        this.done = true
        this.isLoading = false
        this.getAllEvents()
        this.showForm = false
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
