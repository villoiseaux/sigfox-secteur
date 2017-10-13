import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { AppConfig } from "../app.config";

import 'rxjs/add/operator/map'
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/mergeMap';
import { UUID } from 'angular2-uuid';

import { User } from '../models/index';

@Injectable()
export class AuthenticationService {
    public token: string;
    public refreshToken: string;
    public userUID: string;
    public expirationDate: number;
    public uuid: string;

    private config:any;
    private authentificateUrl;
    private sessionUrl;

    constructor(
        private http: Http,
        private router: Router,
        private appConfig:AppConfig) {
            var currentUser = JSON.parse(localStorage.getItem('currentUser'));
            this.token = currentUser && currentUser.token;
            this.refreshToken =  currentUser && currentUser.refreshToken;
            this.userUID = currentUser && currentUser.userUID;
            this.expirationDate = currentUser && currentUser.expirationDate;
            this.uuid = currentUser && currentUser.uuid;

            this.config = this.appConfig.config;
            this.authentificateUrl = this.config.devApiEndPoint+'/login';
            this.sessionUrl = this.config.devApiEndPoint+'/session';
    }

    /*
     * User login
     * param: email, password, generated uuid
     */
    login(email: string, password: string): Observable<number> {
        if(!this.uuid){
            this.uuid = UUID.UUID();
        }

        let headers = new Headers({ 'content-type':'application/json;charset=utf-8' });
        let options = new RequestOptions({ headers: headers }); 
        
        return this.http.post(this.authentificateUrl, JSON.stringify({ email: email, password: password, uuid: this.uuid }), options)
            .map((response: Response) => {
                let token = response.json() && response.json().access_token;
                let refreshToken = response.json() && response.json().refresh_token;
                let userUID = response.json() && response.json().user_uid;
                let date = new Date().getTime();
                let expirationDate = date + response.json().expires_in;


                if (refreshToken && expirationDate && token && userUID) {
                    this.token = token;
                    this.userUID = userUID;
                    this.refreshToken = refreshToken;
                    this.expirationDate = expirationDate;
                    localStorage.setItem('currentUser', JSON.stringify({  uuid: this.uuid, userUID: this.userUID, token: this.token, refreshToken: this.refreshToken, expirationDate: expirationDate }));
                    return 200;
                }else {
                    return 400;
                }
            })
            .catch(this.handleError);
    }

    /*
     * Login with Refresh Token
     * param: refresh token
     */
    loginWithRefreshToken(): Observable<number> {
        let headers = new Headers({ 'content-type':'application/json;charset=utf-8' });
        let options = new RequestOptions({ headers: headers }); 

        return this.http.post(this.authentificateUrl, JSON.stringify({ refresh_token: this.refreshToken }), options)
            .map((response: Response) => {
                let token = response.json() && response.json().access_token;
                let refreshToken = response.json() && response.json().refresh_token;
                let date = new Date().getTime();
                let expirationDate = date + response.json().expires_in;
                if (expirationDate && token) {
                    this.token = token;
                    this.expirationDate = expirationDate;
                    this.refreshToken = refreshToken;
                    localStorage.setItem('currentUser', JSON.stringify({ token: this.token, refreshToken: this.refreshToken, expirationDate: expirationDate,userUID:this.userUID  }));
                    return 200;
                }else {
                    this.handleAuthError(401);
                }
            })
            .catch(this.handleAuthError);
    }

    /*
     * Forgot password. Retrieve a 'new password' process from the server.
     * param: email
     */
    askNewPassword(email: string): Observable<number> {
        return this.http.post(this.sessionUrl, JSON.stringify({ email: email, type: "reset-password" }))
            .map((response: Response) => {
                return 200;
            })
            .catch(this.handleError);
    }

    /*
     * Retrieve a 'new account' process from the server
     * param: email
     */
    askNewEmailValidation(email: string): Observable<number> {
        return this.http.post(this.sessionUrl, JSON.stringify({ email: email, type: "verify-email" }))
            .map((response: Response) => {
                return 200;
            })
            .catch(this.handleError);
    }

    /*
     * Log out
     */
    logout(): void {
        this.token = null;
        this.refreshToken = null;
        this.userUID = null;
        this.expirationDate = null;
        localStorage.setItem('currentUser', JSON.stringify({ token: this.token, refreshToken: this.refreshToken, userUID: this.userUID, expirationDate: this.expirationDate }));
        window.location.reload();
    }

    /*
     * Tool method. Check wether a new login is necessary
     */
    checkAuthentificationValidity(): Observable<boolean> {
        let now = new Date().getTime();
        let success: boolean;
        if (this.token && this.expirationDate > now){
            success = true;
            return Observable.of(success);
        }else if (this.refreshToken){
            return this.loginWithRefreshToken()
                .map (
                   result => {
                        success = true;
                        return true;
                    }
                );
        }else {
            this.handleAuthError(401);
            success = false;
            return Observable.of(success);
        }
    }

    private handleAuthError (error: any): Observable<number> {
       if(error == 401) {
            this.logout();
       }
       return Observable.throw(error.json().code);
    }

    private handleError (error: any): Observable<number> {
       return Observable.throw(error.json().code);
    }
}