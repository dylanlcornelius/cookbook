/*
** DROP THIS IN HTML **
<app-loading-modal *ngIf="loading"></app-loading-modal>

** DROP THIS IN TYPESCRIPT **
loading = true;
...
loading = false;
*/

import { Component } from '@angular/core';

@Component({
  selector: 'app-loading-modal',
  templateUrl: './loading-modal.component.html',
  styleUrls: ['./loading-modal.component.css']
})
export class LoadingModalComponent {

  constructor() { }

}
