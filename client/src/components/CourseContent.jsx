import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styles/CourseContent.css";

function CourseContent({ courseId, lessonId }) {
  const [courseData, setCourseData] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [lessonContent, setLessonContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lessonLoading, setLessonLoading] = useState(false);
  const [error, setError] = useState("");
  const [embedError, setEmbedError] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizResults, setQuizResults] = useState(null);

  // Fetch course structure on component mount
  useEffect(() => {
    if (!courseId) {
      setError("No course selected");
      setLoading(false);
      return;
    }

    const fetchCourseContent = async () => {
      try {
        setError("");
        setLoading(true);
        
        const response = await axios.get(`http://localhost:3000/api/course/${courseId}`, {
          withCredentials: true
        });

        if (response.data.message) {
          setError(response.data.message);
        } else {
          setCourseData(response.data);
          
          // If lessonId is provided in URL, select that lesson
          if (lessonId) {
            selectLessonById(parseInt(lessonId), response.data);
          } else {
            // Select first lesson if available
            const firstModule = response.data.modules?.[0];
            const firstLesson = firstModule?.lessons?.[0];
            if (firstLesson) {
              setSelectedLesson(firstLesson);
              fetchLessonContent(firstLesson.lesson_id);
            }
          }
        }
      } catch (err) {
        console.error("Error fetching course content:", err);
        setError("Failed to fetch course content");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseContent();
  }, [courseId, lessonId]);

  // Helper function to select lesson by ID
  const selectLessonById = (targetLessonId, courseData) => {
    for (const module of courseData.modules) {
      const lesson = module.lessons.find(l => l.lesson_id === targetLessonId);
      if (lesson) {
        setSelectedLesson(lesson);
        fetchLessonContent(lesson.lesson_id);
        break;
      }
    }
  };

  // Fetch individual lesson content
  const fetchLessonContent = async (lessonId) => {
    try {
      setLessonLoading(true);
      setLessonContent(null);
      setQuizAnswers({});
      setQuizSubmitted(false);
      setQuizResults(null);
      setEmbedError(false);

      const response = await axios.get(`http://localhost:3000/api/lesson/${lessonId}`, {
        withCredentials: true
      });

      setLessonContent(response.data);
    } catch (err) {
      console.error("Error fetching lesson content:", err);
      setError("Failed to fetch lesson content");
    } finally {
      setLessonLoading(false);
    }
  };

  // Handle lesson selection
  const handleLessonSelect = (lesson) => {
    setSelectedLesson(lesson);
    fetchLessonContent(lesson.lesson_id);
  };

  // Mark reading lesson as completed
  const markLessonComplete = async (timeSpent = 0) => {
    if (!selectedLesson) return;

    try {
      await axios.post(
        `http://localhost:3000/api/lesson/${selectedLesson.lesson_id}/complete`,
        { timeSpent },
        { withCredentials: true }
      );

      // Update local state
      setSelectedLesson(prev => ({ ...prev, completed: true }));
      
      // Update course data
      setCourseData(prev => ({
        ...prev,
        modules: prev.modules.map(module => ({
          ...module,
          lessons: module.lessons.map(lesson =>
            lesson.lesson_id === selectedLesson.lesson_id
              ? { ...lesson, completed: true }
              : lesson
          )
        }))
      }));

    } catch (err) {
      console.error("Error marking lesson complete:", err);
    }
  };

  // Handle quiz answer change
  const handleQuizAnswer = (questionId, answer) => {
    setQuizAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  // Submit quiz
  const submitQuiz = async () => {
    if (!selectedLesson || !lessonContent?.quiz) return;

    try {
      setQuizSubmitted(true);
      
      const response = await axios.post(
        `http://localhost:3000/api/lesson/${selectedLesson.lesson_id}/submit-quiz`,
        { 
          answers: quizAnswers,
          timeSpent: 0 // Could track actual time spent
        },
        { withCredentials: true }
      );

      setQuizResults(response.data);
      
      // Update local state
      setSelectedLesson(prev => ({ 
        ...prev, 
        completed: response.data.passed,
        score: response.data.score 
      }));
      
      // Update course data
      setCourseData(prev => ({
        ...prev,
        modules: prev.modules.map(module => ({
          ...module,
          lessons: module.lessons.map(lesson =>
            lesson.lesson_id === selectedLesson.lesson_id
              ? { 
                  ...lesson, 
                  completed: response.data.passed,
                  score: response.data.score 
                }
              : lesson
          )
        }))
      }));

    } catch (err) {
      console.error("Error submitting quiz:", err);
      setQuizSubmitted(false);
    }
  };

  // Calculate overall progress
  const calculateProgress = () => {
    if (!courseData?.modules) return 0;
    
    const totalLessons = courseData.modules.reduce(
      (total, module) => total + module.lessons.length, 0
    );
    
    const completedLessons = courseData.modules.reduce(
      (total, module) => total + module.lessons.filter(lesson => lesson.completed).length, 0
    );
    
    return totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  };

  // Convert Google Drive/Docs URL to embeddable format
  const getEmbedUrl = (url) => {
    if (!url) return "";
    
    if (url.includes("docs.google.com")) {
      return url.replace("/edit", "/preview").replace("/view", "/preview");
    }
    
    if (url.includes("drive.google.com/file/d/")) {
      const fileId = url.match(/\/file\/d\/([a-zA-Z0-9-_]+)/)?.[1];
      if (fileId) {
        return `https://drive.google.com/file/d/${fileId}/preview`;
      }
    }
    
    return url;
  };

  // Handle iframe load error
  const handleEmbedError = () => {
    setEmbedError(true);
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
          <h2>Error</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }
  
  if (!courseData) {
    return (
      <div className="course-content">
        <div className="no-content">
          <h2>No Course Data</h2>
          <p>Please select a course to view content.</p>
        </div>
      </div>
    );
  }  return (
    <div className="course-content">
      <div className="course-header">
        <h1>{courseData.title}</h1>
        <p className="course-description">{courseData.description}</p>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${calculateProgress()}%` }}
          ></div>
          <span className="progress-text">
            {calculateProgress()}% Complete
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
                        className={`lesson-item ${lesson.completed ? "completed" : ""} ${selectedLesson?.lesson_id === lesson.lesson_id ? "active" : ""}`}
                        onClick={() => handleLessonSelect(lesson)}
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
                        {lesson.completed && <span className="completion-check">✓</span>}
                        {lesson.score && (
                          <span className="lesson-score">{lesson.score}%</span>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            ))}
        </div>

        <div className="main-content">
          {lessonLoading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading lesson content...</p>
            </div>
          ) : selectedLesson && lessonContent ? (
            <div className="lesson-viewer">
              <div className="lesson-header">
                <h2>{lessonContent.title}</h2>
                <span className={`lesson-badge ${lessonContent.lesson_type}`}>
                  {lessonContent.lesson_type === "reading"
                    ? "Reading Material"
                    : "Quiz"}
                </span>
                {lessonContent.progress?.completed && (
                  <span className="completed-badge">✓ Completed</span>
                )}
              </div>

              <div className="lesson-content">
                {lessonContent.lesson_type === "reading" ? (
                  <div className="reading-content">
                    {lessonContent.readings && lessonContent.readings.length > 0 ? (
                      lessonContent.readings.map((reading) => (
                        <div key={reading.reading_id} className="reading-item">
                          <h3>{reading.title}</h3>
                          {reading.description && (
                            <p className="reading-description">{reading.description}</p>
                          )}
                          {reading.estimated_time && (
                            <div className="estimated-time">
                              ⏱️ Estimated reading time: {reading.estimated_time} minutes
                            </div>
                          )}
                          {reading.reading_url ? (
                            <div className="pdf-viewer">
                              <a
                                href={reading.reading_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="pdf-link"
                              >
                                📄 Open Reading Material
                              </a>
                              {!embedError ? (
                                <iframe
                                  src={getEmbedUrl(reading.reading_url)}
                                  className="pdf-embed"
                                  title={reading.title}
                                  frameBorder="0"
                                  onError={handleEmbedError}
                                />
                              ) : (
                                <div className="embed-error">
                                  <div className="fallback-message">
                                    <h4>Unable to embed document</h4>
                                    <p>This document cannot be embedded directly. Please click the link above to view it in a new tab.</p>
                                    <button
                                      onClick={() => window.open(reading.reading_url, "_blank")}
                                      className="view-document-btn"
                                    >
                                      View Document
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="no-content">
                              <p>Reading material not available</p>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="no-content">
                        <p>No reading materials available for this lesson</p>
                      </div>
                    )}
                    
                    <div className="lesson-actions">
                      <button
                        onClick={() => markLessonComplete()}
                        className="complete-btn"
                        disabled={lessonContent.progress?.completed}
                      >
                        {lessonContent.progress?.completed
                          ? "✓ Completed"
                          : "Mark as Complete"}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="quiz-content">
                    {lessonContent.quiz ? (
                      <>
                        <div className="quiz-header">
                          <h3>{lessonContent.quiz.title}</h3>
                          {lessonContent.quiz.instructions && (
                            <p className="quiz-instructions">
                              {lessonContent.quiz.instructions}
                            </p>
                          )}
                          <div className="quiz-info">
                            {lessonContent.quiz.time_limit && (
                              <div className="time-limit">
                                ⏰ Time Limit: {lessonContent.quiz.time_limit} minutes
                              </div>
                            )}
                            {lessonContent.quiz.passing_score && (
                              <div className="passing-score">
                                🎯 Passing Score: {lessonContent.quiz.passing_score}%
                              </div>
                            )}
                          </div>
                        </div>

                        {!quizSubmitted && !quizResults ? (
                          <div className="quiz-questions">
                            {lessonContent.quiz.questions.map((question, index) => (
                              <div key={question.question_id} className="question-item">
                                <h4>Question {index + 1}</h4>
                                <p className="question-text">{question.question_text}</p>
                                
                                {question.question_type === 'multiple_choice' && question.options && (
                                  <div className="question-options">
                                    {Object.entries(question.options).map(([key, value]) => (
                                      <label key={key} className="option-label">
                                        <input
                                          type="radio"
                                          name={`question_${question.question_id}`}
                                          value={key}
                                          checked={quizAnswers[question.question_id] === key}
                                          onChange={(e) => handleQuizAnswer(question.question_id, e.target.value)}
                                        />
                                        <span className="option-text">{value}</span>
                                      </label>
                                    ))}
                                  </div>
                                )}
                                
                                {question.question_type === 'text' && (
                                  <div className="text-input">
                                    <textarea
                                      placeholder="Enter your answer..."
                                      value={quizAnswers[question.question_id] || ''}
                                      onChange={(e) => handleQuizAnswer(question.question_id, e.target.value)}
                                      rows={3}
                                    />
                                  </div>
                                )}
                              </div>
                            ))}
                            
                            <div className="quiz-actions">
                              <button
                                onClick={submitQuiz}
                                className="submit-quiz-btn"
                                disabled={Object.keys(quizAnswers).length < lessonContent.quiz.questions.length}
                              >
                                Submit Quiz
                              </button>
                            </div>
                          </div>
                        ) : quizResults ? (
                          <div className="quiz-results">
                            <div className="results-header">
                              <h3>Quiz Results</h3>
                              <div className={`score-display ${quizResults.passed ? 'passed' : 'failed'}`}>
                                <span className="score">{quizResults.score}%</span>
                                <span className="status">
                                  {quizResults.passed ? '✓ Passed' : '✗ Failed'}
                                </span>
                              </div>
                            </div>
                            
                            <div className="score-breakdown">
                              <p>You scored {quizResults.earnedPoints} out of {quizResults.totalPoints} points</p>
                              {!quizResults.passed && (
                                <p className="retry-message">
                                  You need {quizResults.passingScore}% to pass. You can retake this quiz.
                                </p>
                              )}
                            </div>

                            <div className="question-results">
                              {quizResults.results && quizResults.results.map((result, index) => (
                                <div key={result.question_id} className={`result-item ${result.is_correct ? 'correct' : 'incorrect'}`}>
                                  <h4>Question {index + 1}</h4>
                                  <p><strong>Your Answer:</strong> {result.user_answer}</p>
                                  <p><strong>Correct Answer:</strong> {result.correct_answer}</p>
                                  <span className="result-indicator">
                                    {result.is_correct ? '✓ Correct' : '✗ Incorrect'}
                                  </span>
                                </div>
                              ))}
                            </div>

                            {!quizResults.passed && (
                              <div className="retry-actions">
                                <button
                                  onClick={() => {
                                    setQuizResults(null);
                                    setQuizSubmitted(false);
                                    setQuizAnswers({});
                                  }}
                                  className="retry-quiz-btn"
                                >
                                  Retake Quiz
                                </button>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="quiz-submitting">
                            <div className="loading-spinner"></div>
                            <p>Submitting quiz...</p>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="no-content">
                        <p>Quiz content not available</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="welcome-message">
              <h2>Welcome to {courseData.title}</h2>
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
                  <strong>{calculateProgress()}%</strong>
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
