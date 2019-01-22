import React from "react"

class Report extends React.Component {
	constructor() {
		super()

		this.state = {}
	}

	getTag() {
		const { data } = this.props
	}

	renderTable() {
		const { data, config } = this.props
		const keys = Object.keys(data)
		return (
			<table style={{ border: "1px solid black", "border-collapse": "collapse" }}>
				<thead>
					<th style={{ border: "1px solid" }}>Key</th>
					<th style={{ border: "1px solid" }}>Resources</th>
				</thead>
				<tbody>
					{keys.map(key => (
						<tr key={key} style={{ border: "1px solid" }}>
							<td style={{ border: "1px solid" }}>{key}</td>
							<td style={{ border: "1px solid" }}>
								{data[key].map(item => (
									<div key={item}>{item}</div>
								))}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		)
	}

	render() {
		const { config, meta } = this.props

		return (
			<html>
				<head>
					<title> CSP Collector</title>
				</head>
				<body>
					<h1>CSP config(Node middleware) & meta tag(PHP)</h1>
					<div style={{}}>
						<div style={{ float: "left", padding: "20px" }}>
							<h2>Paste in Node middleware config</h2>
							<textarea rows="100" cols="50" defaultValue={JSON.stringify(config, "\t", 4)} />
						</div>
						<div style={{ float: "right", padding: "20px" }}>
							<h2>Paste in PHP site</h2>
							<textarea rows="10" cols="50" defaultValue={meta} />
						</div>
					</div>
				</body>
			</html>
		)
	}
}

export default Report
