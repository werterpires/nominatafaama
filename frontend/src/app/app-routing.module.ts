import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ResourcesComponent } from './components/resources/resources.component';

const routes: Routes = [
  { path: "login", component: LoginComponent },
  { path: "resources", component: ResourcesComponent },
  { path: "", redirectTo: "/login", pathMatch: "full"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
