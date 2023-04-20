import {Server, Socket} from "socket.io";
import {User} from "../model/user";
import mongoose from "mongoose"
import {Chat} from "../model/chat";
import {EVENTS, emitEvent, offlineEmitEvent} from "./events";
import { Offline } from "../model/offline";
export let io = null
export let connectedUsers = [];

export const socket = (server) => {

    io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });


    io.on("connection", async (socket) => {

        const Id = socket.handshake.query.Id;
        if (!Id) {
            socket.disconnect(true);
        } else {
            try {
                const user = await isValidUserId(Id);

                if (user !== null) {
                    console.log(`User exists: ${user}`);
                    console.log(`Client has connected${socket.id}`);
                } else {
                    console.log(`User does not exist`);
                    console.log(`Client has disconnected-${socket.id}`);
                    socket.disconnect(true);
                }
            } catch (error) {
                console.error(`Error checking user ID: ${error}`);
            }
        }

        const client = {
            userId: Id,
            clientId: socket.id
        };

        connectedUsers.push(client)
        // io.emit('users', Object.values(connectedUsers));
        console.log(connectedUsers, "connected users")
        await getOfflineEvents(Id)

        socket.on('add_contact', addContact);
        socket.on('send_message', sendMessage);
        socket.on('group_chat', groupChat);
        socket.on('delivered',deliveredMessage);
        socket.on('read',read);
        await getOffLineMessages(Id)
        // await storeOffLineEvents(Id)

        socket.on("disconnect", async () => {
            console.log("Client has disconnected");
            const result = await offlineEvents(socket.id);
            console.log(result)
            console.log(connectedUsers,"users")
            io.emit("result", {
                success: true,
                message: "offline event"
            });
            console.log("Client has disconnected");
        });
    });


};


const isValidUserId = (Id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const objectId = new mongoose.Types.ObjectId(Id);
            const ifExist = await User.findById(objectId).exec();
            if (ifExist !== null) {
                resolve(ifExist);
            } else {
                resolve(null);
            }
        } catch (error) {
            console.log(error)
            reject(error);
        }
    })
}


export const sendMessage = async (data) => {
    try {
        const sender = await User.findOne({_id: data.sender,blocked_list:{$nin :data.receiver}}).exec()
        console.log(sender)
        const receiver = await User.findOne({_id: data.receiver,blocked_list:{$nin :data.sender}}).exec()
        console.log(receiver)
        if (sender !== null && receiver !== null) {
            const body = {
                sender: data.sender,
                receiver: data.receiver,
                message: data.message,
                message_type:data.message_type
            }
            const result = new Message(body)
            await result.save()
            console.log(">>")
            console.log('message sent');
            emitEvent(data.receiver, EVENTS.RESULT, data)
            emitEvent(data.sender, EVENTS.RESULT, data)
        } else {
          console.log("no user")
        }
    } catch (error) {
        console.error(`Error updating user: ${error}`);
        // socket.emit("result", {
        //     success: false,
        //     message: "Failed to add contact"
        // });
    }
}

export const addContact = async (data) => {
    try {
        const document = await User.findById(data.Id);
        const friend_details = await User.findById(data.contact)
        await User.findByIdAndUpdate(data.Id, {$addToSet: {friend_list: data.contact}}, {new: true});
        emitEvent(data.Id, EVENTS.RESULT, data)
        await User.findByIdAndUpdate(data.contact, {$addToSet: {friend_list: data.Id}}, {new: true});
        emitEvent(data.contact, EVENTS.RESULT, data)
    } catch (error) {
        console.error(`Error updating user: ${error}`);

    }
}


export const groupChat = async () => {
    try { // Join a room
        const roomName = 'room1'; // Room name to join
        socket.join(roomName);

        // Emit a message to sockets in the joined room
        const message = 'Welcome to room1!'; // Message to be sent
        io.to(roomName).emit('message', "hi group members");


    } catch (error) {
        console.error(`Error updating user: ${error}`);
        socket.emit("result", {
            success: false,
            message: "Failed to add contact"
        });
    }
}


export const offlineEvents = async (socketId) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log(socketId)
            console.log(connectedUsers)
            // compare based on userId
            const arr = connectedUsers.filter(obj => obj.clientId === socketId);
            console.log(arr)
            if (arr.length !== 0) {
                console.log('The array has the desired userId');
            } else {
                console.log('The array does not have the desired userId');
            }
            console.log(arr[0].clientId)
            // io.emit(event, Object.values(connectedUsers));
            resolve(arr[0].clientId)


        } catch (error) {
            console.error(`Error updating user: ${error}`);
        }
    })
}



export const getOfflineEvents = async(userId) => {
  return new Promise(async (resolve, reject) => {
    console.log("get offline events")
      const storedDetails = await Offline.find({ receiver: userId }).exec()
      for (let i = 0; i < storedDetails.length; i++) {
        emitEvent(userId,storedDetails[i].event,storedDetails)
      }
      const deletedDetails = await Offline.deleteMany({ receiver: userId });
    
  })
}


export const deliveredMessage = async (data) => {
  const chat = await Chat.updateMany({ _id: { $in: data.id } },{ $set: { status: 2 } });
  emitEvent(data.receiver, "message_delivered", data);
  emitEvent(data.sender, "message_delivered", data);
};

export const read = async (data) => {
  const chat = await Chat.updateMany({ _id: { $in: data.id } },{ $set: { status: 3 } });
  emitEvent(data.receiver, "message_read", data);
  console.log("seen")
  emitEvent(data.sender, "message_read", data);
};


export const storeOffLineEvents =async(data) => {
    return new Promise(async (resolve, reject) => {
        const offline = await Offline({
            sender:data.sender,
            receiver:data.receiver,
            data:data
        })
        await offline.save()

    })
}

export const getOffLineMessages =async(userId) => {
    return new Promise(async (resolve, reject) => {
      console.log("get offline messages")
      const chat = await Chat.find({ receiver: userId, status: 1 });
      emitEvent(userId, "offline_message", chat);


    })
}