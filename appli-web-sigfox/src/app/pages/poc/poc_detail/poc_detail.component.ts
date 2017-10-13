import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { PocService } from '../../../services/index';
import { Poc } from '../../../models/index';

import { AuthenticationService } from '../../../services/index';

@Component({
    selector: 'poc_detail',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './poc_detail.component.html'
})

export class PocDetailComponent implements OnInit  {
    model: any = {};
    loading = false;
    error = '';
    poc: Poc;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private pocService: PocService, 
        private authenticationService: AuthenticationService) {}

    ngOnInit() {
        this.route.params
            .subscribe(
                params => {
                    this.getPocWithId(params['pocId']);
            });
    }

    getPocWithId(uid: string) {
        this.loading = true;
        this.pocService.getPocWithId(uid)
            .subscribe(
                result => {
                    this.poc = result as Poc;
                    //if(this.poc.status != 0){
                        //poc is not open. We cannot see its detail
                    //    this.router.navigate(['']);
                    //}
                },
                err => {
                    this.error = "Une erreur est survenue. Veuillez réessayer svp";
                });
                this.loading = false;
    }
}