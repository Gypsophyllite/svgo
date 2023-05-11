let svg = document.querySelector('svg');
let stroke = svg.querySelector('#stroke');
let strokeWidth = stroke.getStrokeWidth();
let dashArray = stroke.getStrokeDasharray();

let path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
svg.appendChild(path);

let startPoint;
for (let i = 0; i < stroke.pathSegList.numberOfItems; i++) {
  let pathSeg = stroke.pathSegList.getItem(i);
  if (pathSeg.pathSegType === 1) {
    //svgPathSegMoveToAbs
    startPoint = pathSeg;
    path.setAttribute('d', 'M' + pathSeg.x + ',' + pathSeg.y);
  } else if (pathSeg.pathSegType === 2) {
    //svgPathSegLinetoAbs
    let endPoint = {
      x:
        pathSeg.x +
        dashArray[i % dashArray.length] *
          strokeWidth *
          Math.cos(stroke.getTotalLength()),
      y:
        pathSeg.y +
        dashArray[i % dashArray.length] *
          strokeWidth *
          Math.sin(stroke.getTotalLength()),
    };
    path.setAttribute(
      'd',
      path.getAttribute('d') + 'L' + endPoint.x + ',' + endPoint.y
    );
  }
}
path.setAttribute('d', path.getAttribute('d') + 'Z');
('use strict');

const { querySelectorAll, detachNodeFromParent } = require('../lib/xast.js');

exports.name = 'convertStrokePathToFillPath';
exports.description = 'removes elemnts that match a css selector';

/**

 * @author Gypsophyllite
 *
 * @type {import('./plugins-types.js').Plugin<'convertStrokePathToFillPath'>}
 */
exports.fn = (root, params) => {
  const nodes = querySelectorAll(root, 'path[stroke]');

  console.log(nodes);

  return {
    element: {
      enter: (node, parentNode) => {
        // for (const { selector } of selectors) {
        //   const nodes = querySelectorAll(root, selector);
        //   for (const n of nodes) {
        //     if (n.type === 'element' && n === node) {
        //       detachNodeFromParent(node, parentNode);
        //     }
        //   }
        // }
      },
    },
  };
};
