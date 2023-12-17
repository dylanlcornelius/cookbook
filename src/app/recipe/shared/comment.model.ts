import { FormControl } from '@angular/forms';
import { Model } from '@model';

export class Comment extends Model {
  documentId: string;
  text: string;
  author: string;
  isResolved: boolean;
  parent: string;

  authorName: string;
  date: string;
  showResolved = false;
  isEditing = false;
  control: FormControl;

  constructor(data: any) {
    super(data);
    this.documentId = data.documentId || '';
    this.text = data.text || '';
    this.author = data.author || '';
    this.isResolved = data.isResolved || false;
    this.parent = data.parent || '';
  }

  public getObject(): CommentObject {
    /* eslint-disable @typescript-eslint/no-unused-vars */
    const { id, authorName, date, showResolved, isEditing, control, ...comment } = this;
    /* eslint-enable @typescript-eslint/no-unused-vars */
    return comment;
  }
}

export type CommentObject = Omit<
  Comment,
  'id' | 'getId' | 'getObject' | 'authorName' | 'date' | 'showResolved' | 'isEditing' | 'control'
>;
export type Comments = Comment[];
