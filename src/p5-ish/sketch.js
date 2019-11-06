import { tools, graphType } from 'const';
import Edge from 'p5-ish/edge';
import Vertex from 'p5-ish/vertex';

export default function(sketch) {
  let vCount = 0;
  let verties = [];
  let edges = [];
  let selectedVerties = [];
  let tool = null;
  let clickSource = null;

  /** s short for sketch */
  sketch.setup = function() {
    sketch.createCanvas(sketch.windowWidth, sketch.windowHeight);
  };

  sketch.draw = function() {
    sketch.background(51);
    verties.forEach(vertex => vertex.render());
    edges.forEach(edge => edge.render());
    drawVertex();
  };

  sketch.mousePressed = function() {
    onVertiesClick();

    switch (tool) {
      case tools.VERTEX:
        if (!clickSource)
          verties.push(
            new Vertex(sketch.mouseX, sketch.mouseY, `v${vCount++}`, sketch)
          );
        break;
      case tools.UNDIRECTIONAL:
        createUndirectionalEdge();
        break;
      case tools.LOOP:
        createLoopEdge();
        break;
      default:
        break;
    }

    // refresh
    clickSource = null;
  };

  sketch.mouseDragged = function() {
    const canDragVertex = !tool && selectedVerties[0];
    if (canDragVertex) {
      selectedVerties[0].move();
    }
  };

  sketch.mouseReleased = function() {
    const canReleaseVertex = !tool && selectedVerties[0];
    if (canReleaseVertex) {
      selectedVerties[0].stop();
    }
  };

  sketch.keyPressed = function() {
    handleDeleteVertex();
    handleDeselectTool();
  };

  sketch.addVerties = function(amount) {
    Array.from({ length: amount }).forEach(() => {
      verties.push(
        new Vertex(sketch.random(0, 500), sketch.random(0, 500), 'abc', sketch)
      );
    });
  };

  function drawVertex() {
    if (tool === tools.VERTEX) {
      sketch.noFill();
      sketch.stroke(255);
      sketch.circle(sketch.mouseX, sketch.mouseY, 10);
      sketch.cursor('copy');
    }
  }

  function onVertiesClick() {
    verties.forEach(vertex =>
      vertex.onClick(() => {
        // if no tool selected => select 1 vertex at a time
        if (!tool) {
          // unactive the others first
          selectedVerties.forEach(v => v.setActive(false));
          selectedVerties = [vertex];
        } else {
          if (!selectedVerties.includes(vertex)) {
            selectedVerties.push(vertex);
          } else {
            const index = selectedVerties.findIndex(
              v => v.x === vertex.x && v.y === vertex.y
            );
            vertex.setActive(false);
            selectedVerties.splice(index, 1);
          }
        }
      })
    );
  }

  function createUndirectionalEdge() {
    if (selectedVerties.length === 2) {
      edges.push(
        new Edge(
          selectedVerties[0],
          selectedVerties[1],
          graphType.UNDIRECTIONAL,
          sketch
        )
      );
      selectedVerties.forEach(point => point.setActive(false));
      // empty after create Edge
      selectedVerties = [];
    }
  }

  function createLoopEdge() {
    if (selectedVerties.length === 1) {
      edges.push(
        new Edge(selectedVerties[0], selectedVerties[0], graphType.LOOP, sketch)
      );
      selectedVerties = [];
    }
  }

  function handleDeleteVertex() {
    const noToolSelected = !tool;
    const oneVertexSelected = selectedVerties.length === 1;
    const v = selectedVerties[0];
    const isPressedDeleteKey =
      sketch.keyCode === sketch.DELETE || sketch.keyCode === sketch.BACKSPACE;
    if (noToolSelected && oneVertexSelected && isPressedDeleteKey) {
      edges = edges.filter(e => e.getU() !== v && e.getV() !== v);
      verties = verties.filter(vertex => vertex.name !== v.name);
    }
  }

  function handleDeselectTool() {
    if (sketch.keyCode === sketch.ESCAPE) {
      tool = null;
    }
  }

  ////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////
  // interact with react from here
  ////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////

  sketch.setTool = tooName => (tool = tooName);
}
