const student=require('./mongoschema/studentschema.js')
const teacher=require('./mongoschema/teacherschema.js')
const admin=require('./mongoschema/adminschema.js')
const message=require('./mongoschema/messageschema.js')
const file=require('./mongoschema/fileschema.js')
const express=require("express");
const multer=require("multer")
const bodyParser=require('body-parser');
const session = require('express-session');
const mongoose=require('mongoose');
var formidable = require('formidable')
var port=process.env.PORT || 3000
const uri = "mongodb+srv://sarveshlohar:Sarvesh@123@cluster0-49rjg.mongodb.net/mini-project?retryWrites=true&w=majority";
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(()=>console.log('Connected to Mongodb...'))
.catch(err=>console.log('Couldnot connect to Mongodb...',err))

// mongoose.connect('mongodb://localhost/miniproject')
// .then(()=>console.log('Connected to Mongodb...'))
// .catch(err=>console.log('Couldnot connect to Mongodb...',err))

const app=express()
var sess;
var suser,fuser,auser,sdept,filename;
app.use(bodyParser.urlencoded({extended : true}));
app.use(session({secret: 'ssshhhhh',saveUninitialized: true,resave: true}));
app.use(express.static("static"))
app.use(express.static("uploads"))
app.use(express.static('pwd'))
app.set('view engine', 'ejs');
//upload file
// const upload = multer({dest: 'uploads/' });
var storage =   multer.diskStorage({  
    destination: function (req, file, callback) {  
      callback(null, './uploads');  
    },  
    filename: function (req, file, callback) {  
      callback(null, file.originalname); 
      filename=file.originalname;
      console.log(file.originalname);
    }  
});  
const upload = multer({ storage : storage}).single('myfile');  
app.get('/',(req,res)=>{
    res.redirect('login');
})
app.get('/login',(req,res)=>{
    res.render("login");
})
app.post('/auth',async (req,res)=>{
    var user=req.body.user;
    var pass=req.body.pass;
    var type=req.body.type;
    sess = req.session;
    if(type=="student"){
        var user_details= await student.getStudent({'username':user,'password':pass});
        sess.name=req.body.user;
    
        suser=sess.name;
        if(user_details.length==0)
            res.render("invalid/invalid");
        else{
        sdept=user_details[0].department; 
            res.redirect('student/home');
        }
    }
    if(type=="faculty"){
    var teacher_details= await teacher.getTeacher({'username':user,'password':pass});
    sess.name=req.body.user;
    fuser=sess.name;
    if(teacher_details.length==0)
        res.render("invalid/invalid");
    else
       
        res.redirect('faculty/home');
    }
    if(type=="admin" )
    {
        
    sess.name=req.body.user;
    auser=sess.name;
    if(user=="admin" && pass=="1,2,3,4,5")
        res.redirect('admin/home');
    else
        res.render("invalid/invalid");
    }
    
})
//STUDENT route
app.get('/student/home',(req,res)=>{
    console.log(sess.name);
    res.render("student/student",{user:suser});
})

app.get('/student/permission',async (req,res)=>{
    var faculty=await teacher.getTeacher({'department':sdept});
    var fname=[];
    for (i of faculty)
        fname.push([i.firstname+" "+i.lastname,i.username])
        
    console.log(fname)
    res.render("student/permission",{user:suser,names:fname});
})
app.get('/student/attendance',async (req,res)=>{
    var faculty=await teacher.getTeacher({'department':sdept});
    var fname=[];
    for (i of faculty)
        fname.push([i.firstname+" "+i.lastname,i.username])
        
    console.log(fname)
    res.render("student/attendance",{user:suser,names:fname});
})
app.get('/student/message',async (req,res)=>{
    var faculty=await teacher.getTeacher({'department':sdept});
    var fname=[];
    for (i of faculty)
        fname.push([i.firstname+" "+i.lastname,i.username])
    res.render("student/studentmessage",{user:suser,names:fname});
})
app.post('/student/message/message',async (req,res)=>{
    console.log(req.body);
    var rname=req.body.faculty;
    var sname=suser;
    console.log(sname,rname);
    var msgs=await message.getMessage({$or:[{"sender":sname,"reciever":rname},{"sender":rname,"reciever":sname}]});
    res.render("student/message",{user:suser,sender:sname,reciever:rname,message:msgs});
})
app.post('/student/message/addmessage',async (req,res)=>{
    console.log(req.body);
    var rname=req.body.faculty;
    var sname=req.body.sender;
    await message.addMessage({"sender":sname,"reciever":rname,"message":req.body.msg});
    var msgs=await message.getMessage({$or:[{"sender":sname,"reciever":rname},{"sender":rname,"reciever":sname}]});
    res.render("student/message",{user:suser,sender:sname,reciever:rname,message:msgs});
})


app.post('/student/permission/fileupload' ,async (req,res)=>{
    var form = new formidable.IncomingForm();

    // form.parse analyzes the incoming stream data, picking apart the different fields and files for you.
    var faculty;
    await form.parse(req, function(err, fields, files) {
      if (err) {

        // Check for and handle any errors here.
        console.error(err.message);
        return;
      }
      faculty=fields.select;
      console.log(faculty);
    });
     upload(req,res,async (err)=>{
        if (err){
            res.send("ERROR UPLOADING FILE");
        }
        res.render("student/success",{user:suser});
        console.log(faculty,filename,suser);
        await file.setFile({sender:suser,reciever:faculty,file:filename,type:"permission"});
    })
    //add entry in database filename faculty user
    
})
app.post('/student/attendance/fileupload' ,async (req,res)=>{
    var form = new formidable.IncomingForm();

    // form.parse analyzes the incoming stream data, picking apart the different fields and files for you.
    var faculty;
    await form.parse(req, function(err, fields, files) {
      if (err) {

        // Check for and handle any errors here.
        console.error(err.message);
        return;
      }
      faculty=fields.select;
      console.log(faculty);
    });
     upload(req,res,async (err)=>{
        if (err){
            res.send("ERROR UPLOADING FILE");
        }
        res.render("student/success",{user:suser});
        console.log(faculty,filename,suser);
        await file.setFile({sender:suser,reciever:faculty,file:filename,type:"attendance"});
    })
    //add entry in database filename faculty user
    
})

//FACULTY route
app.get('/faculty/home',(req,res)=>{
    res.render("faculty/faculty",{user:fuser});
})
app.get('/faculty/messageinbox',async (req,res)=>{
    var student=await message.getMessage({'reciever':fuser});
    var fname=new Set();
    for (i of student)
        fname.add(i.sender)
    res.render("faculty/messageinbox",{user:fuser,names:fname});
})
app.post('/faculty/message/addmessage',async (req,res)=>{
    console.log(req.body);
    var rname=req.body.faculty;
    var sname=req.body.sender;
    await message.addMessage({"sender":sname,"reciever":rname,"message":req.body.msg});
    var msgs=await message.getMessage({$or:[{"sender":sname,"reciever":rname},{"sender":rname,"reciever":sname}]});
    res.render("faculty/message",{user:fuser,sender:sname,reciever:rname,message:msgs});
})
app.post('/faculty/messageinbox/message',async (req,res)=>{
    console.log(req.body);
    var rname=req.body.faculty;
    var sname=fuser;
    console.log(sname,rname);
    var msgs=await message.getMessage({$or:[{"sender":sname,"reciever":rname},{"sender":rname,"reciever":sname}]});
    res.render("faculty/message",{user:fuser,sender:sname,reciever:rname,message:msgs});
})
app.get('/faculty/permission',async (req,res)=>{
    data= await file.getFile({reciever:fuser,type:"permission"})
    res.render("faculty/permission",{user:fuser,info:data});
})
app.get('/faculty/attendance',async (req,res)=>{
    data= await file.getFile({reciever:fuser,type:"attendance"})
    res.render("faculty/attendance",{user:fuser,info:data});
})

//ADMIN route
app.get('/admin/home',(req,res)=>{
    res.render("admin/admin",{user:auser});
})
app.get('/admin/manage/student',(req,res)=>{
    res.render("admin/managestudent",{user:suser});
})
app.get('/admin/manage/student/add',(req,res)=>{
    res.render("admin/addstudent",{user:auser});
})
app.get('/admin/manage/student/delete',(req,res)=>{
    res.render("admin/deletestudent",{user:auser});
})
app.get('/admin/manage/student/update',(req,res)=>{
    res.render("admin/updatestudent",{user:auser});
})
app.get('/admin/manage/student/show',async (req,res)=>{
    const sdata=await student.getAllStudent();
    
    res.render("admin/showstudent",{user:auser,data:sdata});
})
app.post('/addstudent',(req,res)=>{
    if(req.body.pass.length==0)
        res.render("admin/addstudent",{user:suser});
    else{
        student.setStudent(req.body)
        res.render("success/success",{user:auser,data:"Successfully Added"});
    }
})
app.post('/deletestudent', (req,res)=>{
     student.deleteStudent(req.body);
    res.render("success/success",{user:auser,data:"Successfully Deleted"});
})
app.get('/admin/manage/faculty',(req,res)=>{
    res.render("admin/managefaculty",{user:auser});
})
app.get('/admin/manage/faculty/add',(req,res)=>{
    res.render("admin/addfaculty",{user:auser});
})
app.get('/admin/manage/faculty/delete',(req,res)=>{
    res.render("admin/deletefaculty",{user:auser});
})
app.get('/admin/manage/faculty/update',(req,res)=>{
    res.render("admin/updatefaculty",{user:auser});
})
app.post('/addfaculty',(req,res)=>{

    if(req.body.pass.length==0)
        res.render("admin/addfaculty",{user:auser});
    else{
        teacher.setTeacher(req.body)
        res.render("success/success",{user:auser,data:"Successfully Added"});
    }
})
app.get('/admin/manage/faculty/show',async (req,res)=>{
    const sdata=await teacher.getAllTeacher();
    
    res.render("admin/showfaculty",{user:auser,data:sdata});
})
app.post('/updatestudent',(req,res)=>{
    
     student.updateStudent(req.body)
    res.render("success/success",{user:auser,data:"Successfully Updated"});
})
app.post('/updatefaculty',(req,res)=>{
    
    teacher.updateTeacher(req.body)
   res.render("success/success",{user:auser,data:"Successfully Updated"});
})
app.post('/deletefaculty', (req,res)=>{

     teacher.deleteTeacher(req.body);
    res.render("success/success",{user:auser,data:"Successfully Deleted"});
})

app.listen(port,()=>{console.log(`Server started at ${port} port`)});