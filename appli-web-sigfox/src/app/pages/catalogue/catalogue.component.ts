import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { PocService } from '../../services/index';
import { Poc } from '../../models/index';
import { AuthenticationService } from '../../services/index';

@Component({
    selector: 'catalogue',
    encapsulation: ViewEncapsulation.None,
    templateUrl: './catalogue.component.html',
    styleUrls: ['./catalogue.component.scss']
})

export class CatalogueComponent implements OnInit { 
    model: any = {};
    loading = false;
    error = '';
    pocs: Poc[];

    constructor(
        private router: Router,
        private pocService: PocService,
        private authenticationService: AuthenticationService
    ) {
    }

    ngOnInit() {
        if (this.authenticationService.userUID){
            this.getPocs();
        }
    }

    getPocs() {
        this.loading = true;
        this.pocService.getPocs()
            .subscribe(
                result => {
                    this.pocs = result as Poc[];
                },
                err => {
                    console.log("error from component "+err);
                });
                this.loading = false;
    }

    getOpenPocs(){
        this.loading = true;
        this.pocService.getPocsWithStatus(1)
            .subscribe(
                result => {
                    this.pocs = result as Poc[];                
                },
                err => {
                    console.log("error from component "+err);
                });
                this.loading = false;
    }

    changeFavoritePocs(poc : Poc){
        this.pocService.changeFavorite(poc)
            .subscribe(
                result => {
                    if (result === 200) {
                        this.getPocs();
                    }
                },
                err => {
                    this.error = "Une erreur est survenue. Veuillez réessayer svp";
                }
            )
    }
}