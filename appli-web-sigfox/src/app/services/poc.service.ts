import { Injectable } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';

import { AppConfig } from "../app.config";

import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/of';

import { Poc } from '../models/index';
import { AuthenticationService } from './index';

@Injectable()
export class PocService {
    private config:any;
    private pocsUrl;

    constructor(
        private http: Http, 
        private authenticationService: AuthenticationService,
        private appConfig:AppConfig) { 
            this.config = this.appConfig.config;
            this.pocsUrl = this.config.devApiEndPoint+'/pocs';
        }

    /*
     * Get all POCS
     */
    getPocs(): Observable<Object[]>{
        let headers = new Headers({ 'x-authorization': 'Bearer ' + this.authenticationService.token });
        let options = new RequestOptions({ headers: headers });
        return this.http.get(this.pocsUrl+"/"+ this.authenticationService.userUID,options)
            .flatMap(response =>  {
                let body = JSON.parse(response.json());
                let pocs : Array<Object> = [];
                for(let entry of body){
                    let poc = Poc.deserialize(entry);
                    pocs.push(poc);
                }
                return Observable.of(pocs);        
            });
    }

    /*
     * Get POCS with specific status
     * param: status
     */
    getPocsWithStatus(status: number): Observable<Object[]>{
        return this.http.get(this.pocsUrl+"?status="+status)
            .flatMap(response =>  {
                let body = response.json();

                let pocs : Array<Object> = [];
                for(let entry of body){
                    let poc = Poc.deserialize(entry);
                    pocs.push(poc);
                }
                return Observable.of(pocs);        
            });    
        }

    /*
     * Get specific POCS
     * param; pocId
     */
    getPocWithId(uid: string): Observable<Object> {
        return this.http.get(this.pocsUrl+"/"+uid)
            .flatMap(response =>  Observable.of(Poc.deserialize(response.json())))
            .catch(this.handleError);
    }

    private handleError (error: any): Observable<number> {
        return Observable.throw(error.json().code);
    }

    /*
    *Change status of favorite POCS
    *param: pocId
    */
    changeFavorite(poc: Poc): Observable<number>{
        let body = JSON.stringify({ poc: poc });
        let headers = new Headers({ 'content-type':'application/json;charset=utf-8' });
        let options = new RequestOptions({ headers: headers }); 
        return this.http.put(this.pocsUrl+"/"+ this.authenticationService.userUID,body,options)
            .map((response: Response) => {
                return 200;
            })
            .catch(this.handleError);
    }
    /*
    *Get fravorite pocs
    */
    getFavorite(): Observable<Object>{
        let headers = new Headers({ 'x-authorization': 'Bearer ' + this.authenticationService.token });
        let options = new RequestOptions({ headers: headers });
        return this.http.get(this.pocsUrl+"/favorite/"+ this.authenticationService.userUID,options)
            .flatMap(response =>  {
                let body = JSON.parse(response.json());
                let pocs : Array<Object> = [];
                for(let entry of body){
                    let poc = Poc.deserialize(entry);
                    pocs.push(poc);
                }
                return Observable.of(pocs);        
            });
    }

}