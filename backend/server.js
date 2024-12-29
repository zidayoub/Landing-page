const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const app = express();


app.use(express.json());
app.use(cors());

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// File upload setup with multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Define where the file should be uploaded
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // Define the filename with a timestamp to avoid collisions
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// In-memory database simulation
let courses = [
  { id: 1, title: 'Spring Boot / Angular', price: '350 DT/Month', image: '' },
  { id: 2, title: 'Node JS / React', price: '350 DT/Month', image: '' },
];

// CRUD Endpoints
// Get all courses
app.get('/courses', (req, res) => {
  res.json(courses);
});

// Create a new course
app.post('/courses', upload.single('image'), (req, res) => {
  const { title, price } = req.body;
  const newCourse = {
    id: courses.length + 1,
    title,
    price,
    image: req.file ? `/uploads/${req.file.filename}` : '',
  };
  courses.push(newCourse);
  res.status(201).json(newCourse);
});

// Update a course
app.put('/courses/:id', upload.single('image'), (req, res) => {
  const { id } = req.params;
  const { title, price } = req.body;
  const courseIndex = courses.findIndex((course) => course.id === parseInt(id));

  if (courseIndex === -1) return res.status(404).send('Course not found');

  const updatedCourse = {
    ...courses[courseIndex],
    title,
    price,
    // Update the image if a new one is provided, otherwise keep the old one
    image: req.file ? `/uploads/${req.file.filename}` : courses[courseIndex].image,
  };

  courses[courseIndex] = updatedCourse;
  res.json(updatedCourse);
});

// Delete course
app.delete('/courses/:id', (req, res) => {
  const { id } = req.params;
  courses = courses.filter((course) => course.id !== parseInt(id));
  res.status(204).send();
});

// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
