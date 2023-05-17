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
