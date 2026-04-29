// This is a local in-memory store that mimics Redis behavior.
// It is high-performance and requires no external services.

const memoryStore = new Map();

export const redis = {
	// Mimics redis.get()
	get: async (key) => {
		const item = memoryStore.get(key);
		if (!item) return null;

		// Check if the item has expired
		if (item.expiry && Date.now() > item.expiry) {
			memoryStore.delete(key);
			return null;
		}
		return item.value;
	},

	// Mimics redis.set(key, value, "EX", seconds)
	set: async (key, value, mode, duration) => {
		const expiry = duration ? Date.now() + duration * 1000 : null;
		memoryStore.set(key, { value, expiry });
	},

	// Mimics redis.del()
	del: async (key) => {
		memoryStore.delete(key);
	},
};