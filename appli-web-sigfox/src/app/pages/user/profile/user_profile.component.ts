import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder} from '@angular/forms';

import { UserService } from '../../../services/index';
import { User } from '../../../models/index';

@Component({
    selector: 'user_profile',
    encapsulation: ViewEncapsulation.None,   
    templateUrl: 'user_profile.component.html'
})

export class UserProfileComponent implements OnInit{
    loading = false;
    error = '';
    user : User;

    constructor(
        private router: Router,
        private userService: UserService ) {
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
            },
            err => {
                this.error = "Une erreur est survenue. Veuillez réessayer svp";
            });
            this.loading = false;
    }
}

