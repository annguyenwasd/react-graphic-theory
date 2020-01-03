import { tools, graphType } from 'const';
import Edge from 'p5-ish/edge';
import Vertex from 'p5-ish/vertex';
import { colors } from 'const';

export default function(sketch) {
  let vCount = 0;
  let verties = [];
  let edges = [];
  let selectedVerties = [];
  let tool = null;
  let dragging = false;

  /** s short for sketch */
  sketch.setup = function() {
    sketch.createCanvas(sketch.windowWidth, sketch.windowHeight);

    // add random verties
    for (let i = 0; i < 10; i++) {
      verties.push(
        new Vertex(
          sketch.random(0, 500),
          sketch.random(0, 600),
          `v${vCount++}`,
          sketch
        )
      );
    }
  };

  sketch.draw = function() {
    sketch.push();
    sketch.background(51);
    verties.forEach(vertex => vertex.render());
    edges.forEach(edge => edge.render());
    renderToolCursor();
    if (!dragging && !tool) {
      sketch.cursor(verties.some(v => v.intersect()) ? 'grab' : sketch.ARROW);
    }
    sketch.pop();
  };

  sketch.mousePressed = function() {
    handleVertexClick();
    handleToolAction();
  };

  sketch.mouseDragged = function() {
    const canDragVertex = !tool && selectedVerties[0];
    dragging = true;
    if (canDragVertex) {
      sketch.cursor('grabbing');
      selectedVerties[0].move();
    }
  };

  sketch.mouseReleased = function() {
    dragging = false;
    const v = selectedVerties[0];
    const canReleaseVertex = !tool && v;
    if (canReleaseVertex) {
      v.stop();
      v.setActive(false);
      selectedVerties.length = 0;
    }
  };

  sketch.keyPressed = function() {
    handleDeleteVertex();
    handleDeselectTool();
    handleDeselectVerties();
  };

  function renderToolCursor() {
    if (dragging || !tool) return;
    sketch.push();
    switch (tool) {
      case tools.VERTEX:
        sketch.noFill();
        sketch.stroke(255);
        sketch.strokeWeight(10);
        sketch.point(sketch.mouseX, sketch.mouseY);
        sketch.cursor('copy');
        break;
      case tools.DIRECTIONAL:
        sketch.cursor('se-resize');
        if (selectedVerties.length === 1) {
          drawEdgePlaceholder();
        }
        break;
      case tools.UNDIRECTIONAL:
        sketch.cursor('ew-resize');
        if (selectedVerties.length === 1) {
          drawEdgePlaceholder();
        }
        break;
      default:
        sketch.cursor(sketch.ARROW);
        break;
    }

    sketch.pop();
  }

  function drawEdgePlaceholder() {
    const v = selectedVerties[0];
    sketch.stroke(255, 255, 255, 200);
    sketch.strokeWeight(3);
    sketch.line(v.getX(), v.getY(), sketch.mouseX, sketch.mouseY);
  }

  function handleVertexClick() {
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
            vertex.setActive(false);
            selectedVerties = selectedVerties.filter(v => v.name !== vertex);
          }
        }
      })
    );
  }

  function handleToolAction() {
    switch (tool) {
      case tools.VERTEX:
        verties.push(
          new Vertex(sketch.mouseX, sketch.mouseY, `v${vCount++}`, sketch)
        );
        break;
      case tools.DIRECTIONAL:
        createLineEdge(graphType.DIRECTIONAL);
        break;
      case tools.UNDIRECTIONAL:
        createLineEdge(graphType.UNDIRECTIONAL);
        break;
      case tools.LOOP:
        createLoopEdge();
        break;
      default:
        break;
    }
  }

  function createLineEdge(type) {
    if (selectedVerties.length === 2) {
      edges.push(
        new Edge(selectedVerties[0], selectedVerties[1], type, sketch)
      );
      selectedVerties.forEach(point => point.setActive(false));
      // empty after create Edge
      selectedVerties.length = 0;
    }
  }

  function createLoopEdge() {
    if (selectedVerties.length === 1) {
      edges.push(
        new Edge(selectedVerties[0], selectedVerties[0], graphType.LOOP, sketch)
      );
      selectedVerties.length = 0;
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

  function handleDeselectVerties() {
    if (sketch.keyCode === sketch.ESCAPE) {
      verties.forEach(v => v.setActive(false));
      selectedVerties.length = 0;
    }
  }

  ////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////
  // interact with react from here
  ////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////

  sketch.setTool = tooName => {
    tool = tooName;
    selectedVerties.length = 0;
  };
}
