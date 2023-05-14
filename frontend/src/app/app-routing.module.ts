import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { NominataComponent } from './components/nominata/nominata.component';
import { RecordsComponent } from './components/records/records.component';
import { ApprovesComponent } from './components/approves/approves.component';
import { ContainerComponent } from './components/shared/container/container.component';
import { LogonComponent } from './components/logon/logon.component';

const routes: Routes = [
  { path: "login", component: LoginComponent },
  { path: "logon", component: LogonComponent },
  { path: "", component:ContainerComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
