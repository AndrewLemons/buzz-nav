export default class ComplexMath {
	/**
	 * @param {number} x1 
	 * @param {number} y1 
	 * @param {number} x2 
	 * @param {number} y2
	 */
	static pythagoreanDistance(x1, y1, x2, y2) {
		return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
	}

	/**
	 * @param {number} lat1 
	 * @param {number} lon1 
	 * @param {number} lat2 
	 * @param {number} lon2
	 */
	static haversineDistance(lat1, lon1, lat2, lon2) {
		let dLat = this.degToRad(lat2 - lat1);
		let dLon = this.degToRad(lon2 - lon1);
		lat1 = this.degToRad(lat1);
		lat2 = this.degToRad(lat2);

		let a =
			Math.sin(dLat / 2) * Math.sin(dLat / 2) +
			Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
		let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		let d = this.EARTH_RADIUS * c;

		return d;
	}

	/**
	 * @param {number} deg
	 */
	static degToRad(deg) {
		return deg * (Math.PI / 180);
	}

	static EARTH_RADIUS = 6_378_100;
}
