export class Receiver {
	#id = 0;
	#listeners = {};

	constructor() {
		window.addEventListener("message", (message) => {
			const { event, data } = JSON.parse(message.data);
			this.#listeners[event].forEach(({ callback }) => {
				callback(data);
			});
		});
	}

	on(event, callback) {
		if (!this.listeners[event]) {
			this.listeners[event] = [];
		}

		this.#id++;
		this.#listeners[event].push({
			id: this.#id,
			callback,
		});

		return `${event}#${this.#id}`;
	}

	off(id) {
		const [event, listenerId] = id.split("#");
		this.#listeners[event] = this.#listeners[event].filter(
			({ id }) => id !== listenerId
		);
	}
}
