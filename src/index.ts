/**
 * Implementation of the Push Force Scan (PFS) algorithm
 *
 * Kazuo Misue, Peter Eades, Wei Lai, Kozo Sugiyama,
 * Layout Adjustment and the Mental Map,
 * Journal of Visual Languages & Computing,
 * Volume 6, Issue 2,
 * 1995,
 * Pages 183-210,
 * ISSN 1045-926X,
 * https://doi.org/10.1006/jvlc.1995.1010.
 * (http://www.sciencedirect.com/science/article/pii/S1045926X85710105)
 */

import _ from 'lodash';
import type { Algorithm } from 'agora-graph';
import {
  overlap,
  optimalVector,
  vector,
  diff,
  Node,
  createFunction,
} from 'agora-graph';

/**
 * Executes the Push Force Scan (PFS) algorithm for this graph
 *
 * @param {Graph} graph the graph to update
 * @param {object} [options] options to pass to the algorith
 * @param {number} options.padding padding to add between nodes
 *
 * @returns {Result} the updated graph
 */
export const pfs = createFunction(function (
  graph,
  options: { padding: number } = { padding: 0 }
) {
  _.forEach(graph.nodes, (n) => {
    n.up = { x: n.x, y: n.y };
  });

  graph.nodes.sort((a, b) => a.x - b.x);
  scanX(graph.nodes, options.padding);

  graph.nodes.sort((a, b) => a.y - b.y);
  scanY(graph.nodes, options.padding);

  _.forEach(graph.nodes, (n) => {
    if (n.up === undefined)
      throw 'cannot update undefined updated position for' + n;
    n.x = n.up.x;
    n.y = n.up.y;
    delete n.up; // PERF : maybe heavy cost
  });

  return { graph: graph };
});

export const PFSAlgorithm: Algorithm<{ padding: number }> = {
  name: 'PFS',
  algorithm: pfs,
};

export default PFSAlgorithm;

/**
 * Scans and updates the list of nodes accordingly on the x axis
 * @param {Node[]} nodes The list of nodes
 * @param {number} [padding] the padding
 */
function scanX(nodes: Node[], padding: number) {
  let i = 0;

  while (i < nodes.length - 1) {
    const k = same(nodes, i, (n1, n2) => n1.x === n2.x);

    let maxDelta = 0;

    for (let m = i; m <= k; m++) {
      for (let j = k + 1; j < nodes.length; j++) {
        const move = delta(nodes[m], nodes[j], padding).x;

        if (Math.abs(move) > Math.abs(maxDelta)) {
          maxDelta = move;
        }
      }
    }

    for (let j = k + 1; j < nodes.length; j++) {
      const node = nodes[j];
      if (node.up === undefined)
        throw 'cannot update undefined updated position for' + node;
      node.up.x = node.up.x + maxDelta;
    }

    i = k + 1;
  }
}

/**
 * Scans and updates the list of nodes accordingly on the x axis
 * @param {Node[]} nodes The list of nodes
 * @param {number} [padding] the padding
 */
function scanY(nodes: Node[], padding: number) {
  let i = 0;
  while (i < nodes.length - 1) {
    const k = same(nodes, i, (n1, n2) => n1.y === n2.y);

    let maxDelta = 0;
    for (let m = i; m <= k; m++) {
      for (let j = k + 1; j < nodes.length; j++) {
        const move = delta(nodes[m], nodes[j], padding).y;

        if (Math.abs(move) > Math.abs(maxDelta)) {
          maxDelta = move;
        }
      }
    }

    for (let j = k + 1; j < nodes.length; j++) {
      const node = nodes[j];
      if (node.up === undefined)
        throw 'cannot update undefined updated position for' + node;
      node.up.y = node.up.y + maxDelta;
    }

    i = k + 1;
  }
}

/**
 * Checks the last index having being the same, based on the callback
 * @param {Node[]} nodes list of nodes
 * @param {number} index index to check if same
 * @param {{(n1: Node, n2: Node)=> boolean}} callback
 */
function same(
  nodes: Node[],
  index: number,
  callback: { (n1: Node, n2: Node): boolean }
) {
  let k = index;
  while (k < nodes.length - 1) {
    if (!callback(nodes[index], nodes[k + 1])) return k;
    k++;
  }

  return k;
}

/**
 * Computes the delta between two nodes, if the nodes are not overlapping, returns 0
 *
 * @param {Node} node1 the first node
 * @param {Node} node2 The second node
 * @param {number} [padding=0] The padding
 *
 * @returns {{x: number, y:number}} 0 if no overlap, a value otherwise
 */
function delta(
  node1: Node,
  node2: Node,
  padding: number = 0
): { x: number; y: number } {
  if (!overlap(node1, node2, { padding })) return { x: 0, y: 0 };

  return diff(optimalVector(node1, node2, padding), vector(node1, node2));
}
