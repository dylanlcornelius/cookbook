export class Validation {
  text: string;
  function: (...args: any[]) => any;
  args: any[];

  constructor(text: string, event: (...args: any[]) => any, args?: any[]) {
    this.text = text;
    this.function = event;
    this.args = args || [];
  }
}
