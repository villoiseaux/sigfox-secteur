import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, AbstractControl, FormBuilder, Validators} from '@angular/forms';



import { ToolsService, AuthenticationService, UserService } from '../../services/index';
import { User } from '../../models/index';

@Component({
    selector: 'contact',
    encapsulation: ViewEncapsulation.None,
    templateUrl: 'contact.component.html'
})

export class ContactComponent implements OnInit{
    public form: FormGroup;
    public email: AbstractControl;
    public subject: AbstractControl;
    public message: AbstractControl
    public lastName: AbstractControl;
    public name: AbstractControl;

    loading = false;
    error = '';
    success = '';
    user : User;

    constructor(
    private router: Router,
    private toolsService: ToolsService,
    private authenticationService: AuthenticationService,
    private userService: UserService,    
    formBuilder:FormBuilder) {
        this.form = formBuilder.group({
            'email': ['', Validators.compose([Validators.required, toolsService.emailValidator])],
            'subject': ['', Validators.compose([Validators.required, Validators.minLength(2)])],
            'message': ['', Validators.compose([Validators.required, Validators.minLength(2)])],
            'lastName': ['', Validators.compose([Validators.required, toolsService.lastNameValidator ])],
            'name': ['', Validators.compose([Validators.required, toolsService.nameValidator])],
        });

        this.email = this.form.controls['email'];
        this.subject = this.form.controls['subject'];
        this.message = this.form.controls['message'];
        this.name = this.form.controls['name'];
        this.lastName = this.form.controls['lastName'];
    }

    ngOnInit() {
        if(this.authenticationService.userUID){
            //fill the fields with saved info
            this.getUser();
        }
    }

    getUser(){
       this.userService.getUser()
        .subscribe(
            result => {
                this.user = result as User;
                this.email.setValue(this.user.email);
                this.name.setValue(this.user.firstName);
                this.lastName.setValue(this.user.lastName);
            });
    }

    sendMessage(values:Object):void{
        
        if (this.form.valid) {
            this.loading = true;
            this.toolsService.sendEmail(values['name'], values['lastName'], values['email'], values['subject'],values['message'])
            .subscribe(
                   result => {
                       if (result === 201) {
                           this.success = "Votre message a bien été envoyé.";
                        }
                    },
                    err => {
                        this.error = "Une erreur est survenue. Veuillez réessayer svp";
                    });
                this.loading = false;
        }
    }
}
