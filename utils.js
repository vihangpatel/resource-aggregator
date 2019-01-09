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
				domain && (a[`https://${domain}`] = `https://${domain}`)
				return a
			}, {})
			result[key] = Object.keys(domains).filter(Boolean)
		}
		return result
	}

	getConfig() {
		const staticMap = {
			script: "script-src",
			img: "img-src",
			css: "font-src",
			link: "style-src",
			iframe: "frame-src",
		}

		const prefilledConfig = {
			"manifest-src": ["'self'"],
			"default-src": ["'self'"],
			"child-src": ["'self'"],
			"connect-src": ["*"], // ["'self'", 'ws:'], for service worker
			"object-src": ["'self'", "data:", "'unsafe-eval'"],
			"script-src": ["'self'"],
			"style-src": ["'unsafe-eval'", "'unsafe-inline'", "'self'"],
			"iframe-src": ["'unsafe-inline'", "'self'"],
			"media-src": [
				"https://*.youtube.com",
				"https://t.co/",
				"https://www.facebook.com/*",
				"https://googleads.g.doubleclick.net/",
				"https://stats.g.doubleclick.net/",
				"https://www.google.com/",
				"https://securepubads.g.doubleclick.net/",
				"https://googleads.g.doubleclick.net",
				"'unsafe-inline'",
				"'self'",
			],
			"img-src": [
				"'unsafe-inline'",
				"'self'",
				// If you use Base64 encoded images (i.e. inlined images), then you will
				// need the following:
				"data:",
			],
		}

		const result = this.getStats()

		for (const key in result) {
			const mappedKey = staticMap[key]
			if (mappedKey && prefilledConfig[mappedKey]) {
				prefilledConfig[mappedKey] = [...prefilledConfig[mappedKey], ...result[key]]
			}
		}

		for (const key in prefilledConfig) {
			prefilledConfig[key] = prefilledConfig[key].sort((a, b) => a.length > b.length)
		}

		return prefilledConfig
	}

	getMetaTag() {
		const config = this.getConfig()

		let output = ""

		for (const key in config) {
			output = `${output}${key} ${config[key].join(" ")};`
		}

		return `<meta http-equiv="Content-Security-Policy" content="${output}" />`
	}
}

module.exports = {
	groupBy,
	CSPAggregator,
}
