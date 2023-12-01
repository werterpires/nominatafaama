import { HttpClientModule } from '@angular/common/http'
import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { ToastrModule } from 'ngx-toastr'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
// import { ApprovesComponent } from './components/approves/approves.component'
import { UsersApprovesComponent } from './components/approvals/users-approves/users-approves.component'
import { LoginComponent } from './components/login/login.component'
import { LogonComponent } from './components/logon/logon.component'
import { NominataComponent } from './components/nominata/nominata.component'
import { AcademicDegreesComponent } from './components/parameterization/academic-degrees/academic-degrees.component'
import { AssociationsComponent } from './components/parameterization/associations/associations.component'
import { EclExpTypesComponent } from './components/parameterization/ecl-exp-types/ecl-exp-types.component'
import { EndowmentTypesComponent } from './components/parameterization/endowment-types/endowment-types.component'
import { EvangExpTypesComponent } from './components/parameterization/evang-exp-types/evang-exp-types.component'
import { EvgExperiencesComponent } from './components/records/evg-experiences/evg-experiences.component'
import { SpEvgExperiencesComponent } from './components/records/sp-evg-experiences/sp-evg-experiences.component'
import { HiringStatusComponent } from './components/parameterization/hiring-status/hiring-status.component'
import { LanguageTypesComponent } from './components/parameterization/language-types/language-types.component'
import { LanguagesComponent } from './components/records/languages/languages.component'
import { MaritalStatusComponent } from './components/parameterization/marital-status/marital-status.component'
import { MinistryTypesComponent } from './components/parameterization/minstry-types/ministry-types.component'
import { PublicationTypesComponent } from './components/parameterization/publication-types/publication-types.component'
import { RecordsComponent } from './components/records/records.component'
import { SpAcademicFormmationsComponent } from './components/records/sp-academic-formmations/sp-academic-formmations.component'
import { SpousesComponent } from './components/records/spouses/spouses.component'
import { StudentAcademicFormationsComponent } from './components/records/student-academic-formations/student-academic-formations.component'
import { StudentsComponent } from './components/records/students/students.component'
import { ProfessorsComponent } from './components/records/professors/professors.component'
import { FieldRepsComponent } from './components/records/field-reps/field-reps.component'
import { UnionsComponent } from './components/records/unions/unions.component'
import { ConfirmationDialogComponent } from './components/shared/confirmation-dialog/confirmation-dialog.component'
import { ContainerComponent } from './components/shared/container/container.component'
import { CreationFormComponent } from './components/shared/creation-form/creation-form.component'
import { UniqueIdDirective } from './components/shared/directives/unique-id.directive'
import { LoginMenuComponent } from './components/shared/login-menu/login-menu.component'
import { MainContentComponent } from './components/shared/main-content/main-content.component'
import { UpdateFormComponent } from './components/shared/update-form/update-form.component'
import { StCoursesComponent } from './components/records/st-courses/st-courses.component'
import { PublicationsComponent } from './components/records/publications/publications.component'
import { ProfessionalExperiencesComponent } from './components/records/professional-experiences/professional-experiences.component'
import { PastEclExpsComponent } from './components/records/past-ecl-exps/past-ecl-exps.component'
import { EclExperiencesComponent } from './components/records/ecl-experiences/ecl-experiences.component'
import { OrdinationsComponent } from './components/records/ordinations/ordinations.component'
import { RelatedMinistriesComponent } from './components/records/related-ministries/related-ministries.component'
import { EndowmentsComponent } from './components/records/endowments/endowments.component'
import { PsCoursesComponent } from './components/records/ps-courses/ps-courses.component'
import { SpLanguagesComponent } from './components/records/sp-languages/sp-languages.component'
import { SpPublicationsComponent } from './components/records/sp-publications/sp-publications.component'
import { SpProfessionalExperiencesComponent } from './components/records/sp-professional-experiences/sp-professional-experiences.component'
import { SpPastEclExpComponent } from './components/records/sp-past-ecl-exp/sp-past-ecl-exp.component'
import { SpEndowmentsComponent } from './components/records/sp-endowments/sp-endowments.component'
import { SpRelatedMinistriesComponent } from './components/records/sp-related-ministries/sp-related-ministries.component'
import { PreviousMarriageComponent } from './components/records/previous-marriage/previous-marriage.component'
import { SmallAloneProfessorPhotosComponent } from './components/records/small-alone-professor-photos/small-alone-professor-photos.component'
import { ProfessorPhotosComponent } from './components/parameterization/professor-photos/professor-photos.component'
import { StudentPhotosComponent } from './components/parameterization/student-photos/student-photos.component'
import { FamilyStudentPhotoComponent } from './components/records/family-student-photo/family-student-photo.component'
import { SpouseStudentPhotoComponent } from './components/records/spouse-student-photo/spouse-student-photo.component'
import { ChildrenComponent } from './components/records/children/children.component'
import { StudentToApproveComponent } from './components/approvals/student-to-approve/student-to-approve.component'
import { ApprovalsMenuComponent } from './components/shared/approvals-menu/approvals-menu.component'
import { OneStudentToApproveComponent } from './components/approvals/one-student-to-approve/one-student-to-approve.component'
import { UsersComponent } from './components/records/users/users.component'
import { ParameterizationComponent } from './components/parameterization/parameterization.component'
import { CommonModule, DatePipe } from '@angular/common'
import { NominatasComponent } from './components/parameterization/nominatas/nominatas.component'
import { NominatasStudentsComponent } from './components/parameterization/nominatas-students/nominatas-students.component'
import { NominatasProfessorsComponent } from './components/parameterization/nominatas-professors/nominatas-professors.component'
import { NominatasPhotosComponent } from './components/parameterization/nominatas-photos/nominatas-photos.component'
import { StudentComponent } from './components/student/student.component'
import { StudentPdfComponent } from './components/student/student-pdf/student-pdf.component'
import { GeneralProfessorsComponent } from './components/parameterization/general-professors/general-professors.component'
import { EventsComponent } from './components/parameterization/events/events.component'
import { ScrollToAnchorDirective } from './components/nominata/scroll-to-anchor.directive'
import { VacanciesComponent } from './components/vacancies/vacancies.component'
import { ModalVacancyComponent } from './components/modal-vacancy/modal-vacancy.component'
import { ModalTermComponent } from './components/modal-term/modal-term.component'
import { UnactiveComponent } from './components/parameterization/unactive/unactive.component'
import { AlertModalComponent } from './components/shared/alert-modal/alert-modal.component'
import { NotificationsComponent } from './components/shared/notifications/notifications.component'
import { RepresentationsComponent } from './components/records/representations/representations.component'
import { RepresentationsToApproveComponent } from './components/approvals/representations-to_approve/representations-to-approve.component'
import { OneRepresentationsToApproveComponent } from './components/approvals/one-representation-to-approve/one-representation-to-approve.component'
import { StudentsSpaceComponent } from './components/nominata/students-space/students-space.component'
import { StudentCardsComponent } from './components/shared/student-cards/student-cards.component'
import { VacancyComponent } from './components/vacancies/vacancy/vacancy.component'
import { SmallStudentCardsComponent } from './components/shared/small-student-cards/small-student-cards.component'
import { InvitesComponent } from './components/vacancies/invites/invites.component'
import { ErrorModalComponent } from './components/shared/error-modal/error-modal.component'
import { InvitesToApproveComponent } from './components/approvals/invites-to_approve/invites-to-approve.component'
import { OneInviteToApproveComponent } from './components/approvals/one-invite-to-approve/one-invite-to-approve.component';
import { CallsComponent } from './components/calls/calls.component';
import { AlertComponent } from './components/shared/alert/alert.component'

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ContainerComponent,
    MainContentComponent,
    NominataComponent,
    RecordsComponent,
    MaritalStatusComponent,
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
    SpEvgExperiencesComponent,
    EndowmentTypesComponent,
    MinistryTypesComponent,
    PublicationTypesComponent,
    ConfirmationDialogComponent,
    LoginMenuComponent,
    UpdateFormComponent,
    UniqueIdDirective,
    LanguagesComponent,
    CreationFormComponent,
    EvgExperiencesComponent,
    StCoursesComponent,
    PublicationsComponent,
    ProfessionalExperiencesComponent,
    PastEclExpsComponent,
    EclExperiencesComponent,
    OrdinationsComponent,
    RelatedMinistriesComponent,
    EndowmentsComponent,
    PsCoursesComponent,
    SpLanguagesComponent,
    SpPublicationsComponent,
    SpProfessionalExperiencesComponent,
    SpPastEclExpComponent,
    SpEndowmentsComponent,
    SpRelatedMinistriesComponent,
    PreviousMarriageComponent,
    SmallAloneProfessorPhotosComponent,
    ProfessorPhotosComponent,
    NominatasPhotosComponent,
    StudentPhotosComponent,
    FamilyStudentPhotoComponent,
    SpouseStudentPhotoComponent,
    ChildrenComponent,
    StudentToApproveComponent,
    ApprovalsMenuComponent,
    OneStudentToApproveComponent,
    UsersComponent,
    ParameterizationComponent,
    ProfessorsComponent,
    FieldRepsComponent,
    NominatasComponent,
    NominatasStudentsComponent,
    NominatasProfessorsComponent,
    StudentComponent,
    StudentPdfComponent,
    GeneralProfessorsComponent,
    EventsComponent,
    ScrollToAnchorDirective,
    VacanciesComponent,
    ModalVacancyComponent,
    ModalTermComponent,
    UnactiveComponent,
    AlertModalComponent,
    NotificationsComponent,
    RepresentationsComponent,
    RepresentationsToApproveComponent,
    OneRepresentationsToApproveComponent,
    StudentsSpaceComponent,
    StudentCardsComponent,
    VacancyComponent,
    SmallStudentCardsComponent,
    InvitesComponent,
    ErrorModalComponent,
    InvitesToApproveComponent,
    OneInviteToApproveComponent,
    CallsComponent,
    AlertComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ToastrModule.forRoot(),
    CommonModule,
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent],
})
export class AppModule {}
