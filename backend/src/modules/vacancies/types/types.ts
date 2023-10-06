// export interface IDirectVacancy {
//   student_id: number;
//   field_id: number;
//   title: string;
//   description: string;
//   accept: boolean | null;
//   approved: boolean | null;
// }

export interface ICreateDirectVacancy {
  student_id: number;
  field_id: number;
  title: string;
  description: string;
  accept: boolean | null;
  approved: boolean | null;
  deadline: Date;
}

// export interface IUpdateStudent {
// 	student_id: number;
//   field_id: number;
//   title: string;
//   description: string;
//   accept: boolean | null;
//   approved: boolean | null;
// }
