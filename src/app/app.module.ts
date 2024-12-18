import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ServiceWorkerModule } from '@angular/service-worker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatStepperModule } from '@angular/material/stepper';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './user/login/login.component';
import { UserPendingComponent } from './user/user-pending/user-pending.component';
import { NewUserComponent } from './user/new-user/new-user.component';

import { SharedModule } from '@sharedModule';
import { FirebaseService } from '@firebaseService';

import { environment } from '../environments/environment';
import { FeedbackComponent } from './footer/feedback/feedback.component';
import { GoogleSignInComponent } from './user/google-sign-in/google-sign-in.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    FooterComponent,
    LoginComponent,
    UserPendingComponent,
    NewUserComponent,
    FeedbackComponent,
    GoogleSignInComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatBadgeModule,
    MatSlideToggleModule,
    MatStepperModule,
    MatProgressBarModule,
    SharedModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(private firebase: FirebaseService) {
    if (environment) {
      this.firebase.initializeApp(environment.firebase);

      if (firebase.getApps().length) {
        firebase.appLoaded = true;
        firebase.firestore = firebase.getFirestore();
        firebase.auth = firebase.getAuth();
        firebase.storage = firebase.getStorage();
        firebase.analytics = firebase.getAnalytics();

        firebase.enableMultiTabIndexedDbPersistence(firebase.firestore);
      }
    }
  }
}
