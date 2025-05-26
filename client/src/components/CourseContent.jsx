import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styles/CourseContent.css";

function CourseContent({ courseId, lessonId }) {
  const [courseData, setCourseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [progress, setProgress] = useState({});

  const placeholderData = {
    title: "Introduction to Web Development",
    description: "Learn the fundamentals of web development including HTML, CSS, JavaScript, and React. This comprehensive course will take you from beginner to intermediate level.",
    modules: [
      {
        module_id: 1,
        title: "HTML Fundamentals",
        description: "Learn the building blocks of web pages",
        lessons: [
          {
            lesson_id: 1,
            title: "Introduction to HTML",
            lesson_type: "reading"
          },
          {
            lesson_id: 2,
            title: "HTML Elements and Tags",
            lesson_type: "reading"
          },
          {
            lesson_id: 3,
            title: "HTML Quiz 1",
            lesson_type: "quiz"
          }
        ]
      },
      {
        module_id: 2,
        title: "CSS Styling",
        description: "Make your web pages beautiful with CSS",
        lessons: [
          {
            lesson_id: 4,
            title: "CSS Basics",
            lesson_type: "reading"
          },
          {
            lesson_id: 5,
            title: "CSS Flexbox",
            lesson_type: "reading"
          },
          {
            lesson_id: 6,
            title: "CSS Grid Layout",
            lesson_type: "reading"
          },
          {
            lesson_id: 7,
            title: "CSS Styling Quiz",
            lesson_type: "quiz"
          }
        ]
      },
      {
        module_id: 3,
        title: "JavaScript Programming",
        description: "Add interactivity to your websites",
        lessons: [
          {
            lesson_id: 8,
            title: "JavaScript Variables",
            lesson_type: "reading"
          },
          {
            lesson_id: 9,
            title: "Functions and Events",
            lesson_type: "reading"
          },
          {
            lesson_id: 10,
            title: "DOM Manipulation",
            lesson_type: "reading"
          },
          {
            lesson_id: 11,
            title: "JavaScript Final Quiz",
            lesson_type: "quiz"
          }
        ]
      }
    ]
  };

  const placeholderProgress = {
    completionPercentage: 35,
    completedLessons: [1, 2, 4, 5]
  };

  useEffect(() => {
    if (courseId) {
      // Simulate loading delay
      setTimeout(() => {
        setCourseData(placeholderData);
        setProgress(placeholderProgress);
        setLoading(false);
      }, 1000);
    }
  }, [courseId]);

  const fetchCourseContent = async () => {
    setLoading(true);
    // Simulate loading
    setTimeout(() => {
      setCourseData(placeholderData);
      setProgress(placeholderProgress);
      setLoading(false);
    }, 1000);
  };

  const fetchProgress = async () => {
    // Placeholder function
  };

  const getEmbeddableUrl = (url) => {
    if (!url) return null;
    const fileIdMatch = url.match(/\/file\/d\/([a-zA-Z0-9-_]+)/);
    if (fileIdMatch) {
        const fileId = fileIdMatch[1];
        return "https://drive.google.com/file/d/" + fileId + "/preview";
    }

    return url;
  }

  const handleLessonClick = async (moduleId, lessonId) => {
    // Find the lesson data
    const lesson = placeholderData.modules
      .find(module => module.module_id === moduleId)
      ?.lessons.find(lesson => lesson.lesson_id === lessonId);
    
    if (lesson) {
      // Add additional lesson data for viewing
      const lessonWithContent = {
        ...lesson,
        description: lesson.lesson_type === 'reading' 
          ? "This lesson covers the fundamental concepts you need to understand. Take your time to read through the material and practice the examples."
          : "Test your knowledge with this comprehensive quiz. You need 70% to pass.",
        estimated_time: lesson.lesson_type === 'reading' ? 15 : 10,
        pdf_url: lesson.lesson_type === 'reading' 
          ? getEmbeddableUrl("https://drive.google.com/file/d/1-2Iie1F5NJndb83GQkE2zZRvvUqffHOr/view?usp=sharing")
          : null,
        instructions: lesson.lesson_type === 'quiz' 
          ? "Answer all questions to the best of your ability. You can retake this quiz if needed."
          : null,
        time_limit: lesson.lesson_type === 'quiz' ? 30 : null,
        passing_score: lesson.lesson_type === 'quiz' ? 70 : null
      };
      
      setSelectedLesson(lessonWithContent);
    }
  };

  const markLessonComplete = async (lessonId) => {
    // Update progress state
    setProgress(prev => ({
      ...prev,
      completedLessons: [...(prev.completedLessons || []), lessonId],
      completionPercentage: Math.min(100, (prev.completionPercentage || 0) + 10)
    }));
    alert('Lesson marked as complete!');
  };

  

  if (loading) {
    return (
      <div className="course-content">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading course content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="course-content">
        <div className="error-container">
          <h3>Error</h3>
          <p>{error}</p>
          <button onClick={fetchCourseContent} className="retry-btn">
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!courseData) {
    return (
      <div className="course-content">
        <div className="no-content">
          <h3>No content available</h3>
          <p>This course doesn't have any content yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="course-content">
      <div className="course-header">
        <h1>{courseData.title}</h1>
        <p className="course-description">{courseData.description}</p>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progress.completionPercentage || 0}%` }}
          ></div>
          <span className="progress-text">
            {progress.completionPercentage || 0}% Complete
          </span>
        </div>
      </div>

      <div className="content-layout">
        <div className="sidebar">
          <h3>Course Content</h3>
          {courseData.modules &&
            courseData.modules.map((module, moduleIndex) => (
              <div key={module.module_id} className="module">
                <div className="module-header">
                  <h4>
                    <span className="module-number">{moduleIndex + 1}.</span>
                    {module.title}
                  </h4>
                  {module.description && (
                    <p className="module-description">{module.description}</p>
                  )}
                </div>
                <div className="lessons-list">
                  {module.lessons &&
                    module.lessons.map((lesson, lessonIndex) => (
                      <div
                        key={lesson.lesson_id}
                        className={`lesson-item ${progress.completedLessons?.includes(lesson.lesson_id) ? "completed" : ""} ${selectedLesson?.lesson_id === lesson.lesson_id ? "active" : ""}`}
                        onClick={() =>
                          handleLessonClick(module.module_id, lesson.lesson_id)
                        }
                      >
                        <div className="lesson-info">
                          <span className="lesson-number">
                            {moduleIndex + 1}.{lessonIndex + 1}
                          </span>
                          <span className="lesson-title">{lesson.title}</span>
                          <span className={`lesson-type ${lesson.lesson_type}`}>
                            {lesson.lesson_type === "reading" ? "📖" : "📝"}
                          </span>
                        </div>
                        {progress.completedLessons?.includes(
                          lesson.lesson_id
                        ) && <span className="completion-check">✓</span>}
                      </div>
                    ))}
                </div>
              </div>
            ))}
        </div>

        <div className="main-content">
          {selectedLesson ? (
            <div className="lesson-viewer">
              <div className="lesson-header">
                <h2>{selectedLesson.title}</h2>
                <span className={`lesson-badge ${selectedLesson.lesson_type}`}>
                  {selectedLesson.lesson_type === "reading"
                    ? "Reading Material"
                    : "Quiz"}
                </span>
              </div>

              <div className="lesson-content">
                {selectedLesson.lesson_type === "reading" ? (
                  <div className="reading-content">
                    {selectedLesson.description && (
                      <p className="lesson-description">
                        {selectedLesson.description}
                      </p>
                    )}
                    {selectedLesson.estimated_time && (
                      <div className="estimated-time">
                        ⏱️ Estimated reading time:{" "}
                        {selectedLesson.estimated_time} minutes
                      </div>
                    )}
                    {selectedLesson.pdf_url ? (
                      <div className="pdf-viewer">
                        <a
                          href={selectedLesson.pdf_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="pdf-link"
                        >
                          📄 Open PDF Reading Material
                        </a>
                        <iframe
                          src={selectedLesson.pdf_url}
                          className="pdf-embed"
                          title="Reading Material"
                        />
                      </div>
                    ) : (
                      <div className="no-content">
                        <p>Reading material not available</p>
                      </div>
                    )}
                    <div className="lesson-actions">
                      <button
                        onClick={() =>
                          markLessonComplete(selectedLesson.lesson_id)
                        }
                        className="complete-btn"
                        disabled={progress.completedLessons?.includes(
                          selectedLesson.lesson_id
                        )}
                      >
                        {progress.completedLessons?.includes(
                          selectedLesson.lesson_id
                        )
                          ? "✓ Completed"
                          : "Mark as Complete"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="quiz-content">
                    <div className="quiz-header">
                      <h3>Quiz: {selectedLesson.title}</h3>
                      {selectedLesson.instructions && (
                        <p className="quiz-instructions">
                          {selectedLesson.instructions}
                        </p>
                      )}
                      {selectedLesson.time_limit && (
                        <div className="time-limit">
                          ⏰ Time Limit: {selectedLesson.time_limit} minutes
                        </div>
                      )}
                      {selectedLesson.passing_score && (
                        <div className="passing-score">
                          🎯 Passing Score: {selectedLesson.passing_score}%
                        </div>
                      )}
                    </div>
                    <div className="quiz-placeholder">
                      <p>Quiz interface will be implemented here</p>
                      <button className="start-quiz-btn">Start Quiz</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="welcome-message">
              <h2>Welcome to the Course</h2>
              <p>Select a lesson from the sidebar to begin learning.</p>
              <div className="course-stats">
                <div className="stat">
                  <strong>{courseData.modules?.length || 0}</strong>
                  <span>Modules</span>
                </div>
                <div className="stat">
                  <strong>
                    {courseData.modules?.reduce(
                      (total, module) => total + (module.lessons?.length || 0),
                      0
                    ) || 0}
                  </strong>
                  <span>Lessons</span>
                </div>
                <div className="stat">
                  <strong>{progress.completionPercentage || 0}%</strong>
                  <span>Complete</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CourseContent;
