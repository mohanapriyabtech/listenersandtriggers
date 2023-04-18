import { Server } from "socket.io";
import { User } from "../model/user";
import mongoose from "mongoose"
import { Message } from "../model/message";




export const socket = (server) => {

  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  }); 


io.on("connection", async(socket) => {

    const Id = socket.handshake.query.Id;

    if (!socket.handshake.query.Id) {
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

    
    socket.on('add_contact', async(data) => {
        try {   
            console.log(data,"data")
            console.log(data.Id ,data.contact)
            const document = await User.findById("643d3a65dbbf8f5d13336480");
            console.log(document)
            const friend_details = await User.findById(data.contact)
            if (document && document.friend_list && document.friend_list.includes(data.contact)) {
              console.log('contact already exists in document.friend_list');
              io.emit("result", { success: true, message: "Contact already exist",data:result });
        
            } else {
              const result = await User.findByIdAndUpdate(data.Id, { $addToSet: { friend_list: data.contact } }, { new: true });
              console.log(result)
              if(result !== null) {
                console.log('data.contact added to friend_list array');
                io.to(data.contact).emit("result", { success: true, message: "Contact added successfully",data:result });

              }
              
            }
            if (friend_details && friend_details.friend_list && friend_details.friend_list.includes(data.contact)) {
              console.log('contact already exist');
              
            } else {
              const result = await User.findByIdAndUpdate(data.contact, { $addToSet: { friend_list: data.Id } }, { new: true });
              console.log('data.contact added to friend_list array');
              
            }
           
        } catch (error) {
            console.error(`Error updating user: ${error}`);
            
        }
    })

    socket.on('send_message', async(data) => {
      try {
        console.log("enter",data)
          const sender = await User.findOne({_id:data.sender,block:0});
          console.log(sender)
          const receiver = await User.findOne({_id:data.receiver,block:0})
          if (sender !== null && receiver !== null) {

            const body = {
              sender : data.sender,
              receiver: data.receiver,
              message: data.message
            }
            const result = new Message(body)
            await result.save()
            console.log('message sent');
            socket.to(data.sender).to(data.receiver).emit("result", { success: true, message: "Message sent successfully",data:result });
          }
          
         
      } catch (error) {
          console.error(`Error updating user: ${error}`);
          socket.emit("result", { success: false, message: "Failed to add contact" });
      }
  })

   
  socket.on('group_chat', async() => {
    try {
        
    // Join a room
    const roomName = 'room1'; // Room name to join
    socket.join(roomName);

    // Emit a message to sockets in the joined room 
    const message = 'Welcome to room1!'; // Message to be sent
    io.to(roomName).emit('message', "hi group members");
       
         
      } catch (error) {
          console.error(`Error updating user: ${error}`);
          socket.emit("result", { success: false, message: "Failed to add contact" });
      }
  })


    // socket.on("send_message", (data) => {
    //   console.log(data);
    //   socket.emit("received_message", "hello");
    // });
  
    // socket.on("room", (data) => {
    //   console.log(data);
    //   socket.join(data);
    // });
  
    // socket.on("message", (data) => {
    //   console.log(data);
    //   socket.to(data.room).emit("receive_message", data);
    // });
  
    socket.on("disconnect", () => {
      console.log("Client has disconnected");
    });
  });
  
};


const isValidUserId = (Id) => {
    return new Promise(async(resolve, reject) => {  
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