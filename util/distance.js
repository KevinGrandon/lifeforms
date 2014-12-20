/**
 * Gets the distance of two points.
 */
module.exports = function(pos1, pos2) {
	var xs = 0;
	var ys = 0;
	 
	xs = pos2[0] - pos1[0];
	xs = xs * xs;
	 
	ys = pos2[1] - pos1[1];
	ys = ys * ys;

	return Math.sqrt(xs + ys);
};
