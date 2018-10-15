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
import { Graph } from 'agora-graph';
import { Result } from 'agora-algorithm';
export default pfs;
/**
 * Executes the Push Force Scan (PFS) algorithm for this graph
 *
 * @param {Graph} graph the graph to update
 * @param {object} [options] options to pass to the algorith
 * @param {number} options.padding padding to add between nodes
 *
 * @returns {Result} the updated graph
 */
export declare function pfs(graph: Graph, options?: {
    padding: number;
}): Result;
