import { Modal } from '@modalService';

export class Validation extends Modal {
  text: string;
  function: Function;
  args: any[];

  constructor(text: string, event: Function, args?: any[]) {
    super();
    this.text = text;
    this.function = event;
    this.args = args || [];
  }
}
