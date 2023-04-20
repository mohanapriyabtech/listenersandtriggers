import {connectedUsers} from "./socket";
import {io} from "../config/socket"
import { Offline } from "../model/offline";

export const EVENTS = {
    ADD_CONTACT: "add-contacts",
    RESULT: "result",
    SEND_MESSAGE:"send_message",
    MESSAGE_DELIVERED:"message_delivered"

}


export const emitEvent = async (receiver, event, data) => {
    console.log(receiver,event)
    console.log(connectedUsers)
    // compare based on userId
    const arr = connectedUsers.filter(obj => obj.userId === receiver);
    console.log(arr)
    if (arr.length === 0) {

        console.log("offline event")
        const offline = new Offline(
            {receiver: receiver,
             event : event ,
            message : data,
            message_type: data.message_type
        })
        await offline.save()
        console.log(offline)
    }
    if (arr.length > 0){
        for(let i=0 ;i < arr.length ; i++) {
            io.to(arr[i].clientId).emit(event, {
                success: true,
                data: data
            });
        }
    }  
}


export const offlineEmitEvent = async (receiver, event, data, message) => {

    console.log("offline event emit")

    const arr = connectedUsers.filter(obj => obj.clientId === receiver);
    console.log(arr)
    if (arr.length !== 0) {
        console.log('exist');
    } else {
        console.log('not exist');
    }
    io.to(arr[0].clientId).emit("result", {
        success: true,
        message: message,
        data: data
    });
    const indexToDelete = connectedUsers.indexOf(arr[0]);
    if (indexToDelete !== -1) {
        connectedUsers.splice(arr[0], 1);
        console.log(`Deleted object with id ${arr[0].clientId}`);
    } else {
        console.log(`Object with id ${arr[0].clientId} not found`);
    }
}



