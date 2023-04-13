import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SmallInputComponent } from './components/shared/forms/small-input/small-input.component';
import { MediumInputComponent } from './components/shared/forms/medium-input/medium-input.component';
import { LargeInputComponent } from './components/shared/forms/large-input/large-input.component';
import { LoginComponent } from './components/login/login.component';
import { ResourcesComponent } from './components/resources/resources.component';
import { ContainerComponent } from './components/shared/container/container.component';
import { SidebarComponent } from './components/shared/sidebar/sidebar.component';
import { MainContentComponent } from './components/shared/main-content/main-content.component';
import { AddressesComponent } from './components/resources/addresses/addresses.component';
import { PeopleComponent } from './components/resources/people/people.component';
import { UsersComponent } from './components/resources/users/users.component';
import { RolesComponent } from './components/resources/roles/roles.component';
import { ItensCategoryComponent } from './components/resources/itens-category/itens-category.component';
import { ItensSubCategoryComponent } from './components/resources/itens-sub-category/itens-sub-category.component';

@NgModule({
  declarations: [
    AppComponent,
    SmallInputComponent,
    MediumInputComponent,
    LargeInputComponent,
    LoginComponent,
    ResourcesComponent,
    ContainerComponent,
    SidebarComponent,
    MainContentComponent,
    AddressesComponent,
    PeopleComponent,
    UsersComponent,
    RolesComponent,
    ItensCategoryComponent,
    ItensSubCategoryComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
