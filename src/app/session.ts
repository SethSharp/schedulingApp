
export class Session {
  private categories = { 'Food': '#00fff3', 'Study': '#09ff00', 'Work': '#ff6c00', 'Other': '#4800ff' }
  constructor(
    public title: string,
    public start: number,
    public len: number,
    public category: string = 'Blank',
    public colour: string = 'red'
  ) {
    this.colour = this.getColour()
  }

  setCategory(n: string) {
    this.category = n;
  }

  getCategory() {
    return this.category;
  }

  getCats() {
    return this.categories
  }

  getColour() {
    switch (this.category) {
      case "Work":
        return this.categories["Work"]
      case "Food":
        return this.categories["Food"]
      case "Study":
        return this.categories["Study"]
      default:
        return this.colour
        break;
    }
  }
}
