import { colors } from 'const';

export default class Vertex {
  r = 10;
  isActive = false;
  isDragged = false;

  constructor(x, y, name, sketch) {
    this.sketch = sketch;
    this.x = x;
    this.y = y;
    this.name = name;
  }

  render(needCursor) {
    this.renderName();
    this.renderPoint();
  }

  renderPoint() {
    this.sketch.push();
    this.sketch.stroke(this.isActive ? colors.selected : colors.white);
    this.sketch.strokeWeight(this.r);
    this.sketch.point(this.x, this.y);
    this.sketch.pop();
  }

  renderName() {
    this.sketch.push();
    this.sketch.fill(255);
    this.sketch.textSize(16);
    this.sketch.text(this.name, ...this.getTextPosition());
    this.sketch.pop();
  }

  onClick(cb) {
    if (this.intersect()) {
      this.setActive(!this.isActive);
      cb(this);
    }
  }

  move() {
    if (this.intersect()) {
      this.isDragged = true;
    }

    // Why seperate: if mouse move too fase, they're not intersect with mouse anymore
    if (this.isDragged) {
      this.x = this.sketch.mouseX;
      this.y = this.sketch.mouseY;
    }
  }

  stop() {
    this.isDragged = false;
  }

  setActive(val) {
    this.isActive = val;
  }

  getX() {
    return this.x;
  }

  getY() {
    return this.y;
  }

  intersect(mx = this.sketch.mouseX, my = this.sketch.mouseY) {
    return this.sketch.dist(this.x, this.y, mx, my) <= this.r;
  }

  getTextPosition() {
    const x = this.x > this.sketch.width / 2 ? this.x + 10 : this.x - 25;
    const y = this.y > this.sketch.height / 2 ? this.y + 10 : this.y + 10;

    return [x, y];
  }
}
