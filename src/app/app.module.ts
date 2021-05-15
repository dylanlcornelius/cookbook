import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ServiceWorkerModule } from '@angular/service-worker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './user/login/login.component';
import { UserPendingComponent } from './user/user-pending/user-pending.component';
import { UOMConversion } from '@UOMConverson';

import { SharedModule } from '@sharedModule';

import firebase from 'firebase/app';
import 'firebase/firestore';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    FooterComponent,
    LoginComponent,
    UserPendingComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
  ],
  providers: [
    UOMConversion,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    if (environment) {
      firebase.initializeApp(environment.config);
      firebase.firestore().enablePersistence();
    }
  }
}
