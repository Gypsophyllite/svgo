'use strict';

const { querySelectorAll, detachNodeFromParent } = require('../lib/xast.js');

exports.name = 'removeElementsBySelector';
exports.description = 'removes elements that match a css selector';

/**

 * @author Gypsophyllite
 *
 * @type {import('./plugins-types.js').Plugin<'removeElementsBySelector'>}
 */
exports.fn = (root, params) => {
  const selectors = Array.isArray(params.selectors)
    ? params.selectors
    : [params];

  return {
    element: {
      enter: (node, parentNode) => {
        for (const { selector } of selectors) {
          const nodes = querySelectorAll(root, selector);
          for (const n of nodes) {
            if (n.type === 'element' && n === node) {
              detachNodeFromParent(node, parentNode);
            }
          }
        }
      },
    },
  };
};
