import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './user/login/login.component';
import { RecipesListComponent } from './recipes/recipes-list/recipes-list.component';
import { RecipesDetailComponent } from './recipes/recipes-detail/recipes-detail.component';
import { RecipesCreateComponent } from './recipes/recipes-create/recipes-create.component';
import { RecipesUpdateComponent } from './recipes/recipes-update/recipes-update.component';
import { IngredientsListComponent } from './ingredients/ingredients-list/ingredients-list.component';
import { IngredientsDetailComponent } from './ingredients/ingredients-detail/ingredients-detail.component';
import { IngredientsCreateComponent } from './ingredients/ingredients-create/ingredients-create.component';
import { IngredientsUpdateComponent } from './ingredients/ingredients-update/ingredients-update.component';
import { AboutComponent } from './about/about.component';
import { LoggedInGuard } from './user/logged-in.guard';
import { UserPendingComponent } from './user/user-pending/user-pending.component';
import { UserProfileComponent } from './user/user-profile/user-profile.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { AdminGuard } from './admin/admin.guard';

const routes: Routes = [
  // TODO: Login Guard Home page or not?
  { path: '', component: HomeComponent, canActivate: [LoggedInGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'recipes-list', component: RecipesListComponent, canActivate: [LoggedInGuard] },
  { path: 'recipes-detail/:id', component: RecipesDetailComponent, canActivate: [LoggedInGuard] },
  { path: 'recipes-create', component: RecipesCreateComponent },
  { path: 'recipes-update/:id', component: RecipesUpdateComponent, canActivate: [LoggedInGuard] },
  { path: 'ingredients-list', component: IngredientsListComponent, canActivate: [LoggedInGuard] },
  { path: 'ingredients-detail/:id', component: IngredientsDetailComponent, canActivate: [LoggedInGuard] },
  { path: 'ingredients-create', component: IngredientsCreateComponent, canActivate: [LoggedInGuard] },
  { path: 'ingredients-update/:id', component: IngredientsUpdateComponent, canActivate: [LoggedInGuard] },
  { path: 'about', component: AboutComponent, canActivate: [LoggedInGuard] },
  { path: 'user-pending', component: UserPendingComponent},
  { path: 'user-profile', component: UserProfileComponent, canActivate: [LoggedInGuard] },
  { path: 'admin-dashboard', component: AdminDashboardComponent, canActivate: [LoggedInGuard, AdminGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
