import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, AbstractControl, FormBuilder, Validators} from '@angular/forms';
import { AppState } from "../../app.state";

import { AuthenticationService, UserService, ToolsService } from '../../services/index';

@Component({
    selector: 'login',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './login.component.html'
})

export class LoginComponent {
    public form:FormGroup;
    public email:AbstractControl;
    public password:AbstractControl;

    loading = false;
    error = '';
    success = '';
    hideModal: boolean = false; 

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private userService: UserService,
        private toolsService: ToolsService,
        fb: FormBuilder,
        private _state: AppState) {
            this.form = fb.group({
                'email': ['', Validators.compose([Validators.required, this.toolsService.emailValidator])],
                'password': ['', Validators.compose([Validators.required])]
            });

            this.email = this.form.controls['email'];
            this.password = this.form.controls['password'];
        }

    login(values:Object):void {
        this.loading = true;
        this.authenticationService.login(values['email'], values['password'])
            .subscribe(
                result => {
                    if (result === 200) {
                        this._state.notifyDataChanged('user.isConnected', true);
                        jQuery('#login-modal').modal('hide');
                        window.location.reload();
                    } 
                },
                err => {
                    switch (err){
                        case 1:
                            this.error = "L'email ou le mot de passe est incorrect";
                            break;
                        case 2:
                            this.error = "Votre compte n'est pas validé.";
                            break;
                        case 3:
                            this.error = "Votre compte est bloqué. Veuillez nous contacter";
                            break;
                        case 4:
                            this.error = "Votre compte n'est pas activé. Veuillez cliquer sur le lien d'activation reçu par email";
                            break;
                         default:
                            this.error = "Une erreur est survenue. Veuillez réessayer svp";
                            break;
                    }
                });
                this.loading = false;
    }

  
    askNewPassword (values:Object) {
        this.password.markAsUntouched();
        if(!this.email.valid) {
            this.email.markAsTouched();
            return;
        }else {
            this.authenticationService.askNewPassword(values['email'])
            .subscribe(
                result => {
                    if (result === 200) {
                        this.success = "Vous allez recevoir un email pour réinitialiser votre mot de passe";
                    }
                },
                err => {
                    this.error = "Une erreur est survenue. Veuillez réessayer svp";
                }
            )
        }
    }
    
    askNewEmailValidation(values:Object){
        if(!this.email.valid) {
            this.email.markAsTouched();
            return;
        }else {
            this.authenticationService.askNewEmailValidation(values['email'])
                .subscribe(
                    result => {
                        if (result === 200) {
                            this.success = "Vous allez recevoir un email pour valider votre compte";
                        }
                    },
                    err => {
                        console.log("error from component "+err);
                        this.error = "Une erreur est survenue. Veuillez réessayer svp";
                    }
                )
        }
    }

    goToCreateAccount(){
        jQuery('#login-modal').modal('hide');
        this.router.navigate(['/sign_up']);
    }
}