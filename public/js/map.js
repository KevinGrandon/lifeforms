(function() {

	var socket = io();

	var ctx = document.getElementById('map').getContext('2d');

	var particlesById = {};

	var particlesByXY = {}

	var positionsInvalidations = [];

	var _lastFillStyle = null;

	function drawParticles() {
		// First handle invalidations
		for (var i = positionsInvalidations.length - 1; i >= 0; i--) {
			var xy = positionsInvalidations[i];

			// If we have a particle, draw it, otherwise clear the rect.
			if (particlesByXY[xy[0]] && particlesByXY[xy[0]][xy[1]].length) {				
				var existingParticle = particlesByXY[xy[0]][xy[1]][0];
				if (_lastFillStyle !== existingParticle.color) {
					ctx.fillStyle = existingParticle.color;
					_lastFillStyle = existingParticle.color;
				}
				ctx.fillRect(xy[0], xy[1], 1, 1);
			} else {
				ctx.clearRect(xy[0], xy[1], 1, 1);
			}
		}

		positionsInvalidations = [];
	}

	function cacheParticlePosition(xy, particle) {
		particlesByXY[xy[0]] = particlesByXY[xy[0]] || {};
		particlesByXY[xy[0]][xy[1]] = particlesByXY[xy[0]][xy[1]] || [];
		particlesByXY[xy[0]][xy[1]].push(particle);
	}

	function removeIdFromXYMap(id, xy) {
		if (!particlesByXY[xy[0]] || !particlesByXY[xy[0]][xy[1]]) {
			return;
		}
		var allParticlesAtStack = particlesByXY[xy[0]][xy[1]];
		for (var i = allParticlesAtStack.length - 1; i >= 0; i--) {
			if (allParticlesAtStack[i].config.id === id) {
				particlesByXY[xy[0]][xy[1]].splice(i, 1);
				return;
			}
		}
	}

	/**
	 * Handles a particle update.
	 */
	function handleUpdate(update) {
		positionsInvalidations.push(update.position);

		switch(update.action) {
			case 'created':
				// If it's created already, return.
				if (particlesById[update.id]) {
					return;
				}
				particlesById[update.id] = new ClientParticle[update.name](update);
				cacheParticlePosition(update.position, particlesById[update.id]);
				break;
			case 'moved':
				// If we don't have the particle, we can create it.
				if (!particlesById[update.id]) {
					update.action = 'created';
					handleUpdate(update);
					return;
				}
				var oldPosition = particlesById[update.id].position;

				// Also move the new position to the invalidation map.
				positionsInvalidations.push(oldPosition);

				// Remove old entires from the particlesByXY map.
				removeIdFromXYMap(update.id, oldPosition);

				// Now move the particle
				particlesById[update.id].move(update.position);
				cacheParticlePosition(update.position, particlesById[update.id]);
				break;
			case 'removed':
				if (!particlesById[update.id]) {
					return;
				}

				particlesById[update.id].remove();
				delete particlesById[update.id];
				// Remove old entires from the particlesByXY map.
				removeIdFromXYMap(update.id, update.position);
				break;
		}
	}

	// Get the current state:
	function getCurrentState() {
		var oReq = new XMLHttpRequest();
		oReq.onload = function onResponse() {
			var resp = JSON.parse(this.responseText);
			resp.forEach(handleUpdate)
			drawParticles();
		};
		oReq.open('get', '/particles/current', true);
		oReq.send();
	}
	getCurrentState();

	// And handle updates:
	socket.on('update', function(msg) {
		handleUpdate(msg);
		drawParticles();
	});


}());
