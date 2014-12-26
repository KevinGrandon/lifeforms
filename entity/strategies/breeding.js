/**
 * Reproduces without a mate.
 */
exports.asexual = function() {
	if (this.currentFuel > this.requiredFuelToSpawn) {
		this.world.spawnNear(this);
		this.currentFuel = 0;
	}
};
