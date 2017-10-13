import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, AbstractControl, FormBuilder, Validators} from '@angular/forms';

import { UserService, ToolsService } from '../../../services/index';
import { User } from '../../../models/index';

@Component({
    selector: 'user_edit_password',
    encapsulation: ViewEncapsulation.None,   
    templateUrl: 'user_edit_password.component.html'
})

export class UserEditPasswordComponent {
    public form: FormGroup;
    public password: AbstractControl;
    public confirmPassword: AbstractControl

    loading = false;
    error = '';
    success = '';
    user : User;

    constructor(
        private router: Router,
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

    updatePassword(values:Object):void {
        if (this.form.valid) {
            this.loading = true;
            this.userService.updatePassword(values['password'])
                .subscribe(
                    result => {
                        if (result === 200 || result === 204) {
                            this.success = "Votre mot de passe a bien été modifié";
                        }
                    },
                    err => {
                        if (err === 409){
                            this.error = "Conflict.";
                        }else {
                            this.error = "Une erreur est survenue. Veuillez réessayer svp";
                        }   
                    });
            this.loading = false;
        }
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
