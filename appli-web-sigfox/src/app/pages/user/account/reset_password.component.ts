import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, AbstractControl, FormBuilder, Validators} from '@angular/forms';

import { UserService, ToolsService } from '../../../services/index';

@Component({
    selector: 'reset_password',
    encapsulation: ViewEncapsulation.None, 
    templateUrl: './reset_password.component.html'
})

export class ResetPasswordComponent implements OnInit {
    public form: FormGroup;
    public password: AbstractControl;
    public confirmPassword: AbstractControl;

    loading = false;
    error = '';
    success = '';
    userUID: string;
    token: string;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private userService: UserService,
        private toolsService: ToolsService,
        formBuilder:FormBuilder) { 
            this.form = formBuilder.group({
                'password': ['', Validators.compose([Validators.required, this.toolsService.passwordValidator])],
                'confirmPassword': ['', Validators.required],
            },{validator: matchingPasswords('password', 'confirmPassword')});

            this.password = this.form.controls['password'];
            this.confirmPassword = this.form.controls['confirmPassword'];
        }

     ngOnInit() {
         this.route.params
            .subscribe(
                params => {
                    this.userUID = params['id'];
                    this.token = params['token'];
            });
     }

     resetPassword (values:Object):void{
        this.loading = true;
        this.userService.resetPassword(this.userUID, this.token, values['password'])
            .subscribe(
                result => {
                    if (result === 200) {
                        this.success = "Votre mot de passe a été modifié."
                    }else if (result === 204) {
                        this.error = "No content";
                    }
                },
                err => {
                    if  (err === 404){
                        this.error = "Votre compte ne semble pas exister. Veuillez nous contacter svp";
                    }else if (err === 409){
                        this.error = "Une erreur est survenue. Veuillez nous contacter svp";
                    }else {
                        this.error = "Une erreur est survenue. Veuillez rafraichir la page svp";
                    }
                });
                this.loading = false;
     }

    login(){
        jQuery('#login-modal').modal('show');
    }
}

export function matchingPasswords(passwordKey: string, passwordConfirmationKey: string) {
    return (group: FormGroup) => {
        let password= group.controls[passwordKey];
        let passwordConfirmation= group.controls[passwordConfirmationKey];
        if (password.value !== passwordConfirmation.value) {
            return passwordConfirmation.setErrors({mismatchedPasswords: true})
        }
    }
}