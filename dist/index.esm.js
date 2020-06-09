import _ from 'lodash';
import { createFunction, overlap, diff, optimalVector, vector } from 'agora-graph';

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
/**
 * Executes the Push Force Scan (PFS) algorithm for this graph
 *
 * @param {Graph} graph the graph to update
 * @param {object} [options] options to pass to the algorith
 * @param {number} options.padding padding to add between nodes
 *
 * @returns {Result} the updated graph
 */

var pfs = createFunction(function (graph) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
    padding: 0
  };

  _.forEach(graph.nodes, function (n) {
    n.up = {
      x: n.x,
      y: n.y
    };
  });

  graph.nodes.sort(function (a, b) {
    return a.x - b.x;
  });
  scanX(graph.nodes, options.padding);
  graph.nodes.sort(function (a, b) {
    return a.y - b.y;
  });
  scanY(graph.nodes, options.padding);

  _.forEach(graph.nodes, function (n) {
    if (n.up === undefined) throw 'cannot update undefined updated position for' + n;
    n.x = n.up.x;
    n.y = n.up.y;
    delete n.up; // PERF : maybe heavy cost
  });

  return {
    graph: graph
  };
});
var PFSAlgorithm = {
  name: 'PFS',
  algorithm: pfs
};
/**
 * Scans and updates the list of nodes accordingly on the x axis
 * @param {Node[]} nodes The list of nodes
 * @param {number} [padding] the padding
 */

function scanX(nodes, padding) {
  var i = 0;

  while (i < nodes.length - 1) {
    var k = same(nodes, i, function (n1, n2) {
      return n1.x === n2.x;
    });
    var maxDelta = 0;

    for (var m = i; m <= k; m++) {
      for (var j = k + 1; j < nodes.length; j++) {
        var move = delta(nodes[m], nodes[j], padding).x;

        if (Math.abs(move) > Math.abs(maxDelta)) {
          maxDelta = move;
        }
      }
    }

    for (var _j = k + 1; _j < nodes.length; _j++) {
      var node = nodes[_j];
      if (node.up === undefined) throw 'cannot update undefined updated position for' + node;
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


function scanY(nodes, padding) {
  var i = 0;

  while (i < nodes.length - 1) {
    var k = same(nodes, i, function (n1, n2) {
      return n1.y === n2.y;
    });
    var maxDelta = 0;

    for (var m = i; m <= k; m++) {
      for (var j = k + 1; j < nodes.length; j++) {
        var move = delta(nodes[m], nodes[j], padding).y;

        if (Math.abs(move) > Math.abs(maxDelta)) {
          maxDelta = move;
        }
      }
    }

    for (var _j2 = k + 1; _j2 < nodes.length; _j2++) {
      var node = nodes[_j2];
      if (node.up === undefined) throw 'cannot update undefined updated position for' + node;
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


function same(nodes, index, callback) {
  var k = index;

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


function delta(node1, node2) {
  var padding = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  if (!overlap(node1, node2, {
    padding: padding
  })) return {
    x: 0,
    y: 0
  };
  return diff(optimalVector(node1, node2, padding), vector(node1, node2));
}

export default PFSAlgorithm;
export { PFSAlgorithm, pfs };
