export class Item {
  constructor(
    private title: string = '',
    private description: string = ''
  ) {}

  getTitle() { return this.title}

  getDesc() { return this.description}

  editDescription(d:string) { this.description = d }

  editTitle(t:string) { this.title = t}
}
