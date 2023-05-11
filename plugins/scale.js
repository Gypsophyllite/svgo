'use strict';

// const { fstat, writeFileSync } = require('fs');
const { stringifyPathData } = require('../lib/path.js');
const { querySelectorAll } = require('../lib/xast.js');
const { path2js } = require('./_path.js');

exports.name = 'scale';
exports.description = 'scale svg';

/**
 * @author Gypsophyllite
 *
 * @type {import('./plugins-types.js').Plugin<'scale'>}
 */
exports.fn = (root, params) => {
  const size = params.size || 1024;

  let scaleFactor = 1;

  let pathCount = 0;

  let scaledCount = 0;

  return {
    element: {
      enter: (node, parentNode) => {
        if (
          node.name === 'svg' &&
          parentNode.type === 'root' &&
          node.attributes.viewBox !== `0 0 ${size} ${size}` &&
          node.attributes.width !== '1em'
        ) {
          //   console.log(node.attributes, size);

          pathCount = querySelectorAll(root, 'path').length;

          scaleFactor =
            size /
            Math.max(
              Number(node.attributes.width) || 0,
              Number(node.attributes.height) || 0
            );

          node.attributes.viewBox = `0 0 ${size} ${size}`;
          node.attributes.width = '1em';
          node.attributes.height = '1em';
        }

        if (node.name === 'path' && scaledCount < pathCount) {
          const pathJS = path2js(node);
          // writeFileSync('before.json', JSON.stringify(n))
          pathJS.forEach((item) => {
            if (Array.isArray(item.args)) {
              if (item.command === 'A' || item.command === 'a') {
                item.args = item.args.map((a, index) =>
                  a === 1 && [2, 3, 4].includes(index) ? 1 : a * scaleFactor
                );
              } else {
                item.args = item.args.map((a) => a * scaleFactor);
              }
            }

            // if (Array.isArray(item.base)) {
            //     item.base = item.base.map(b => b * scaleFactor)
            // }

            // if (Array.isArray(item.coords)) {
            //     item.coords = item.coords.map(c => c * scaleFactor)
            // }

            // if (Array.isArray(item.sdata)) {
            //     item.sdata = item.sdata.map(s => s * scaleFactor)
            // }
          });

          if (node.attributes.stroke) {
            node.attributes['stroke-width'] = (
              Number(node.attributes['stroke-width'] || 1) * scaleFactor
            ).toString();
          }

          node.attributes.d = stringifyPathData({
            pathData: pathJS,
            precision: 3,
          });
          scaledCount++;
          // writeFileSync('after.json', JSON.stringify(n))
        }
      },
    },
  };
};
