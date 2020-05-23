const mongoose=require('mongoose');
const messageSchema=new mongoose.Schema({
    sender:String,
    reciever:String,
    message:String
});
const message=mongoose.model('message',messageSchema);
async function addMessage(a){
    const data=new message({
        sender:a.sender,
        reciever:a.reciever,
        message:a.message
        });
        const result=await data.save();
        console.log(result);
}
async function getMessage(b){
    const messages= await message.find(b)
    return messages;
}
module.exports.addMessage=addMessage;
module.exports.getMessage=getMessage;