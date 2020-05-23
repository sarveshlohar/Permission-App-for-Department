
const mongoose=require('mongoose');
const adminSchema=new mongoose.Schema({
    username:String,
    password:String,
});
const admin=mongoose.model('admin',adminSchema);
async function setAdmin(a){
// const data=new student({
//     username:'nasibo',
//     password:'nasssss',
//     firstname:'Nashib',
//     lastname:'Sarode',
//     prn:27,
//     class:'TY',
//     department:'Civil'
//     });
    const data=new admin({
        username:a[0],
        password:a[1],
        });
    const result=await data.save();
    console.log(result);
}
async function getAdmin(b){
    const admins= await admin.find(b)
    return admins;
}
module.exports.setAdmin=setAdmin;
module.exports.getAdmin=getAdmin;
//getStudent()