import React from "react"

class Report extends React.Component {
	constructor() {
		super()

		this.state = {}
	}

	render() {
		const { state } = this
		const { data } = this.props
		const keys = Object.keys(data)

		return (
			<html>
				<head />
				<body>
					<h1>Report</h1>
					<table style={{ border: "1px solid black", "border-collapse": "collapse" }}>
						<thead>
							<th style={{ border: "1px solid" }}>Key</th>
							<th style={{ border: "1px solid" }}>Resources</th>
						</thead>
						<tbody>
							{keys.map(key => (
								<tr style={{ border: "1px solid" }}>
									<td style={{ border: "1px solid" }}>{key}</td>
									<td style={{ border: "1px solid" }}>
										{data[key].map(item => (
											<div>{item}</div>
										))}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</body>
			</html>
		)
	}
}

export default Report
