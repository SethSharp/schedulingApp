export class Session {
  constructor(
    public title: string = '',
    public start: Date = new Date,
    public end: Date = new Date,
    public category: string = 'Blank',
    public colour: string = 'red'
  ) {
  }

  setStart(s: Date) {
    this.start = s
  }

  setEnd(e: Date) {
    this.end = e
  }

  setCategory(n: string) {
    this.category = n;
  }

  getCategory() {
    return this.category;
  }

}
