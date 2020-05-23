const mongoose=require('mongoose');
const fileSchema=new mongoose.Schema({
    sender:String,
    reciever:String,
    file:String,
    type:String
});
const file=mongoose.model('file',fileSchema);
async function setFile(a){
    const data=new file({
        sender:a.sender,
        reciever:a.reciever,
        file:a.file,
        type:a.type
        });
        const result=await data.save();
        console.log(result);
    }
async function getFile(b)
{
    const info= await file.find(b)
    return info;
}
module.exports.setFile=setFile;
module.exports.getFile=getFile;