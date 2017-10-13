import { Injectable } from '@angular/core';
import { Color, RGB, HEX } from './app.color';
import 'sass-to-js/js/src/sass-to-js.js';

@Injectable()
export class AppConfig {

   sassVariables:any; 
   config:any;

   constructor(){
        this.sassVariables = this.getSassVariables();
        this.config = {
            name: 'DN Lab Sigfox',
            title: 'Site administrateur EDF sondes sigfox',
            version: '0.0.1',
            devApiEndPoint: 'https://sigfox.dn-lab.net/api/',
            colors:{
                main: this.sassVariables['main-color'],
                default: this.sassVariables['default-color'],
                dark: this.sassVariables['dark-color'],
                primary: this.sassVariables['primary-color'],
                info: this.sassVariables['info-color'],
                success: this.sassVariables['success-color'],
                warning: this.sassVariables['warning-color'],
                danger: this.sassVariables['danger-color'],
                sidebarBgColor: this.sassVariables['sidebar-bg-color'],
                gray: this.sassVariables['gray'],
                grayLight: this.sassVariables['gray-light']
            }
        }
   }   

    getSassVariables() {
        let variables = jQuery('body').sassToJs({pseudoEl:"::after", cssProperty: "content"});
        return variables;         
    }
 
    rgba(color, opacity){
        if(color.indexOf('#') >= 0){
            if(color.slice(1).length == 3){
                color= '#' + color.slice(1) + '' + color.slice(1);
            }            
            return new Color(new HEX(color)).setAlpha(opacity).toString();
        } 
        else{
            console.log("incorrect color: " + color); 
            return 'rgba(255,255,255,0.7)'; 
        }     
    }

}
