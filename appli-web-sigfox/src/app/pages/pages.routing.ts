import { Routes, RouterModule } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

import { PagesComponent } from './pages.component';
import { CatalogueComponent } from './catalogue/catalogue.component';
import { PocDetailComponent } from './poc/poc_detail/poc_detail.component';
import { SignUpComponent } from './user/account/sign_up.component';
import { EmailConfirmationComponent } from './user/account/email_confirmation.component';
import { ResetPasswordComponent } from './user/account/reset_password.component';
import { UserProfileComponent } from './user/profile/user_profile.component';
import { UserProfileEditComponent } from './user/profile/user_profile_edit.component';
import { FavoriteComponent} from './poc/favorite.component';

import { ContactComponent } from './contact/contact.component';
import { FAQComponent } from './faq/faq.component';

import { AuthGuard } from '../guards/auth.guard';

export const routes: Routes = [
    {
        path: '', 
        component: PagesComponent,
        children:[
            { path: '', component: CatalogueComponent },
            { path: 'poc_detail/:pocId', component: PocDetailComponent },
            { path: 'sign_up', component: SignUpComponent },
            { path: 'contact', component: ContactComponent },
            { path: 'email_confirmation/:id/:token', component: EmailConfirmationComponent },
            { path: 'reset_password/:id/:token', component: ResetPasswordComponent },
            { path: 'profile', component: UserProfileComponent, canActivate: [AuthGuard] },
            { path: 'edit_profile', component: UserProfileEditComponent, canActivate: [AuthGuard] },
            { path: 'faq', component: FAQComponent },
            { path: 'favorite', component: FavoriteComponent }
        ]
    }
];

export const routing: ModuleWithProviders = RouterModule.forChild(routes);