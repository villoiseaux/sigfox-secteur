import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { UserService } from '../../../services/index';

@Component({
    selector: 'email_confirmation',
    encapsulation: ViewEncapsulation.None,    
    templateUrl: 'email_confirmation.component.html'
})

export class EmailConfirmationComponent implements OnInit{
    model: any = {};
    loading = false;
    error = '';
    success = '';

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private userService: UserService) {}

    ngOnInit() {
        this.loading = true;
        this.route.params
            .subscribe(
                params => {
                    this.confirmEmail(params['id'], params['token']);
            });
    }
    
    confirmEmail(userUID: string, token: string){
        this.loading = true;
        this.userService.confirmEmail(userUID, token)
            .subscribe(
                result => {
                    if (result === 200) {
                        console.log("confirmation ok");
                        this.success = "Votre compte a été validé."
                    }else if (result === 204) {
                        this.error = "No content";
                    }
                },
                err => {
                    if  (err === 404){
                        this.error = "Not found. Votre compte ne semble pas exister. Veuillez nous contacter svp";
                    }else if (err === 409){
                        this.error = "Une erreur est survenue. Il semble que vous ayez déjà confirmé votre compte. Veuillez nous contacter svp";
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