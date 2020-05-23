const mongoose=require('mongoose');
const teacherSchema=new mongoose.Schema({
    username:String,
    password:String,
    firstname:String,
    lastname:String,
    department:String,

});
const teacher=mongoose.model('teacher',teacherSchema);
async function setTeacher(a){
const data=new teacher({
    username:a.user,
    password:a.pass,
    firstname:a.fname,
    lastname:a.lname,
    department:a.dept
    });
    const result=await data.save();
    console.log(result);
}
async function getTeacher(b){
    const teachers= await teacher.find(b)
    return teachers;
}
async function getAllTeacher(){
    const teachers= await teacher.find()
    return teachers;
}
async function deleteTeacher(a){
     await teacher.deleteOne({firstname:a.fname,
        lastname:a.lname,
        department:a.dept})
}
async function updateTeacher(a){
    console.log(a);
    //change implementation a bit
    await teacher.updateOne({ username:a.updateuser}, { department: a.dept },{upsert: true}, 
        function(err, doc) {
        if (err) return res.send(500, {error: err});
        console.log('Succesfully saved.');})
}
module.exports.setTeacher=setTeacher;
module.exports.getTeacher=getTeacher;
module.exports.getAllTeacher=getAllTeacher;
module.exports.deleteTeacher=deleteTeacher;
module.exports.updateTeacher=updateTeacher;
