import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { FormControl } from '@angular/forms';

import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map'

import { AppConfig } from "../app.config";

@Injectable()
export class ToolsService {
    private config:any;
    private contactUrl;

    constructor(
        private http: Http,
        private appConfig:AppConfig) {
            this.config = this.appConfig.config;
            this.contactUrl = this.config.devApiEndPoint+'/contact';
        }

    sendEmail(firstName: string, lastName: string, fromAddress: string, subject: string, message: string){
        let body = JSON.stringify({ first_name: firstName,
                                    last_name: lastName,
                                    from_address: fromAddress,
                                    subject: subject,
                                    text: message
        });

        let headers = new Headers({ 'content-type':'application/json;charset=utf-8' });
        let options = new RequestOptions({ headers: headers }); 

        return this.http.post(this.contactUrl, body, options)
            .map((response: Response) => {
                return 201;
            })
        .catch(this.handleError);
    }

    private handleError (error: any): Observable<number> {
        return Observable.throw(error.json().code);
    }

    /* Form Validation */

    emailValidator(control: FormControl): {[key: string]: any} {
        var emailRegexp = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,7}$/;    
        if (control.value && !emailRegexp.test(control.value)) {
            return {invalidEmail: true};
        }
    }

    /*
	 * A digit must occur at least once
	 * A lower case letter must occur at least once
	 * An upper case letter must occur at least once
	 * A special character must occur at least once
 	 * No whitespace allowed in the entire string
	 * A anything, at least eight places though
     */
    passwordValidator(control: FormControl): {[key: string]: any} {
        var passwordRegexp = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
        if (control.value && !passwordRegexp.test(control.value)) {
            return {invalidPassword: true};
        }
    }
    //8 caractères ainsi qu'une minuscule, une majuscule, un chiffre et un caractère spécial.

     /*
      * 2 characters min
      * May contains space or -
      */
    nameValidator(control: FormControl): {[key: string]: any} {
        var nameRegexp = /^[a-zA-ZÀ-ÿ-' ]{2,}$/;    
        if (control.value && !nameRegexp.test(control.value)) {
            return {invalidName: true};
        }
    }

     /*
      * 2 characters min
      * May contains space or -
      */    
    lastNameValidator(control: FormControl): {[key: string]: any} {
        var lastNameRegexp = /^[a-zA-ZÀ-ÿ-' ]{2,}$/;   
        if (control.value && !lastNameRegexp.test(control.value)) {
            return {invalidLastName: true};
        }
    }

     /*
      * 2 characters min
      * May contains space or - or ' or digits
      */
    adressValidator(control: FormControl): {[key: string]: any} {
        var addressRegexp = /^[a-zA-ZÀ-ÿ0-9-' ]{2,}$/;  
        if (control.value && !addressRegexp.test(control.value)) {
            return {invalidAddressPart1: true};
        }
    }

     /*
      * 2 characters min
      * May contains space or - or ' or digits
      */
    cityValidator(control: FormControl): {[key: string]: any} {
        var cityRegexp = /^[a-zA-ZÀ-ÿ0-9-' ]{2,}$/;  
        if (control.value && !cityRegexp.test(control.value)) {
            return {invalidCity: true};
        }
    }

    /*
     * 5 digits XX XXX or XXXXX
     */
    zipCodeValidator(control: FormControl): {[key: string]: any} {
        var zipCodeRegexp = /^[0-9]{2}[ ]?[0-9]{3}$/;  
        if (control.value && !zipCodeRegexp.test(control.value)) {
            return {invalidZipCode: true};
        }
    }

	/*
	 * Pass: 01 46 70 89 12 || 01-46-70-89-12 || 0146708912
	 */ 
    phoneNumberValidator(control: FormControl): {[key: string]: any} {
        var phoneRegexp = /^(0)[1-9]([-. ]?[0-9]{2}){4}$/;

        if (control.value && !phoneRegexp.test(control.value)) {
            return {invalidPhoneNumber: true};
        }
    }
     /*
      * 14 digits exactly
      */    
    pdlValidator(control: FormControl): {[key: string]: any} {
        var pdlRegexp = /^([0-9]{14})$/;
        if (control.value && !pdlRegexp.test(control.value)) {
            return {invalidPdl: true};
        }
    }

     /*
      * 10 digits exactly
      * Starts with a 5 or 6 digit
      */   
    bpValidator(control: FormControl): {[key: string]: any} {
        var bpRegexp = /^[5-6]{1}[0-9]{9}$/;
        if (control.value && !bpRegexp.test(control.value)) {
            return {invalidBp: true};
        }
    }
}