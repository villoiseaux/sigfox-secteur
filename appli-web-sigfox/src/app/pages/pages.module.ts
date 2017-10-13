import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DirectivesModule } from '../theme/directives/directives.module';
import { PipesModule } from '../theme/pipes/pipes.module';
import { routing } from './pages.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PagesComponent } from './pages.component';

//Theme component
import { MenuComponent } from '../theme/components/menu/menu.component';
import { NavbarComponent } from '../theme/components/navbar/navbar.component';
import { MessagesComponent } from '../theme/components/messages/messages.component';
import { BreadcrumbComponent } from '../theme/components/breadcrumb/breadcrumb.component';
import { BackTopComponent } from '../theme/components/back-top/back-top.component';

//Pages component
import { CatalogueComponent } from './catalogue/catalogue.component';
import { PocDetailComponent } from './poc/poc_detail/poc_detail.component';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './user/account/sign_up.component';
import { EmailConfirmationComponent } from './user/account/email_confirmation.component';
import { ResetPasswordComponent } from './user/account/reset_password.component';
import { UserProfileComponent } from './user/profile/user_profile.component';
import { UserProfileEditComponent } from './user/profile/user_profile_edit.component';
import { UserEditPasswordComponent } from './user/profile/user_edit_password.component';
import { ContactComponent } from './contact/contact.component';
import { FAQComponent } from './faq/faq.component';
import { FavoriteComponent} from './poc/favorite.component';


@NgModule({
  imports: [
    CommonModule,
    DirectivesModule,
    PipesModule,
    FormsModule, 
    ReactiveFormsModule,
    routing,    
  ],
  declarations: [ 
    PagesComponent,
    MenuComponent, NavbarComponent, MessagesComponent, BreadcrumbComponent, BackTopComponent,
    CatalogueComponent, PocDetailComponent,FavoriteComponent,
    LoginComponent, SignUpComponent, EmailConfirmationComponent, ResetPasswordComponent,
    UserProfileComponent, UserProfileEditComponent, UserEditPasswordComponent,
    ContactComponent, FAQComponent, 
  ]
})
export class PagesModule { }
