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
				<head />
				<body>
					<h1>Report</h1>
					<textarea rows="100" cols="50">
						{JSON.stringify(config, "\t", 4)}
					</textarea>
					<textarea rows="10" cols="50">
						{meta}
					</textarea>
				</body>
			</html>
		)
	}
}

export default Report
