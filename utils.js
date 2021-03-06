const groupBy = entries =>
	entries.reduce((a, b) => {
		const type = getResourceType(b)
		a[type] || (a[type] = {})
		a[type][b.name] = b.name

		return a
	}, {})

const getResourceType = resource => {
	switch (true) {
		case resource.initiatorType === "iframe":
			return "iframe"
		case resource.name.indexOf(".js") > -1 || resource.initiatorType === "script":
			return "script"
		case resource.name.indexOf(".css") > -1:
			return "link"
		case /.(svg|png|jpg|jpeg|bmp|gif)/g.exec(resource.name) !== null || resource.initiatorType === "img":
			return "img"
		case /.(ttf|otf|woff|woff2|eot)/g.exec(resource.name) !== null:
			return "css"
	}
}
class CSPAggregator {
	constructor(data = {}) {
		this.result = { ...data }
	}

	addResult(addOn) {
		if (Object.keys(this.result).length === 0) {
			this.result = { ...addOn }
		}

		for (const key in this.result) {
			console.log(key, " ", Object.keys(this.result[key]).length)
			this.result[key] = { ...this.result[key], ...addOn[key] }
			console.log(key, " ", Object.keys(this.result[key]).length, "\n\n\n")
		}

		if (Object.keys(this.result).length === 0) {
			this.result = { ...addOn }
		}
	}

	getStats() {
		const REGEX = /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:\.)?([^:\/\n?]+)/gim
		const result = {}
		for (const key in this.result) {
			const keys = Object.keys(this.result[key])
			const domains = keys.reduce((a, b) => {
				const REGEX = /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:\.)?([^:\/\n?]+)/gim
				const match = REGEX.exec(`${b} `)
				const domain = match !== null ? match[1] : ""
				if (domain.length === 0) {
					console.log("failed : ", b, " ", match)
				}
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
			"script-src": ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
			"style-src": ["'unsafe-eval'", "'unsafe-inline'", "'self'"],
			"frame-src": ["'unsafe-inline'", "'self'", "https://tr.snapchat.com"],
			"font-src": ["https://fonts.gstatic.com", "'self'", "data:"],
			"media-src": [
				"https://*.youtube.com",
				"https://t.co/",
				"https://www.facebook.com",
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
				"https://bo.bookmyshow.com",
				"https://cdn.testbms.com",
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

		let output = "\n"

		for (const key in config) {
			output = `${output}${key} ${config[key].join(" ")}; \n`
		}

		return `<meta http-equiv="Content-Security-Policy" content="${output}" />`
	}
}

const getDomainNameFromURL = url => {
	const a = document.createElement("a").a.setAttribute("href", url)
	return a.hostname
}

module.exports = {
	groupBy,
	CSPAggregator,
}
