const groupBy = entries =>
	entries.reduce((a, b) => {
		a[b.initiatorType] || (a[b.initiatorType] = {})
		a[b.initiatorType][b.name] = b.name

		return a
	}, {})

class CSPAggregator {
	constructor(data = {}) {
		this.result = { ...data }
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

	getStats() {
		const REGEX = /\/\/(.*?)\//g
		const result = {}
		for (const key in this.result) {
			const keys = Object.keys(this.result[key])
			const domains = keys.reduce((a, b) => {
				const match = REGEX.exec(b)
				const domain = match !== null ? match[1] : ""
				domain && (a[domain] = domain)
				return a
			}, {})
			result[key] = Object.keys(domains).filter(Boolean)
		}
		return result
	}
}

module.exports = {
	groupBy,
	CSPAggregator,
}
