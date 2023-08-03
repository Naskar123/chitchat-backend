//name of the sender
//content
//reference to the chat to which it belongs to

const mongoose = require('mongoose');
const messageModel = mongoose.Schema({
    sender : {type : mongoose.Schema.Types.ObjectId, ref : "User"},
    content : {type : String, trim : true},
    chat : {type: mongoose.Schema.Types.ObjectId, ref : "Chat"},
},
{
    timestamps : true,
}
);

//msgModel.set('strictPopulate', false);

const Message = mongoose.model('Message',messageModel);
module.exports= Message;