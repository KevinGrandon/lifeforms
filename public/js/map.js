(function() {

	var socket = io();

	var ctx = document.getElementById('map').getContext('2d');

	var entitiesById = {};

	var entitiesByXY = {}

	/**
	 * A list of invalidations to perform at every draw step.
	 * This is an array of arrays which contain:
	 * - [[xPosition, yPosition], rectSize]
	 */
	var positionsInvalidations = [];

	var _lastFillStyle = null;

	function drawEntities() {
		// First handle invalidations
		for (var i = positionsInvalidations.length - 1; i >= 0; i--) {
			var xy = positionsInvalidations[i][0];
			var size = positionsInvalidations[i][1];

			// Clear the rect first.
			ctx.clearRect(xy[0], xy[1], size, size);

			// Draw all aprticles within the square.
			// If we have a entity, draw it, otherwise clear the rect.
			for(var innerX = xy[0]; innerX < xy[0] + size; innerX++) {
				for(var innerY = xy[1]; innerY < xy[1] + size; innerY++) {
					if (entitiesByXY[innerX] && entitiesByXY[innerX][innerY] && entitiesByXY[innerX][innerY].length) {
						var existingEntity = entitiesByXY[innerX][innerY][0];
						if (_lastFillStyle !== existingEntity.color) {
							ctx.fillStyle = existingEntity.color;
							_lastFillStyle = existingEntity.color;
						}
						var size = existingEntity.config.size;
						ctx.fillRect(innerX, innerY, size, size);
					}
				}
			}
		}

		positionsInvalidations = [];
	}

	function cacheEntityPosition(xy, entity) {
		entitiesByXY[xy[0]] = entitiesByXY[xy[0]] || {};
		entitiesByXY[xy[0]][xy[1]] = entitiesByXY[xy[0]][xy[1]] || [];
		entitiesByXY[xy[0]][xy[1]].push(entity);
	}

	function removeIdFromXYMap(id, xy) {
		if (!entitiesByXY[xy[0]] || !entitiesByXY[xy[0]][xy[1]]) {
			return;
		}
		var allEntitiesAtStack = entitiesByXY[xy[0]][xy[1]];
		for (var i = allEntitiesAtStack.length - 1; i >= 0; i--) {
			if (allEntitiesAtStack[i].config.id === id) {
				entitiesByXY[xy[0]][xy[1]].splice(i, 1);
				return;
			}
		}
	}

	/**
	 * Handles an entity update.
	 */
	function handleUpdate(update) {
		positionsInvalidations.push([update.position, update.size]);

		switch(update.action) {
			case 'created':
				// If it's created already, return.
				if (entitiesById[update.id]) {
					return;
				}
				entitiesById[update.id] = new Entity(update);
				cacheEntityPosition(update.position, entitiesById[update.id]);
				break;
			case 'moved':
				// If we don't have the entity, we can create it.
				if (!entitiesById[update.id]) {
					update.action = 'created';
					handleUpdate(update);
					return;
				}
				var oldPosition = entitiesById[update.id].position;

				// Also move the new position to the invalidation map.
				positionsInvalidations.push([oldPosition, entitiesById[update.id].config.size]);

				// Remove old entires from the entitiesByXY map.
				removeIdFromXYMap(update.id, oldPosition);

				// Now move the entity
				entitiesById[update.id].move(update.position);
				cacheEntityPosition(update.position, entitiesById[update.id]);
				break;
			case 'removed':
				if (!entitiesById[update.id]) {
					return;
				}

				delete entitiesById[update.id];
				// Remove old entires from the entitiesByXY map.
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
			drawEntities();
		};
		oReq.open('get', '/entities/current', true);
		oReq.send();
	}
	getCurrentState();

	// And handle updates:
	socket.on('update', function(msg) {
		handleUpdate(msg);
		drawEntities();
	});

}());
