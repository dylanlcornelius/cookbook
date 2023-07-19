import { Component, OnInit } from '@angular/core';
import { TutorialService } from '@tutorialService';

@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.component.html',
  styleUrls: ['./tutorial.component.scss'],
})
export class TutorialComponent implements OnInit {
  constructor(private tutorialService: TutorialService) {}

  ngOnInit() {
    this.load();
  }

  load(): void {
    this.tutorialService.openTutorial(false);
  }
}
