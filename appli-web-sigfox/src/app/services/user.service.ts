import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/mergeMap';

import { AuthenticationService } from './index';
import { User } from '../models/index';
import { AppConfig } from "../app.config";

@Injectable()
export class UserService {
    private config:any;
    private usersUrl;
    public user: User;

    constructor(
        private http: Http,  
        private authenticationService: AuthenticationService,
        private appConfig:AppConfig) {
            this.config = this.appConfig.config;
            this.usersUrl = this.config.devApiEndPoint+'/sign_up';
    }
   
    /*
     *  Create a new account
     *  param: email, password, last name, first name, 
     */
    create(email: string, password: string, lastName: string, firstName: string): Observable<number> {
        let body = JSON.stringify({ email: email, 
                                    password: password, 
                                    lastname: lastName, 
                                    firstname: firstName
        });

        let headers = new Headers({ 'content-type':'application/json;charset=utf-8' });
        let options = new RequestOptions({ headers: headers }); 
        
        return this.http.post(this.usersUrl, body,options)
            .map((response: Response) => {
                return 201;
            })
            .catch(this.handleError);
    }
    
    /*
     * Get user info
     * The user needs to be authentified
     */
    getUser(): Observable<Object>{   
        return this.authenticationService.checkAuthentificationValidity()
            .flatMap (
                isAuthenticated => {
                    if(isAuthenticated){
                        let headers = new Headers({ 'x-authorization': 'Bearer ' + this.authenticationService.token });
                        let options = new RequestOptions({ headers: headers });
                        return this.http.get(this.usersUrl+"/"+this.authenticationService.userUID, options)
                            .flatMap(response =>  Observable.of(User.deserialize(response)))
                            .catch(this.handleError);
                    }else {
                         return this.handleError(401);
                    }
                }
            );
    }
    
    /*
     * Update info of User
     * param: email, last name, first name, phone number, bp (optionnal), pdl (optionnal), pce (optionnal), address part 1, address part 2 (optionnal), zip code, city
     * The user needs to be authentified
     */
    updateUser (email: string, lastName: string, firstName: string): Observable<number>{
        return this.authenticationService.checkAuthentificationValidity()
            .flatMap (
                isAuthenticated => {
                    if(isAuthenticated){
                        let headers = new Headers({ 'content-type':'application/json;charset=utf-8','x-authorization': 'Bearer ' + this.authenticationService.token});
                        let options = new RequestOptions({ headers: headers });
                        let body = JSON.stringify({ email: email, 
                                    last_name: lastName, 
                                    first_name: firstName, 
                        });

                        return this.http.put(this.usersUrl+"/"+this.authenticationService.userUID, body, options)
                            .map((response: Response) => {
                                return 200;
                            })
                            .catch(this.handleError);
                    }else {
                         return this.handleError(401);
                    }
                }
            );
    }
    
    /*
     * Update password
     * param: password
     * The user needs to be authentified
     */
    updatePassword (password: string): Observable<number>{
        return this.authenticationService.checkAuthentificationValidity()
            .flatMap (
                isAuthenticated => {
                    if(isAuthenticated){
                        let headers = new Headers({ 'content-type':'application/json;charset=utf-8', 'x-authorization': 'Bearer ' + this.authenticationService.token });
                        let options = new RequestOptions({ headers: headers });
                        let body = JSON.stringify({ password: password });

                        return this.http.put(this.usersUrl+"/"+this.authenticationService.userUID, body, options)
                            .map((response: Response) => {
                                return 200;
                            })
                            .catch(this.handleError);
                    }else {
                         return this.handleError(401);
                    }
                }
            );
    }

    /*
     * Confirm email
     * param: userId, token
     * Used to confirm a new account or an email update
     */
    confirmEmail(userUID: string, token: string): Observable<number> {
        let headers = new Headers({ 'content-type':'application/json;charset=utf-8', 'x-authorization': 'Basic ' + token });
        let options = new RequestOptions({ headers: headers }); 

        return this.http.put(this.usersUrl+"/"+userUID, JSON.stringify({ status: 1 }), options)
            .map((response: Response) => {
                return 200;
            })
            .catch(this.handleError);
    }
     
    /*
     * Reset password
     * param: userId, token, new password
     */
    resetPassword(userUID: string, token: string, newPassword: string): Observable<number> {
        let headers = new Headers({ 'content-type':'application/json;charset=utf-8', 'x-authorization': 'Basic ' + token });
        let options = new RequestOptions({ headers: headers }); 

        return this.http.put(this.usersUrl+"/"+userUID, JSON.stringify({ password: newPassword }), options)
            .map((response: Response) => {
                return 200;
            })
            .catch(this.handleError);
    }

    private handleError (error: any): Observable<number> {
        return Observable.throw(error.json().code);
    }
}