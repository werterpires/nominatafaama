import { Component, EventEmitter, Input, Output } from '@angular/core'
import { IPermissions } from '../shared/container/types'
import { ICompleteUser } from '../approvals/student-to-approve/types'
import { DataService } from '../shared/shared.service.ts/data.service'
import { DomSanitizer } from '@angular/platform-browser'
import { NominataService } from './nominata.service'
import { IBasicProfessor, ICompleteNominata } from './types'

@Component({
  selector: 'app-nominata',
  templateUrl: './nominata.component.html',
  styleUrls: ['./nominata.component.css'],
})
export class NominataComponent {
  @Input() permissions!: IPermissions
  @Output() selectOne: EventEmitter<void> = new EventEmitter<void>()
  @Output() seeAll: EventEmitter<void> = new EventEmitter<void>()

  Registry: ICompleteNominata | null = null
  nominataYear: string =
    new Date().getMonth() > 6
      ? new Date().getFullYear().toString()
      : (new Date().getFullYear() - 1).toString()
  title = 'Nominata'

  words: string[] = []

  searchString: string = ''

  director!: IBasicProfessor | undefined

  showForm = false
  isLoading = false
  done = false
  doneMessage = ''
  error = false
  errorMessage = ''

  constructor(
    private service: NominataService,
    private dataService: DataService,
    private sanitizer: DomSanitizer,
  ) {}

  ngOnInit() {
    this.getAllRegistries()
    this.seeAll.emit()
  }

  getAllRegistries() {
    this.isLoading = true
    this.service.findAllRegistries(this.nominataYear).subscribe({
      next: async (res) => {
        this.Registry = res
        console.log(this.Registry)

        this.words = this.Registry.director_words.split('\n\n')

        const blob = new Blob(
          [new Uint8Array(this.Registry.photo?.file.data)],
          {
            type: 'image/jpeg',
          },
        )
        if (blob instanceof Blob) {
          const reader = new FileReader()
          reader.onload = (e: any) => {
            if (this.Registry?.photo) {
              this.Registry.imgUrl = e.target.result
            }
          }
          reader.readAsDataURL(blob)
        } else {
          this.showForm = true
          this.isLoading = false
        }

        this.Registry.students?.forEach((student) => {
          const blob = new Blob([new Uint8Array(student.photo?.file.data)], {
            type: 'image/jpeg',
          })
          if (blob instanceof Blob) {
            const reader = new FileReader()
            reader.onload = (e: any) => {
              student.imgUrl = e.target.result
            }
            reader.readAsDataURL(blob)
          } else {
            this.showForm = true
          }
        })

        this.Registry.professors?.forEach((professor) => {
          const blob = new Blob([new Uint8Array(professor.photo?.file.data)], {
            type: 'image/jpeg',
          })
          if (blob instanceof Blob) {
            const reader = new FileReader()
            reader.onload = (e: any) => {
              professor.imgUrl = e.target.result
            }
            reader.readAsDataURL(blob)
          } else {
            this.showForm = true
          }
          if (this.Registry && this.Registry.professors) {
            this.findDirector(this.Registry.professors, this.Registry?.director)
          }
        })

        this.isLoading = false
      },
      error: (err) => {
        this.nominataYear = (parseInt(this.nominataYear) - 1).toString()
        this.getAllRegistries()
        this.errorMessage = err.message
        this.error = true
      },
    })
  }

  findDirector(professors: IBasicProfessor[], directorId: number) {
    console.log(directorId)
    this.director = professors.find(
      (professor) => professor.professor_id === directorId,
    )
  }

  // searchByNam() {
  //   this.isLoading = true
  //   console.log(this.searchString.length)
  //   if (this.searchString.length < 1) {
  //     this.errorMessage = 'Escreva algo para ser pesquisado'
  //     this.error = true
  //     this.isLoading = false
  //     return
  //   }
  //   const searchString = this.searchString.toLowerCase().replace(/\s+/g, '_')
  //   this.service.findRegistriesByName(searchString).subscribe({
  //     next: async (res) => {
  //       this.allRegistries = res

  //       this.allRegistries.forEach((registry) => {
  //         const blob = new Blob([new Uint8Array(registry.photo?.file.data)], {
  //           type: 'image/jpeg',
  //         })
  //         if (blob instanceof Blob) {
  //           const reader = new FileReader()
  //           reader.onload = (e: any) => {
  //             registry.imageUrl = e.target.result
  //             this.isLoading = false
  //           }
  //           reader.readAsDataURL(blob)
  //         } else {
  //           this.showForm = true
  //           this.isLoading = false
  //         }
  //       })

  //       this.isLoading = false
  //     },
  //     error: (err) => {
  //       this.errorMessage = err.message
  //       this.error = true
  //       this.isLoading = false
  //     },
  //   })
  // }

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

  // getOneStudent(userId: number) {
  //   this.isLoading = true
  //   this.service.findOneRegistry(userId).subscribe({
  //     next: async (res) => {
  //       this.dataService.selectedStudent = res
  //       this.selectOne.emit()
  //       this.isLoading = false
  //     },
  //     error: (err) => {
  //       this.errorMessage = err.message
  //       this.error = true
  //       this.isLoading = false
  //     },
  //   })
  // }

  closeError() {
    this.error = false
  }

  closeDone() {
    this.done = false
  }
}
