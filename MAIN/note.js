// Note class

class Note {
  constructor(id, x, y, a, b) {
    // This code runs once when an instance is created.
    this.x = x;
    this.y = y;
    this.a = a;
    this.b = b;
    this.id = id;
    score.textFont(notation,80);
  }

  show() {
    // This code runs once when myFrog.show() is called.
    score.text('0', this.x, this.y);
  }
}