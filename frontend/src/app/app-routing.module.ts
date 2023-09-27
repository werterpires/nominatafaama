import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { LoginComponent } from './components/login/login.component'
import { LogonComponent } from './components/logon/logon.component'
import { ContainerComponent } from './components/shared/container/container.component'
import { StudentComponent } from './components/student/student.component'
import { NominataComponent } from './components/nominata/nominata.component'
import { RecordsComponent } from './components/records/records.component'
import { UsersApprovesComponent } from './components/approves/users-approves/users-approves.component'

const routes: Routes = [
  { path: 'student/:studentid', component: StudentComponent },
  { path: 'approve/users', component: UsersApprovesComponent },
  { path: 'login', component: LoginComponent },
  { path: 'logon', component: LogonComponent },
  { path: 'nominata', component: NominataComponent },
  { path: 'cadastros', component: RecordsComponent },
  { path: '', component: NominataComponent },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
