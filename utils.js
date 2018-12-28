const groupBy = entries =>
	entries.reduce((a, b) => {
		a[b.initiatorType] || (a[b.initiatorType] = {})
		a[b.initiatorType][b.name] = b.name

		return a
	}, {})

class CSPAggregator {
	constructor() {
		this.result = {}
	}

	addResult(addOn) {
		if (Object.keys(this.result).length === 0) {
			this.result = { ...addOn }
		}

		for (const key in this.result) {
			this.result[key] = { ...this.result[key], ...addOn[key] }
		}

		if (Object.keys(this.result).length === 0) {
			this.result = { ...addOn }
		}
	}
}

module.exports = {
	groupBy,
	CSPAggregator,
}
