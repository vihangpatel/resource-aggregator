var requestPoster = () => {
	var xmlhttp = new XMLHttpRequest() // new HttpRequest instance
	xmlhttp.open("POST", "http://localhost:12121/post-assets")
	xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8")
	xmlhttp.send(JSON.stringify(performance.getEntries()))
}
requestPoster()
