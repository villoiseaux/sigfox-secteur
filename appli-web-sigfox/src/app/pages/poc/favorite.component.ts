import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder} from '@angular/forms';

import { UserService } from '../../services/index';
import { PocService } from '../../services/index';
import { User } from '../../models/index';

import { Poc } from '../../models/index';


@Component({
    selector: 'favorite',
    encapsulation: ViewEncapsulation.None,   
    templateUrl: 'favorite.component.html'
})

export class FavoriteComponent implements OnInit{
    model: any = {};
    loading = false;
    error = '';
    pocs: Poc[];

    constructor(
        private router: Router,
        private userService: UserService,
        private pocService :  PocService) {
        }

    ngOnInit() {
        this.getFavoritePocs();
    }

    getFavoritePocs() {
        this.loading = true;
        this.pocService.getFavorite()
            .subscribe(
                result => {
                    this.pocs = result as Poc[];
                },
                err => {
                    console.log("error from component "+err);
                });
                this.loading = false;
    }

    changeFavorite(poc : Poc){
        let str = JSON.stringify(poc);
        let jsonpoc = JSON.parse(str);
        jsonpoc.favorite = 'true';
        this.pocService.changeFavorite(jsonpoc)
            .subscribe(
                result => {
                    if (result === 200) {
                        this.getFavoritePocs();
                    }
                },
                err => {
                    this.error = "Une erreur est survenue. Veuillez réessayer svp";
                }
            )
    }
}
