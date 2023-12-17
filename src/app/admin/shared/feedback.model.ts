import { Model } from '@model';

export class Feedback extends Model {
  description: string;
  author: string;
  uid: string;

  constructor(data: any) {
    super(data);
    this.description = data.description || '';
    this.author = data.author || '';
    this.uid = data.uid || '';
  }
}

export type Feedbacks = Feedback[];
