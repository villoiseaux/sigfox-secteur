import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, AbstractControl, FormBuilder, Validators} from '@angular/forms';

import { UserService, ToolsService } from '../../../services/index';
import { User } from '../../../models/index';

@Component({
    selector: 'user_profile_edit',
    encapsulation: ViewEncapsulation.None,   
    templateUrl: 'user_profile_edit.component.html'
})

export class UserProfileEditComponent implements OnInit{
    public form: FormGroup;
    public email: AbstractControl;
    public lastName: AbstractControl;
    public name: AbstractControl;
 

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
                'email': ['', Validators.compose([Validators.required, this.toolsService.emailValidator])],
                'lastName': ['', Validators.compose([Validators.required, this.toolsService.lastNameValidator])],
                'name': ['', Validators.compose([Validators.required, this.toolsService.nameValidator])],
            });

            this.email = this.form.controls['email'];
            this.name = this.form.controls['name'];
            this.lastName = this.form.controls['lastName'];
        }

    ngOnInit() {
        this.getUser();
    }
    
    getUser(){
       this.loading = true;
       this.userService.getUser()
        .subscribe(
            result => {
                this.user = result as User;
                this.email.setValue(this.user.email);
                this.name.setValue(this.user.firstName);
                this.lastName.setValue(this.user.lastName);
            },
            err => {
                this.error = "Une erreur est survenue. Veuillez réessayer svp";
            });
            this.loading = false;
    }

    updateUser(values:Object):void {
        if (this.form.valid) {
            this.loading = true;
            this.userService.updateUser(values['email'], values['lastName'], values['name'])
                .subscribe(
                    result => {
                        if (result === 200 || result === 204) {;
                            this.success = "Votre compte a bien été modifié";
                        }
                    },
                    err => {
                        if (err === 409){
                            this.error = "L'adresse email indiquée est déjà utilisée";
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
