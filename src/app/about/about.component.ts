import { Component, OnInit } from '@angular/core';
import { combineLatest, first } from 'rxjs';
import { RecipeService } from '../recipe/shared/recipe.service';
import { Recipe } from '../recipe/shared/recipe.model';
import { ImageService } from '../util/image.service';
import timediff from 'timediff';
import { fadeInAnimation } from '../theme/animations';
import { UserService } from '../user/shared/user.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  animations: [fadeInAnimation],
})
export class AboutComponent implements OnInit {
  now = new Date();
  birthday = new Date('2018/9/9');
  diff = timediff(this.birthday, this.now, 'YMD');

  selectedRecipes: Recipe[] = [];

  recipeTotal = 0;
  authorTotal = 0;

  constructor(
    private recipeService: RecipeService,
    private imageService: ImageService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.load();
  }

  load(): void {
    const recipes$ = this.recipeService.get();
    const users$ = this.userService.get();

    combineLatest([recipes$, users$])
      .pipe(first())
      .subscribe(([recipes, users]) => {
        const imageRecipes = recipes
          ?.filter(({ hasImage }) => !!hasImage)
          .map(recipe => {
            this.imageService.download(recipe).then(
              url => {
                if (url) {
                  recipe.image = url;
                }
              },
              () => {}
            );
            return recipe;
          });

        for (let i = 0; i < 3; i++) {
          const random = Math.floor(Math.random() * imageRecipes.length);
          this.selectedRecipes.push(imageRecipes[random]);
          imageRecipes.splice(random, 1);
        }

        this.recipeTotal = recipes.length;
        this.authorTotal = users.length;
      });
  }
}
