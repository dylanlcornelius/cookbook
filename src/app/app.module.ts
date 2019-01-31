import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {
  MatInputModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatSortModule,
  MatTableModule,
  MatIconModule,
  MatButtonModule,
  MatCardModule,
  MatFormFieldModule } from '@angular/material';
import 'hammerjs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { AccountComponent } from './account/account.component';
import { AuthComponent } from './auth/auth.component';
import { HomeComponent } from './home/home.component';
import { ListComponent } from './list/list.component';
import { RecipesComponent } from './recipes/recipes.component';
import { AboutComponent } from './about/about.component';
import { IngredientsComponent } from './ingredients/ingredients.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RecipesDetailComponent } from './recipes-detail/recipes-detail.component';
import { RecipesCreateComponent } from './recipes-create/recipes-create.component';
import { RecipesUpdateComponent } from './recipes-update/recipes-update.component';
import { FooterComponent } from './footer/footer.component';
import { LoaderComponent } from './loader/loader.component';
import { AuthService } from './services/auth.service';
import { LoginComponent } from './login/login.component';
import { LoggedInGuard } from './guards/logged-in-guard.guard';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    AccountComponent,
    AuthComponent,
    HomeComponent,
    ListComponent,
    RecipesComponent,
    AboutComponent,
    IngredientsComponent,
    RecipesDetailComponent,
    RecipesCreateComponent,
    RecipesUpdateComponent,
    FooterComponent,
    LoaderComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
  ],
  providers: [AuthService, LoggedInGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
