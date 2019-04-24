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
  MatSelectModule } from '@angular/material';
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
import { RecipesListComponent } from './recipes/recipes-list/recipes-list.component';
import { RecipesDetailComponent } from './recipes/recipes-detail/recipes-detail.component';
import { RecipesCreateComponent } from './recipes/recipes-create/recipes-create.component';
import { RecipesUpdateComponent } from './recipes/recipes-update/recipes-update.component';
import { FooterComponent } from './footer/footer.component';
import { LoadingModalComponent } from 'src/app/modals/loading-modal/loading-modal.component';
import { AuthService } from './user/auth.service';
import { LoginComponent } from './user/login/login.component';
import { LoginGuard } from './user/login/login.guard';
import { IngredientsListComponent } from './ingredients/ingredients-list/ingredients-list.component';
import { IngredientsCreateComponent } from './ingredients/ingredients-create/ingredients-create.component';
import { IngredientsDetailComponent } from './ingredients/ingredients-detail/ingredients-detail.component';
import { IngredientsUpdateComponent } from './ingredients/ingredients-update/ingredients-update.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { AdminGuard } from './admin/admin.guard';
import { UserPendingComponent } from './user/user-pending/user-pending.component';
import { UserPendingGuard } from './user/user-pending/user-pending.guard';
import { ShoppingListComponent } from './shopping-list/shopping-list/shopping-list.component';
import { ValidationModalComponent } from './modals/validation-modal/validation-modal.component';
import { NotificationModalComponent } from './modals/notification-modal/notification-modal.component';
import { ProfileComponent } from './profile/profile/profile.component';
import { UOMConversion } from 'src/app/ingredients/uom.emun';
import { IngredientModalComponent } from './modals/ingredient-modal/ingredient-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    RecipesListComponent,
    AboutComponent,
    IngredientsListComponent,
    RecipesDetailComponent,
    RecipesCreateComponent,
    RecipesUpdateComponent,
    FooterComponent,
    LoadingModalComponent,
    LoginComponent,
    IngredientsCreateComponent,
    IngredientsDetailComponent,
    IngredientsUpdateComponent,
    AdminDashboardComponent,
    UserPendingComponent,
    ShoppingListComponent,
    ValidationModalComponent,
    NotificationModalComponent,
    ProfileComponent,
    IngredientModalComponent,
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
    MatSelectModule,
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
export class AppModule { }
