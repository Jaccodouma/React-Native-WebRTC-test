const io = require("socket.io-client");
const ioreq = require("socket.io-request");

class SocketConnection {
    private static instance: SocketConnection;

    private _socket;
    // Allows you to say SocketConnection.socket instead of this whole thang
    static socket = SocketConnection.getInstance()._socket;

    private constructor() {
        console.log("Instantiating SocketConnection...");
        this._socket = io('http://192.168.0.191:3000');

        this._socket.on('connect', () => {
            // console.log("Connected to server as " + this._socket.id);
            console.log("Connected to server");
        });

        // this._socket.on('message', (data: any) => {
        //     console.log(data);
        // });
    }

    // In case the instance of the socket is needed
    static getInstance(): SocketConnection {
        if (!SocketConnection.instance) {
            SocketConnection.instance = new SocketConnection();
        }
        return SocketConnection.instance;
    }

    

    // static login(username: string): Promise<any> {
    //     return ioreq(SocketConnection.socket).request('login', username)
    // }

    // // Set username
    // static setUsername(username: string): void {
    //     SocketConnection.socket.emit('user/setUsername', username)
    // }

    // // Send a message
    // static sendMessage(message: any): void {
    //     SocketConnection.socket.emit('message/send', message);
    // }

    // /**
    //  * Get all available chats
    //  * 
    //  * rn it should just return all available clients
    //  */
    // static getChats(): any {
    //     const chats = SocketConnection.socket.emit('chats/');
    //     return chats;
    // }
}

export default SocketConnection;