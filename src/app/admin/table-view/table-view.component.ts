import { Component, Input } from '@angular/core';
import { Context } from '@context';

@Component({
  selector: 'app-table-view',
  templateUrl: './table-view.component.html',
  styleUrls: ['./table-view.component.scss'],
})
export class TableViewComponent {
  @Input() context: Context;

  isBoolean(obj: any): boolean {
    return typeof obj === 'boolean';
  }

  isArray(obj: any): boolean {
    return Array.isArray(obj);
  }
}
