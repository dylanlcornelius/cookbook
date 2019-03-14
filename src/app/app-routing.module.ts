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
import { LoginGuard } from './user/login/login.guard';
import { UserPendingComponent } from './user/user-pending/user-pending.component';
import { UserProfileComponent } from './user/user-profile/user-profile.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { AdminGuard } from './admin/admin.guard';
import { UserPendingGuard } from './user/user-pending/user-pending.guard';

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [LoginGuard, UserPendingGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'recipes-list', component: RecipesListComponent, canActivate: [LoginGuard, UserPendingGuard] },
  { path: 'recipes-detail/:id', component: RecipesDetailComponent, canActivate: [LoginGuard, UserPendingGuard] },
  { path: 'recipes-create', component: RecipesCreateComponent, canActivate: [LoginGuard, UserPendingGuard] },
  { path: 'recipes-update/:id', component: RecipesUpdateComponent, canActivate: [LoginGuard, UserPendingGuard] },
  { path: 'ingredients-list', component: IngredientsListComponent, canActivate: [LoginGuard, UserPendingGuard] },
  { path: 'ingredients-detail/:id', component: IngredientsDetailComponent, canActivate: [LoginGuard, UserPendingGuard] },
  { path: 'ingredients-create', component: IngredientsCreateComponent, canActivate: [LoginGuard, UserPendingGuard] },
  { path: 'ingredients-update/:id', component: IngredientsUpdateComponent, canActivate: [LoginGuard, UserPendingGuard] },
  { path: 'about', component: AboutComponent, canActivate: [LoginGuard, UserPendingGuard] },
  { path: 'user-pending', component: UserPendingComponent, canActivate: [LoginGuard]},
  { path: 'user-profile', component: UserProfileComponent, canActivate: [LoginGuard, UserPendingGuard] },
  { path: 'admin-dashboard', component: AdminDashboardComponent, canActivate: [LoginGuard, UserPendingGuard, AdminGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
