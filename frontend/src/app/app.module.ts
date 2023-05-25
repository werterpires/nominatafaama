import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { ContainerComponent } from './components/shared/container/container.component';
import { MainContentComponent } from './components/shared/main-content/main-content.component';
import { NominataComponent } from './components/nominata/nominata.component';
import { RecordsComponent } from './components/records/records.component';
import { MaritalStatusComponent } from './components/records/marital-status/marital-status.component';
import { ApprovesComponent } from './components/approves/approves.component';
import { LogonComponent } from './components/logon/logon.component';
import { UsersApprovesComponent } from './components/approves/users-approves/users-approves.component';
import { UnionsComponent } from './components/records/unions/unions.component';
import { AssociationsComponent } from './components/records/associations/associations.component';
import { HiringStatusComponent } from './components/records/hiring-status/hiring-status.component';
import { StudentsComponent } from './components/records/students/students.component';
import { SpousesComponent } from './components/records/spouses/spouses.component';
import { AcademicDegreesComponent } from './components/records/academic-degrees/academic-degrees.component';
import { StudentAcademicFormationsComponent } from './components/records/student-academic-formations/student-academic-formations.component';
import { SpAcademicFormmationsComponent } from './components/records/sp-academic-formmations/sp-academic-formmations.component';
import { LanguageTypesComponent } from './components/records/language-types/language-types.component';
import { EvangExpTypesComponent } from './components/records/evang-exp-types/evang-exp-types.component';
import { EclExpTypesComponent } from './components/records/ecl-exp-types/ecl-exp-types.component';
import { EndowmentTypesComponent } from './components/records/endowment-types/endowment-types.component';
import { MinistryTypesComponent } from './components/records/minstry-types/ministry-types.component';
import { PublicationTypesComponent } from './components/records/publication-types/publication-types.component';
import { ConfirmationDialogComponent } from './components/shared/confirmation-dialog/confirmation-dialog.component';
import { LoginMenuComponent } from './components/shared/login-menu/login-menu.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ContainerComponent,
    MainContentComponent,
    NominataComponent,
    RecordsComponent,
    MaritalStatusComponent,
    ApprovesComponent,
    LogonComponent,
    UsersApprovesComponent,
    UnionsComponent,
    AssociationsComponent,
    HiringStatusComponent,
    StudentsComponent,
    SpousesComponent,
    AcademicDegreesComponent,
    StudentAcademicFormationsComponent,
    SpAcademicFormmationsComponent,
    LanguageTypesComponent,
    EvangExpTypesComponent,
    EclExpTypesComponent,
    EndowmentTypesComponent,
    MinistryTypesComponent,
    PublicationTypesComponent,
    ConfirmationDialogComponent,
    LoginMenuComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ToastrModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
