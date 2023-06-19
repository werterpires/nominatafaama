import { Injectable } from '@nestjs/common'
import { CoursesModel } from '../model/courses.model'
import { CreateCourseDto } from '../dto/create-course.dto'
import { UpdateCourseDto } from '../dto/update-course.dto'
import { ICourse, ICreateCourse, IUpdateCourse } from '../types/types'
import { UsersService } from 'src/modules/users/dz_services/users.service'
import { SpousesModel } from 'src/modules/spouses/model/spouses.model'
import { ISpouse } from 'src/modules/spouses/types/types'

@Injectable()
export class CoursesService {
  constructor(
    private coursesModel: CoursesModel,
    private usersService: UsersService,
    private spouseModel: SpousesModel,
  ) {}

  async createCourse(
    dto: CreateCourseDto,
    user_id: number,
    personType: string,
  ): Promise<ICourse> {
    try {
      let personId!: number
      if (personType === 'student') {

        const user = await this.usersService.findUserById(user_id)
        let person_id: number
        if(user != null){
          person_id = user.person_id
        }else{
          throw new Error(`Não foi possível encontrar um usuário válido.`)
        }
      } else if (personType === 'spouse') {
        let spouse: ISpouse | null = await this.spouseModel.findSpouseByUserId(
          user_id,
        )
        if (spouse == null) {
          throw new Error(
            `Não foi possível encontrar uma esposa vinculada ao usuário com id ${user_id}`,
          )
        }
        personId = spouse.person_id
      }

      const createCourseData: ICreateCourse = {
        ...dto,
        begin_date: new Date(dto.begin_date),
        conclusion_date: dto.conclusion_date
          ? new Date(dto.conclusion_date)
          : null,
        person_id: personId,
        course_approved: null,
      }

      const newCourse = await this.coursesModel.createCourse(createCourseData)
      return newCourse
    } catch (error) {
      throw error
    }
  }

  async findCourseById(id: number): Promise<ICourse | null> {
    try {
      const course = await this.coursesModel.findCourseById(id)
      return course
    } catch (error) {
      throw new Error(
        `Não foi possível encontrar o curso com o ID ${id}: ${error.message}`,
      )
    }
  }

  async findCoursesByPersonId(
    user_id: number,
    personType: string,
  ): Promise<ICourse[] | null> {
    try {
      let personId!: number | null
      if (personType == 'student') {
        const user = await this.usersService.findUserById(user_id)
        let person_id: number
        if(user != null){
          person_id = user.person_id
        }else{
          throw new Error(`Não foi possível encontrar um usuário válido.`)
        }
      } else if (personType == 'spouse') {
        let spouse: ISpouse | null = await this.spouseModel.findSpouseByUserId(
          user_id,
        )
        if (spouse == null) {
          personId = null
         } else{
           personId = spouse.person_id
         }
       
      }
      let courses: ICourse[]
      if(personId==null){
        courses = []
      }else{
        courses =
        await this.coursesModel.findCoursesByPersonId(
          personId,
        )
      }
      return courses
    } catch (error) {
      throw new Error(
        `Não foi possível encontrar cursos para a pessoa com o ID fornecido: ${error.message}`,
      )
    }
  }

  async findAllCourses(): Promise<ICourse[]> {
    try {
      const allCourses = await this.coursesModel.findAllCourses()
      return allCourses
    } catch (error) {
      throw error
    }
  }

  async updateCourseById(dto: UpdateCourseDto): Promise<ICourse> {
    try {
      const updateCourseData: IUpdateCourse = {
        ...dto,
        begin_date: new Date(dto.begin_date),
        conclusion_date: dto.conclusion_date
          ? new Date(dto.conclusion_date)
          : null,
        course_approved: null,
      }

      const updatedCourse = await this.coursesModel.updateCourseById(
        updateCourseData,
      )
      return updatedCourse
    } catch (error) {
      throw error
    }
  }

  async deleteCourseById(id: number): Promise<string> {
    try {
      await this.coursesModel.deleteCourseById(id)
      return 'Curso deletado com sucesso.'
    } catch (error) {
      throw error
    }
  }
}
