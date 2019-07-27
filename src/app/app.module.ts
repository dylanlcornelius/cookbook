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
  MatFormFieldModule,
  MatSelectModule,
  MatTabsModule,
  MatSlideToggleModule,
  MatTooltipModule,
  MatExpansionModule,
  MatChipsModule } from '@angular/material';
import { DragDropModule } from '@angular/cdk/drag-drop';
import 'hammerjs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RecipeListComponent } from './recipe/recipe-list/recipe-list.component';
import { RecipeDetailComponent } from './recipe/recipe-detail/recipe-detail.component';
import { RecipeEditComponent } from './recipe/recipe-edit/recipe-edit.component';
import { FooterComponent } from './footer/footer.component';
import { LoadingModalComponent } from 'src/app/modals/loading-modal/loading-modal.component';
import { AuthService } from './user/auth.service';
import { LoginComponent } from './user/login/login.component';
import { LoginGuard } from './user/login/login.guard';
import { IngredientListComponent } from './ingredient/ingredient-list/ingredient-list.component';
import { IngredientDetailComponent } from './ingredient/ingredient-detail/ingredient-detail.component';
import { IngredientEditComponent } from './ingredient/ingredient-edit/ingredient-edit.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { AdminGuard } from './admin/admin.guard';
import { UserPendingComponent } from './user/user-pending/user-pending.component';
import { UserPendingGuard } from './user/user-pending/user-pending.guard';
import { ShoppingListComponent } from './shopping-list/shopping-list/shopping-list.component';
import { ValidationModalComponent } from './modals/validation-modal/validation-modal.component';
import { NotificationModalComponent } from './modals/notification-modal/notification-modal.component';
import { ProfileComponent } from './profile/profile/profile.component';
import { UOMConversion } from 'src/app/ingredient/uom.emun';
import { IngredientModalComponent } from './modals/ingredient-modal/ingredient-modal.component';
import { ItemListComponent } from './item/item-list/item-list.component';

import { firebase } from '@firebase/app';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    RecipeListComponent,
    AboutComponent,
    IngredientListComponent,
    RecipeDetailComponent,
    RecipeEditComponent,
    FooterComponent,
    LoadingModalComponent,
    LoginComponent,
    IngredientDetailComponent,
    IngredientEditComponent,
    AdminDashboardComponent,
    UserPendingComponent,
    ShoppingListComponent,
    ValidationModalComponent,
    NotificationModalComponent,
    ProfileComponent,
    IngredientModalComponent,
    ItemListComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTabsModule,
    MatSlideToggleModule,
    MatTooltipModule,
    MatExpansionModule,
    MatChipsModule,
    DragDropModule,
  ],
  providers: [
    CookieService,
    AuthService,
    LoginGuard,
    AdminGuard,
    UserPendingGuard,
    UOMConversion,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    // TODO: attempt to export const app instead of assuming this will come first
    firebase.initializeApp(environment.config);
  }
}
