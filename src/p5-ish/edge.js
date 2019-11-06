import { graphType } from 'const';

export default class Edge {
  constructor(u, v, type = graphType.UNDIRECTIONAL, sketch) {
    this.sketch = sketch;
    this.u = u;
    this.v = v;
    this.type = type;
  }

  render() {
    this.sketch.stroke(255);
    this.sketch.strokeWeight(2);
    switch (this.type) {
      case graphType.UNDIRECTIONAL:
        this.sketch.line(
          this.u.getX(),
          this.u.getY(),
          this.v.getX(),
          this.v.getY()
        );
        break;
      case graphType.DIRECTIONAL:
        break;
      case graphType.LOOP:
        this.sketch.noFill();
        this.sketch.circle(this.u.getX() + 10, this.u.getY(), 20);
        break;
      default:
        break;
    }
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
}
