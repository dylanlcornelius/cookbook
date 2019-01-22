import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { AccountComponent } from './account/account.component';
import { AuthComponent } from './auth/auth.component';
import { EditorComponent } from './editor/editor.component';
import { HomeComponent } from './home/home.component';
import { ListComponent } from './list/list.component';
import { RecipesComponent } from './recipes/recipes.component';
import { AboutComponent } from './about/about.component';
import { IngredientsComponent } from './ingredients/ingredients.component';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    AccountComponent,
    AuthComponent,
    EditorComponent,
    HomeComponent,
    ListComponent,
    RecipesComponent,
    AboutComponent,
    IngredientsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
