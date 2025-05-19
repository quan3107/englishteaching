import React, { useState, useEffect } from 'react';
import './styles/DashboardCourses.css'; 
import { useAuth } from '../Routes/Auth'; 
import { useNavigate } from 'react-router-dom'; 
import axios from "axios";

function DashboardCourses() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null);

    const { user } = useAuth();
    const navigate = useNavigate(); 

    useEffect(() => {
        const fetchCourses = async () => {

            setLoading(true); 
            setError(null);   

            try {
                const res = await axios.get("http://localhost:3000/api/dashboard/courses", {
                    withCredentials: true
                });
                console.log(res.data);
                
                setCourses(res.data);
            } catch (err) {
                console.log(err);
                setError("Failed to fetch courses. Please try again later.");
            } finally {
                setLoading(false); 
            }
        };

        fetchCourses();
    }, [user]); 

    if (loading) return <div className="loading">Loading courses...</div>;
    if (error) return <div className="error">Error: {error}</div>;

    return (
        <div className="dashboard-courses">
            <h2>My Courses</h2>
            {courses.length === 0 ? (
                <p>No courses found. Enroll in a course to get started or check back later!</p>
            ) : (
                <div className="courses-grid">
                    {courses.map((course) => (
                        <div className="course-card" key={course.course_id}> 
                            <div className="course-image">
                                
                                <img src={course.image_url || 'default-course.jpg'} alt={course.title || 'Course image'} />
                            </div>
                            <div className="course-info">
                                <h3>{course.title || "Untitled Course"}</h3>
                                <p>{course.description || "No description available."}</p>
                                <div className="course-meta">
                                    
                                    <span>Instructor: {course.instructor_name || "N/A"}</span>
                                    <span>Progress: {course.progress || 0}%</span>
                                </div>
                                <button className="continue-btn">Continue Learning</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default DashboardCourses;