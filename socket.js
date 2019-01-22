const Server = require("http").Server
const IO = require("socket.io")

class Socket {
	constructor(app) {
		this.server = Server(app)
		this.io = IO(this.server)
		this.server.listen(12123)
	}

	emitEvent() {
		this.io.emit("refresh", { time: Date.now() })
	}
}

export default Socket
