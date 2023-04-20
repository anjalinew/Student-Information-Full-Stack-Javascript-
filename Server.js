const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

//const bodyParser = require('body-parser');

const app = express();
//app.use(bodyParser.json()); 

//serve static files
app.use(express.static(path.join(__dirname, 'public')));

// parse request body as JSON
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));

const uri = 'mongodb+srv://Anjali:Anjali0112@cluster0.nzzeqrn.mongodb.net/Student_db';

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB Atlas');
}).catch((error) => {
    console.log('Error connecting to MongoDB Atlas', error);
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function() {
  console.log('MongoDB connection successful.');
});

// Define the structure of the "students" collection
const studentSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    id: String,
    semester: Number,
    courses: [String]
});

//Define the structure of the "Courses" collection
const courseSchema = new mongoose.Schema({
 
   name : String,
   code: String,
   credits: Number
});

// Create a model for the "students" collection
const Student = mongoose.model('Student', studentSchema);

//create model for the "Courses" collection
const Course = mongoose.model('Course',courseSchema);

// Set up the route for add student page
app.get('/addStudent', (req, res) => {
    res.sendFile(__dirname + '/addStudent.html');
});

// Set up the route for adding a student
app.post('/addStudent', (req, res) => {
    const student = new Student(req.body);
    student.save()
  .then(result => {
    console.log(`Added student with id ${result.id}`);
    res.send(`Added student with id ${result.id}`);
  })
  .catch(err => {
    console.log(err);
    res.status(500).send('Error adding student to database');
  });
});

// Serve the delete student form
app.get('/deleteStudent', (req, res) => {
  res.sendFile(__dirname + '/deletestudent.html');
});

// Handle the delete student request
app.post('/deleteStudent', (req, res) => {
  const id = req.body.id;
  Student.deleteOne({ id: id })
    .then(() => {
      console.log(`Deleted student with ID: ${id}`);
      res.send(`student deleted with id ${id}`);
    })
    .catch((err) => console.error(err));
});

//Serve the Modify student form
app.get('/modifyStudent',(req,res) => {
  res.sendFile(__dirname + '/modifyStudent.html');
});

// POST route for updating a student by ID
// Modify student by id

app.post('/modifyStudent', (req, res) => {
  const _id = req.body._id.toString();
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const semester = req.body.semester;
  const courses = req.body.courses;

  Student.findByIdAndUpdate(_id, {
    firstname: firstname,
    lastname: lastname,
    semester: semester,
    courses: courses
  })
  .then((result) => {
    console.log(result);
    res.send("Student modified successfully!");
  })
  .catch((err) => {
    console.log(err);
    res.send("Error occurred while modifying student.");
  });
});

//Serve the modify course form
app.get('/modifyCourse', function(req, res) {
  res.sendFile(__dirname + '/modifyCourse.html');
});

//post method for modifyCourse
app.post('/modifyCourse', function(req, res) {
  const _id = req.body._id.toString();
  const name = req.body.name;
  const code = req.body.code;
  const credit = req.body.credit;

  Course.findByIdAndUpdate(_id, { name: name, code : code , credit:credit }, { new: true })
  .then(foundCourse => {
    res.send('Course updated: ' + foundCourse);
  })
  .catch(err => {
    res.send(err);
  });
});
