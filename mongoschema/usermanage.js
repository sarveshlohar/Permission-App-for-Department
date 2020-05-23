const student=require('./studentschema.js')
const teacher=require('./teacherschema.js')
const admin=require('./adminschema.js')

studentData={user:'sarveshlohar',pass:'sarvesh@qwer',fname:'sarvesh',lname:'lohar',prn:'2017btecs00024',class:'TY',dept:'CSE'};
//student.setStudent(studentData)
student.getStudent()
teacherData=['mashah','shah123','ma','shah','CSE'];
//teacher.setTeacher(teacherData)
teacher.getTeacher()
adminData=["admin","root"]
//admin.setAdmin(adminData);
admin.getAdmin({"username":"admin"})