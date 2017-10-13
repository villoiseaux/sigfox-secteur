import { Component, ViewEncapsulation } from '@angular/core';
import { AppState } from '../../../app.state';

import { AuthenticationService } from '../../../services/index';

@Component({
  selector: 'az-navbar',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})

export class NavbarComponent {
    public isMenuCollapsed:boolean = false;
    public isConnected:boolean = false;
    
    constructor(
        private _state:AppState, 
        private authenticationService: AuthenticationService) {
            if (this.authenticationService.userUID){
                this.isConnected = true;
            }
            
            this._state.subscribe('user.isConnected', (isConnected) => {
                this.isConnected = isConnected;
            });
            
            this._state.subscribe('menu.isCollapsed', (isCollapsed) => {
                this.isMenuCollapsed = isCollapsed;
            });
        }
    
    public toggleMenu() {
        this.isMenuCollapsed = !this.isMenuCollapsed; 
        this._state.notifyDataChanged('menu.isCollapsed', this.isMenuCollapsed);        
    }

    logOut(){
        this.authenticationService.logout();
        this.isConnected = false;
    }
}
