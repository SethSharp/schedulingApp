export class Session {
  constructor(
    public title: string = '',
    public start: Date = new Date,
    public end: Date = new Date,
    public category: string = 'Blank',
    public colour: string = 'red'
  ) {
    this.colour = this.getColour()
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

  getColour() {
    let categories = {
      Food: '#00fff3',
      Study: '#09ff00',
      Work: '#ff6c00',
      Other: '#4800ff',
    };
    switch (this.category) {
      case "Work":
        return categories["Work"]
      case "Food":
        return categories["Food"]
      case "Study":
        return categories["Study"]
      default:
        return this.colour
    }
  }
}
