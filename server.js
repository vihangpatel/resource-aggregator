const express = require("express")
const app = express()
const bodyParser = require("body-parser")

const { groupBy, CSPAggregator } = require("./utils")

app.use(bodyParser())

const cspAggregator = new CSPAggregator()

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
})

app.listen(12121, () => console.log("Server is running on port number 12121"))
