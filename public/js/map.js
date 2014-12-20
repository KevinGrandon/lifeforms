(function() {

	var particlesById = {};

	/**
	 * Handles a particle update.
	 */
	function handleUpdate(update) {
		switch(update.action) {
			case 'created':
				particlesById[update.id] = new ClientParticle[update.name](update);
				break;
			case 'moved':
				particlesById[update.id].move(update.position);
				break;
			case 'removed':
				if (!particlesById[update.id]) {
					return;
				}

				particlesById[update.id].remove();
				delete particlesById[update.id];
				break;
		}
	}

	// Just get particle changes past this timestamp;
	var lastFetch = 0;

	function updateMap() {
		var oReq = new XMLHttpRequest();
		oReq.onload = onResponse;
		oReq.open('get', '/particles/since/' + lastFetch, true);
		oReq.send();
	}

	function onResponse() {
		var resp = JSON.parse(this.responseText);
		lastFetch = resp.lastFetched;

		resp.updates.forEach(handleUpdate)

		setTimeout(updateMap, 500);
	}

	updateMap();

}());
