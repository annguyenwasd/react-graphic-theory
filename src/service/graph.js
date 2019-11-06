import { graphType } from 'const';

function toMatrix(verties, edges) {
  if (!edges.length) return [[]];
  const initArray = (length, initValue) =>
    Array.from({ length }, x => initValue);

  let m = initArray(verties.length, 0);
  m = m.map(() => initArray(verties.length, 0));

  edges.forEach(edge => {
    const u = edge.getU();
    const v = edge.getV();

    const indexU = verties.findIndex(vv => vv.name === u.name);
    const indexV = verties.findIndex(vv => vv.name === v.name);

    switch (edge.getType()) {
      case graphType.UNDIRECTIONAL:
        m[indexU][indexV] += 1;
        m[indexV][indexU] += 1;
        break;
      case graphType.DIRECTIONAL:
      case graphType.LOOP:
        m[indexU][indexV] += 1;
        break;
      default:
        break;
    }
  });

  return m;
}

function toDegree(verties, edges) {
  if (!edges.length) return {};
  const m = toMatrix(verties, edges);
  return m.reduce(
    (result, degrees, index) => ({
      ...result,
      [verties[index].name]: degrees.reduce((sum, next) => sum + next, 0)
    }),
    {}
  );
}

export { toMatrix, toDegree };
