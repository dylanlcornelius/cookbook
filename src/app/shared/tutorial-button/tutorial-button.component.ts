import { Component } from '@angular/core';
import { TutorialService } from '@tutorialService';

@Component({
  selector: 'app-tutorial-button',
  templateUrl: './tutorial-button.component.html',
  styleUrls: ['./tutorial-button.component.scss'],
})
export class TutorialButtonComponent {
  constructor(private tutorialService: TutorialService) {}

  openTutorial = (): void => this.tutorialService.openTutorial(true);
}
