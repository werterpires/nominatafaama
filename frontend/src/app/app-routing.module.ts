import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { LoginComponent } from './components/login/login.component'
import { LogonComponent } from './components/logon/logon.component'
import { StudentComponent } from './components/student/student.component'
import { NominataComponent } from './components/nominata/nominata.component'
import { RecordsComponent } from './components/records/records.component'
import { UsersApprovesComponent } from './components/approvals/users-approves/users-approves.component'
import { StudentToApproveComponent } from './components/approvals/student-to-approve/student-to-approve.component'
import { OneStudentToApproveComponent } from './components/approvals/one-student-to-approve/one-student-to-approve.component'
import { ParameterizationComponent } from './components/parameterization/parameterization.component'
import { RepresentationsToApproveComponent } from './components/approvals/representations-to_approve/representations-to-approve.component'
import { VacanciesComponent } from './components/vacancies/vacancies.component'
import { InvitesToApproveComponent } from './components/approvals/invites-to_approve/invites-to-approve.component'
import { CallsComponent } from './components/calls/calls.component'

const routes: Routes = [
  { path: 'student/:studentid', component: StudentComponent },
  {
    path: 'approve/student/:userId',
    component: OneStudentToApproveComponent,
  },
  { path: 'approve/students', component: StudentToApproveComponent },
  { path: 'approve/users', component: UsersApprovesComponent },
  {
    path: 'approve/representations',
    component: RepresentationsToApproveComponent,
  },
  {
    path: 'approve/invites',
    component: InvitesToApproveComponent,
  },
  { path: 'login', component: LoginComponent },
  { path: 'logon', component: LogonComponent },
  { path: 'nominata', component: NominataComponent },
  { path: 'cadastros', component: RecordsComponent },
  { path: 'parametrizacao', component: ParameterizationComponent },
  { path: 'vagas', component: VacanciesComponent },
  { path: 'chamados', component: CallsComponent },
  { path: '', component: NominataComponent },
]

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
