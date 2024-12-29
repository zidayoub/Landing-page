import React, { useState, useEffect } from 'react';
import './App.css';
import backgroundImage from './image/i.png'; // Import your image
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import axios from 'axios';

function LandingPage({ courses }) {
  return (
    <div className="container">
      <navbar className="navbar">
        <div className="header-content">
          <img className="container-image" src="/images/logo.png" alt="logo" />
        </div>
      </navbar>
      <header
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundColor: 'white',
          textAlign: 'center',
          marginBottom: '40px',
          padding: '100px 0',
        }}
      >
        <h2>Improve your skills on your own to prepare for a better future</h2>
        <button className="button1">REGISTER NOW</button>
      </header>

      <main>
        <button className="button">View More</button>
        <h2>Discover Our Courses</h2>
        <div className="course-cards">
          {courses.map((course) => (
            <div key={course.id} className="course-card">
              <img src={`http://localhost:5000${course.image}`} alt={course.title} />
              <h3>{course.title}</h3>
              <p className="course-price">{course.price} DT/Month</p>
            </div>
          ))}
        </div>
      </main>

      <footer>
        <div className="contact-form">
          <h2>Contact Us</h2>
          <form>
            <h4>NAME</h4>
            <input type="text" placeholder="Jiara Martins" />
            <h4>EMAIL</h4>
            <input type="email" placeholder="hello@reallygreatsite.com" />
            <h4>MESSAGE</h4>
            <input placeholder="Write your message here" />
            <button type="submit">Send The Message</button>
          </form>
        </div>
      </footer>
    </div>
  );
}

function Admin({ courses, setCourses }) {
  const [formData, setFormData] = useState({ title: '', price: '', image: null });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get('http://localhost:5000/courses');
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('title', formData.title);
    data.append('price', formData.price);
    if (formData.image) data.append('image', formData.image);

    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/courses/${editingId}`, data);
        setEditingId(null);
        alert('Course updated successfully!');
      } else {
        await axios.post('http://localhost:5000/courses', data);
        alert('Course added successfully!');
      }

      setFormData({ title: '', price: '', image: null });
      fetchCourses();
    } catch (error) {
      console.error('Error submitting the form:', error);
    }
  };

  const handleEdit = (course) => {
    setFormData({ title: course.title, price: course.price, image: null });
    setEditingId(course.id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/courses/${id}`);
      fetchCourses();
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  return (
    <div className="admin">
      <h1>Admin Panel</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Course Title"
          value={formData.title}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleInputChange}
        />
        <input type="file" onChange={handleFileChange} />
        <button type="submit">{editingId ? 'Update Course' : 'Add Course'}</button>
      </form>

      <div className="course-list">
        {courses.map((course) => (
          <div key={course.id} className="course-item">
            <span>{course.title} - {course.price}</span>
            <button onClick={() => handleEdit(course)}>Edit</button>
            <button onClick={() => handleDelete(course.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function App() {
  const [courses, setCourses] = useState([]);

  return (
    <Router>
      <div>
        <nav>
          <Link className='active' to="/">Home</Link> | <Link className='active' to="/admin">Admin</Link>
        </nav>
        <Routes>
          <Route path="/" element={<LandingPage courses={courses} />} />
          <Route path="/admin" element={<Admin courses={courses} setCourses={setCourses} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
