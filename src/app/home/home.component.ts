import { Component } from '@angular/core';
import { Navigation } from '@navigation';
import { NavigationService } from '@navigationService';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  navs: Navigation[] = [];

  constructor(
    private navigationService: NavigationService
  ) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.navigationService.get().subscribe(navs => {
      this.navs = navs.filter(({ isNavOnly }) => !isNavOnly);
    });
  }
}
