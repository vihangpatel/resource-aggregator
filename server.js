import express from "express"
import bodyParser from "body-parser"
import { groupBy, CSPAggregator } from "./utils"
import ReactDOMServer from "react-dom/server"
import Report from "./Report"
import React from "react"
import prefilledData from "./hydrate"
import Socket from "./socket"

const app = express()
const socket = new Socket(app)

app.use(bodyParser({ limit: "50mb" }))

const cspAggregator = new CSPAggregator(prefilledData)

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*")
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-  With, Content-Type, Accept")
	next()
})

app.post("/post-assets", (req, res) => {
	const entries = req.body
	const groupedResult = groupBy(entries)
	cspAggregator.addResult(groupedResult)
	res.send(cspAggregator.result)
	socket.emitEvent()
})

app.get("/", (req, res) => {
	res.set("Content-Type", "text/html")
	const response = ReactDOMServer.renderToString(
		<Report data={cspAggregator.getStats()} config={cspAggregator.getConfig()} meta={cspAggregator.getMetaTag()} />
	)

	res.send(response)
})

app.listen(12121, () => console.log("Server is running on port number 12121"))
