import { Component, OnDestroy, OnInit } from '@angular/core';
import { TutorialModalService } from '@modalService';
import { Subject } from 'rxjs';
import { takeUntil, takeWhile } from 'rxjs/operators';
import { POSITION, Tutorial, TutorialModal, Tutorials } from '@tutorial';
import { TutorialService } from '@tutorialService';
import { Router } from '@angular/router';
import { LoadingService } from '@loadingService';
import { fadeInAnimation } from 'src/app/theme/animations';
import { FirebaseService } from '@firebaseService';

@Component({
  selector: 'app-tutorial-modal',
  templateUrl: './tutorial-modal.component.html',
  styleUrls: ['./tutorial-modal.component.scss'],
  animations: [fadeInAnimation],
})
export class TutorialModalComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();
  params?: TutorialModal;

  tutorials: Tutorials;
  tutorial: Tutorial;
  tutorialIndex: number;

  top?: string;
  left?: string;

  constructor(
    private router: Router,
    private loadingService: LoadingService,
    private tutorialModalService: TutorialModalService,
    private tutorialService: TutorialService,
    private firebase: FirebaseService
  ) {}

  ngOnInit() {
    this.load();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  load(): void {
    this.tutorialModalService
      .getModal()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((params: TutorialModal) => {
        this.params = params;

        this.tutorialService
          .getAll()
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe((tutorials: Tutorials) => {
            this.tutorials = tutorials;

            if (this.params) {
              if (this.params.startingUrl) {
                this.tutorialIndex = this.tutorials.findIndex((tutorial) =>
                  this.params?.startingUrl?.includes(tutorial.baseUrl)
                );
              }
              if (!this.params.startingUrl || this.tutorialIndex === -1) {
                this.tutorialIndex = 0;
              }

              this.top = undefined;
              this.left = undefined;
              this.changeTutorial();
            }
          });
      });
  }

  initModal = (): void => {
    setTimeout(() => {
      let element;
      if (this.tutorial.element) {
        element = document.querySelector(this.tutorial.element);
      }

      if (element) {
        element.scrollIntoView({ behavior: 'auto', block: 'center' });
        element.classList.add('highlighted-element');

        if (this.tutorial.position === POSITION.LEFT) {
          this.left = `${element.getBoundingClientRect().right - window.scrollX - 220}px`;
        } else {
          this.left = `${element.getBoundingClientRect().left - window.scrollX}px`;
        }
        this.top = `${element.getBoundingClientRect().bottom - window.scrollY + 5}px`;
      } else {
        this.top = '50%';
        this.left = 'calc(50% - 110px)';
      }
    }, 100);
  };

  changeTutorial(): void {
    if (this.tutorial && this.tutorial.element) {
      const element = document.querySelector(this.tutorial.element);
      element?.classList.remove('highlighted-element');
    }

    this.tutorial = this.tutorials[this.tutorialIndex];
    if (this.router.url != this.tutorial.url) {
      this.router.navigateByUrl(this.tutorial.url, { skipLocationChange: true }).then(() => {
        this.loadingService
          .get()
          .pipe(takeWhile((loading: boolean) => loading, true))
          .subscribe((loading: boolean) => {
            if (!loading) {
              this.initModal();
            }
          });
      });
    } else {
      this.initModal();
    }
  }

  previous(): void {
    this.tutorialIndex--;
    if (this.tutorialIndex >= 0) {
      this.changeTutorial();
    }
  }

  next(): void {
    this.tutorialIndex++;
    if (this.tutorialIndex >= this.tutorials.length) {
      this.firebase.logEvent('tutorial_complete');
      this.close();
    } else {
      this.changeTutorial();
    }
  }

  close(): void {
    if (this.tutorial.element) {
      const element = document.querySelector(this.tutorial.element);
      element?.classList.remove('highlighted-element');
    }
    this.router.navigate([this.params?.originalUrl]);
    this.tutorialModalService.setModal(undefined);
  }
}
