import 'pace';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from "@angular/http";
import { NgModule } from '@angular/core';

import { AgmCoreModule } from 'angular2-google-maps/core';

import { routing } from './app.routing';
import { AppConfig } from './app.config';

import { AppComponent } from './app.component';
import { ErrorComponent } from './pages/error/error.component';

import { AuthenticationService, PocService, UserService, ToolsService } from './services/index';

import { AuthGuard } from './guards/auth.guard';

@NgModule({
  declarations: [
    AppComponent,
    ErrorComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDe_oVpi9eRSN99G4o6TwVjJbFBNr58NxE'
    }),
    routing   
  ],
  providers: [AppConfig, AuthenticationService, PocService, UserService, ToolsService, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
