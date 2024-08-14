import { Component, Input } from '@angular/core'
import {
  CreateStudentPhotoDto,
  IStudentPhoto,
  UpdateStudentPhotoDto,
  receiveStudentPhoto,
} from './types'
import { NominataPhotosService } from './nominatas-photos.service'
import { IPermissions } from '../../shared/container/types'
import { INominata } from '../nominatas/types'
import { DataService } from '../../shared/shared.service.ts/data.service'
import { INominataPhoto } from '../../nominata/types'
import { environment } from 'src/environments/environment'

@Component({
  selector: 'app-nominatas-photos',
  templateUrl: './nominatas-photos.component.html',
  styleUrls: ['./nominatas-photos.component.css'],
})
export class NominatasPhotosComponent {
  @Input() permissions!: IPermissions
  Registry!: IStudentPhoto
  title = 'Foto da turma da Nominata'
  createRegistryData!: File | null
  nominataId!: number
  allNominatas: INominata[] = []
  allPhotos: INominataPhoto[] = []

  showBox = true
  showForm = false
  isLoading = false
  done = false
  doneMessage = ''
  error = false
  errorMessage = ''
  constructor(
    private service: NominataPhotosService,
    public dataService: DataService,
  ) {}
  ngOnInit() {
    this.imageUrl = null
    this.getAllNominatas()
  }

  imageUrl: string | null = null
  urlBase = environment.API
  getAllNominatas() {
    this.isLoading = true
    this.service.findAllNominatas().subscribe({
      next: (res) => {
        this.allNominatas = res.sort((a, b) => {
          if (a.year > b.year) {
            return -1
          } else if (a.year < b.year) {
            return 1
          } else {
            return 0
          }
        })
        this.nominataId = this.allNominatas[0].nominata_id
        this.getPhoto()
        this.isLoading = false
      },
      error: (err) => {
        this.errorMessage = err.message
        this.error = true
        this.isLoading = false
      },
    })
  }
  getPhoto() {
    this.isLoading = true

    this.service.findPhotos(this.nominataId).subscribe({
      next: (res) => {
        this.allPhotos = res
        this.isLoading = false
      },
      error: (err) => {
        if (err.status == 404) {
          this.allPhotos = []
          this.isLoading = false
        } else {
          this.errorMessage = err.message
          this.error = true
          this.isLoading = false
        }
      },
    })
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0]
    const reader = new FileReader()

    reader.onload = (e: any) => {
      this.imageUrl = e.target.result
    }
    reader.readAsDataURL(file)
    this.createRegistryData = event.srcElement.files[0]
  }

  createRegistry() {
    this.isLoading = true

    if (!this.createRegistryData) {
      this.isLoading = false
      return
    }

    const formData = new FormData()
    formData.append(
      'file',
      this.createRegistryData,
      this.createRegistryData.name,
    )

    this.service
      .createRegistry(formData, parseInt(this.nominataId.toString()))
      .subscribe({
        next: (res) => {
          this.doneMessage = 'Registro criado com sucesso.'
          this.done = true
          this.allPhotos.push(res)
          this.createRegistryData = null
          this.imageUrl = null
          this.isLoading = false
        },
        error: (err) => {
          this.errorMessage = err.message
          this.error = true
          this.isLoading = false
        },
      })
  }

  deleteRegistry(nominataPhotoId: number) {
    this.isLoading = true
    this.service.deleteRegistry(nominataPhotoId).subscribe({
      next: (res) => {
        this.doneMessage = 'Registro removido com sucesso.'
        this.done = true
        this.isLoading = false
        this.allPhotos = this.allPhotos.filter(
          (photo) => photo.nominata_photo_id != nominataPhotoId,
        )
        console.log(this.allPhotos)
      },
      error: (err) => {
        this.errorMessage = 'Não foi possível remover o registro.'
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
