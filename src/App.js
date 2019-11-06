import React, { useEffect, useRef, useState } from 'react';
import p5 from 'p5';
import sketch from 'p5-ish/sketch';
import { tools } from 'const';

function App() {
  const canvasContainer = useRef(null);
  const [canvas, setCanvas] = useState({});

  useEffect(() => {
    const c = new p5(sketch, canvasContainer.current);
    setCanvas(c);
  }, []);
  return (
    <div>
      <button onClick={() => canvas.setTool(tools.VERTEX)}>vertex</button>
      <button onClick={() => canvas.setTool(tools.UNDIRECTIONAL)}>
        undirectional
      </button>
      <button onClick={() => canvas.setTool(tools.DIRECTIONAL)}>
        directional
      </button>
      <button onClick={() => canvas.setTool(tools.LOOP)}>loop</button>
      <div ref={canvasContainer}></div>
    </div>
  );
}

export default App;
