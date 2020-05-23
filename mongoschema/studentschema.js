const mongoose=require('mongoose');
const studentSchema=new mongoose.Schema({
    username:String,
    password:String,
    firstname:String,
    lastname:String,
    prn:String,
    class:String,
    department:String,

});
const student=mongoose.model('student',studentSchema);
async function setStudent(a){
const data=new student({
    username:a.user,
    password:a.pass,
    firstname:a.fname,
    lastname:a.lname,
    prn:a.prn,
    class:a.class,
    department:a.dept
    });
    const result=await data.save();
    console.log(result);
}
async function getStudent(b){
    const students= await student.find(b)
    return students;
}
async function getAllStudent(){
    const students= await student.find()
    return students;
}
async function deleteStudent(a){
    await student.deleteOne({firstname:a.fname,
       lastname:a.lname,
       department:a.dept})
}
async function updateStudent(a){
    console.log(a);
    //change implementation a bit
    await student.updateOne({ username:a.updateuser}, { department: a.dept },{upsert: true}, 
        function(err, doc) {
        if (err) return res.send(500, {error: err});
        console.log('Succesfully saved.');})
}
module.exports.setStudent=setStudent;
module.exports.getStudent=getStudent;
module.exports.getAllStudent=getAllStudent;
module.exports.deleteStudent=deleteStudent;
module.exports.updateStudent=updateStudent;
//getStudent()