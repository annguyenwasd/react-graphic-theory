import { graphType, colors } from 'const';

export default class Edge {
  constructor(u, v, type = graphType.UNDIRECTIONAL, sketch) {
    this.sketch = sketch;
    this.u = u;
    this.v = v;
    this.type = type;

    this.uv = this.sketch.createVector(this.u.getX(), this.u.getY());
    this.vv = this.sketch.createVector(this.v.getX(), this.v.getY());
  }

  render() {
    this.sketch.push();
    this.sketch.stroke(255);
    this.sketch.strokeWeight(2);
    switch (this.type) {
      case graphType.UNDIRECTIONAL:
        this.drawEdge();
        break;
      case graphType.DIRECTIONAL:
        this.drawEdge();
        this.drawArrow();
        break;
      case graphType.LOOP:
        this.sketch.noFill();
        this.sketch.circle(this.u.getX() + 10, this.u.getY(), 20);
        break;
      default:
        break;
    }
    this.sketch.pop();
  }

  drawEdge() {
    this.sketch.line(
      this.u.getX(),
      this.u.getY(),
      this.v.getX(),
      this.v.getY()
    );
  }

  getU() {
    return this.u;
  }

  getV() {
    return this.v;
  }

  getType() {
    return this.type;
  }

  contains(vertex) {
    return this.u === vertex || this.v === vertex;
  }

  drawArrow() {
    let arrowSize = 7;
    console.log(this.uv);
    console.log(this.vv);

    this.sketch.push();
    this.sketch.stroke(colors.white);
    this.sketch.strokeWeight(3);
    this.sketch.fill(colors.white);

    this.sketch.translate(this.u.getX(), this.u.getY());

    this.debugDrawAxis('red');

    console.log(this.v.name, this.vv.heading());
    this.sketch.rotate(this.vv.heading());

    this.debugDrawAxis('blue');
    // const d = this.sketch.dist(this.uv.x, this.uv.y, this.vv.x, this.vv.y);
    // this.sketch.translate(d, 0);
    // this.sketch.triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
    this.sketch.pop();
  }

  debugDrawAxis(color = 'green') {
    this.sketch.push();

    this.sketch.stroke(color);
    this.sketch.strokeWeight(2);
    this.sketch.line(0, 0, 150, 0);
    this.sketch.line(0, 0, 0, 150);

    this.sketch.pop();
  }
}
