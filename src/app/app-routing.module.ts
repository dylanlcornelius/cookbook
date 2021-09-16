import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { LoginComponent } from './user/login/login.component';
import { UserPendingComponent } from './user/user-pending/user-pending.component';

import { LoginGuard } from './user/shared/login.guard';
import { UserPendingGuard } from './user/shared/user-pending.guard';
import { AdminGuard } from './admin/shared/admin.guard';

// LoginGuard: any component without a guard will need to check for a user id
const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent, canActivate: [LoginGuard, UserPendingGuard]},
  {path: 'login', component: LoginComponent},
  {path: 'user-pending', component: UserPendingComponent, canActivate: [LoginGuard]},
  {path: 'recipe', loadChildren: () => import('./recipe/recipe.module').then(m => m.RecipeModule), canActivateChild: [LoginGuard, UserPendingGuard]},
  {path: 'ingredient', loadChildren: () => import ('./ingredient/ingredient.module').then(m => m.IngredientModule), canActivateChild: [LoginGuard, UserPendingGuard]},
  {path: 'shopping', loadChildren: () => import('./shopping/shopping.module').then(m => m.ShoppingModule), canActivateChild: [LoginGuard, UserPendingGuard]},
  {path: 'about', loadChildren: () => import('./about/about.module').then(m => m.AboutModule), canActivateChild: [LoginGuard, UserPendingGuard]},
  {path: 'profile', loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule), canActivateChild: [LoginGuard, UserPendingGuard]},
  {path: 'admin', loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule), canActivateChild: [LoginGuard, UserPendingGuard, AdminGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
