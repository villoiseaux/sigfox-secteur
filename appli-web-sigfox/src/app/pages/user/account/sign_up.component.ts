import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, AbstractControl, FormBuilder, Validators} from '@angular/forms';
import { UserService, ToolsService } from '../../../services/index';

@Component({
    selector: 'sign_up',
    encapsulation: ViewEncapsulation.None,
    templateUrl: 'sign_up.component.html'
})

export class SignUpComponent implements OnInit{
    public form: FormGroup;
    public email: AbstractControl;
    public password: AbstractControl;
    public confirmPassword: AbstractControl
    public lastName: AbstractControl;
    public name: AbstractControl;

    loading = false;
    error = '';
    success = '';

    constructor(
        private router: Router,
        private userService: UserService,
        private toolsService: ToolsService,
        formBuilder:FormBuilder) { 
            this.form = formBuilder.group({
                'email': ['', Validators.compose([Validators.required, this.toolsService.emailValidator])],
                'password': ['', Validators.compose([Validators.required, this.toolsService.passwordValidator])],
                'confirmPassword': ['', Validators.required],
                'lastName': ['', Validators.compose([Validators.required, this.toolsService.lastNameValidator])],
                'name': ['', Validators.compose([Validators.required, this.toolsService.nameValidator])],
            },{validator: matchingPasswords('password', 'confirmPassword')});

            this.email = this.form.controls['email'];
            this.password = this.form.controls['password'];
            this.confirmPassword = this.form.controls['confirmPassword'];
            this.name = this.form.controls['name'];
            this.lastName = this.form.controls['lastName'];
        }

    ngOnInit(): void {
        jQuery('[data-toggle="popover"]').popover({html: true});
    }

    create(values:Object):void{
        if (this.form.valid) {
            this.loading = true;
            this.userService.create(values['email'], values['password'], values['lastName'], values['name'])
                .subscribe(
                    result => {
                        if (result === 201) {
                            this.success = "Votre compte a bien été créé. Consultez votre boîte mail afin de confirmer votre e-mail et activer votre compte";
                        }
                    },
                    err => {
                        if (err === 409){
                            this.error = "Une erreur est survenue. Cette adresse e-mail semble déjà utilisée.";
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
