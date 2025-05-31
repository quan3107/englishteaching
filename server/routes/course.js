// Course API Routes - Educational Implementation
// This file demonstrates several advanced backend patterns:
// 1. Authentication middleware for route protection
// 2. Complex SQL JOINs for relational data fetching
// 3. Data transformation from flat SQL results to nested JSON
// 4. RESTful API design with proper HTTP status codes

import express from "express"
import db from "./db-access.js";

const router = express.Router();

// Authentication Middleware Pattern
// This middleware runs before ALL routes in this file, acting as a security gate
// It demonstrates the "middleware pattern" - code that runs between the request and response
router.use((req, res, next) => {
    if (req.isAuthenticated()) {
        next(); // Allow request to continue to the actual route handler
    } else {
        res.json({message: "You are not logged in"}) // Block unauthorized access
    }
});

// GET Route Pattern: Dynamic Parameters and Authorization
// This route demonstrates several key patterns:
// 1. Dynamic URL parameters (:courseId) - accessed via req.params
// 2. Authorization checks - verifying student enrollment before data access
// 3. Complex data aggregation from multiple related tables
router.get("/api/course/:courseId", async (req, res) => {
    console.log(`Fetching course structure for courseId: ${req.params.courseId}`);
    
    // Extract route parameters and user data from the request
    const courseId = req.params.courseId;  // URL parameter from /api/course/:courseId
    const studentId = req.user.sid;        // User data from authentication middleware

    try {
        // SECURITY PATTERN: Authorization Before Data Access
        // Always verify user permissions before returning sensitive data
        // This prevents students from accessing courses they're not enrolled in
        const enrollmentResult = await db.query(
            "SELECT enrollment_id FROM enrollments WHERE student_id = $1 AND course_id = $2", 
            [studentId, courseId]
        );
        
        if (enrollmentResult.rows.length === 0) {
            return res.status(403).json({message: "You are not enrolled in this course"});
        }        // COMPLEX SQL PATTERN: Multi-table JOIN with LEFT JOINs
        // This query demonstrates how to fetch hierarchical data (course > modules > lessons)
        // LEFT JOINs ensure we get courses even if they have no modules/lessons
        // The query also includes student progress data for personalization
        const courseQuery = `
            SELECT 
                -- Course information
                c.course_id,
                c.title as course_title,
                c.description as course_description,
                -- Module information
                cm.module_id,
                cm.title as module_title,
                cm.description as module_description,
                cm.order_index as module_order,
                -- Lesson information
                l.lesson_id,
                l.title as lesson_title,
                l.lesson_type,
                l.order_index as lesson_order,
                -- Student progress (personalized data)
                slp.completed,
                slp.score,
                slp.completion_date
            FROM courses c
            LEFT JOIN course_modules cm ON c.course_id = cm.course_id
            LEFT JOIN lessons l ON cm.module_id = l.module_id
            LEFT JOIN student_lesson_progress slp ON l.lesson_id = slp.lesson_id AND slp.student_id = $2
            WHERE c.course_id = $1
            ORDER BY cm.order_index, l.order_index  -- Ensures proper hierarchical ordering
        `;
        
        const courseResult = await db.query(courseQuery, [courseId, studentId]);
          if (courseResult.rows.length === 0) {
            return res.status(404).json({message: "Course not found"});
        }

        // DATA TRANSFORMATION PATTERN: Flat SQL Results → Nested JSON Structure
        // SQL JOINs return flat rows, but our frontend needs hierarchical data
        // This is a common backend responsibility: reshaping data for optimal frontend consumption
        
        // Step 1: Create the top-level course object
        const courseData = {
            course_id: courseResult.rows[0].course_id,
            title: courseResult.rows[0].course_title,
            description: courseResult.rows[0].course_description,
            modules: []  // Will be populated with nested module/lesson data
        };

        // Step 2: Use Map for efficient grouping and deduplication
        // Map provides O(1) lookup time and prevents duplicate modules
        const moduleMap = new Map();
          // Step 3: Process each row to build the hierarchical structure
        // This loop demonstrates the "group by" pattern for relational data
        courseResult.rows.forEach(row => {
            // Create module if it doesn't exist (deduplication)
            if (row.module_id && !moduleMap.has(row.module_id)) {
                moduleMap.set(row.module_id, {
                    module_id: row.module_id,
                    title: row.module_title,
                    description: row.module_description,
                    order_index: row.module_order,
                    lessons: []  // Each module contains an array of lessons
                });
            }
            
            // Add lesson to its parent module (with deduplication check)
            if (row.lesson_id && moduleMap.has(row.module_id)) {
                const module = moduleMap.get(row.module_id);
                const existingLesson = module.lessons.find(lesson => lesson.lesson_id === row.lesson_id);
                
                // Only add lesson if it doesn't already exist (prevents duplicates from JOINs)
                if (!existingLesson) {
                    module.lessons.push({
                        lesson_id: row.lesson_id,
                        title: row.lesson_title,
                        lesson_type: row.lesson_type,
                        order_index: row.lesson_order,
                        // Student progress data (personalization)
                        completed: row.completed || false,
                        score: row.score,
                        completion_date: row.completion_date
                    });
                }
            }
        });

        // Step 4: Convert Map to Array and sort by order_index
        // Frontend needs arrays, not Maps, for easy rendering
        courseData.modules = Array.from(moduleMap.values())
            .sort((a, b) => a.order_index - b.order_index);

        // Return the structured, hierarchical data
        res.json(courseData);        
    } catch (err) {
        // ERROR HANDLING PATTERN: Log for debugging, return user-friendly message
        // Never expose internal error details to the frontend for security
        console.error("Error fetching course structure:", err);
        res.status(500).json({message: "Error fetching course details"});
    }
})

// INDIVIDUAL RESOURCE PATTERN: Fetch detailed content for a specific lesson
// This route demonstrates fetching different content types based on lesson_type
router.get("/api/lesson/:lessonId", async (req, res) => {
    const lessonId = req.params.lessonId;
    const studentId = req.user.sid;

    try {
        // SECURITY PATTERN: Indirect Authorization Check
        // Instead of just checking if lesson exists, verify the student has access
        // through their course enrollment (multi-table authorization)
        const accessQuery = `
            SELECT l.lesson_id 
            FROM lessons l
            JOIN course_modules cm ON l.module_id = cm.module_id
            JOIN enrollments e ON cm.course_id = e.course_id
            WHERE l.lesson_id = $1 AND e.student_id = $2
        `;
        
        const accessResult = await db.query(accessQuery, [lessonId, studentId]);
        
        if (accessResult.rows.length === 0) {
            return res.status(403).json({message: "Access denied to this lesson"});
        }        // Get basic lesson information with context (course and module names)
        // This query provides breadcrumb information for the frontend
        const lessonQuery = `
            SELECT 
                l.lesson_id,
                l.title,
                l.lesson_type,
                l.order_index,
                cm.title as module_title,
                c.title as course_title
            FROM lessons l
            JOIN course_modules cm ON l.module_id = cm.module_id
            JOIN courses c ON cm.course_id = c.course_id
            WHERE l.lesson_id = $1
        `;
        
        const lessonResult = await db.query(lessonQuery, [lessonId]);
        
        if (lessonResult.rows.length === 0) {
            return res.status(404).json({message: "Lesson not found"});
        }

        const lesson = lessonResult.rows[0];
        
        // POLYMORPHIC CONTENT PATTERN: Different content types for different lesson types
        // This demonstrates how to handle different data structures based on a type field
        if (lesson.lesson_type === 'reading') {
            // READING LESSONS: Fetch associated reading materials
            const readingQuery = `
                SELECT reading_id, title, reading_url, description, estimated_time
                FROM lesson_readings 
                WHERE lesson_id = $1
            `;
            const readingResult = await db.query(readingQuery, [lessonId]);
            lesson.readings = readingResult.rows;
            
        } else if (lesson.lesson_type === 'quiz') {
            // QUIZ LESSONS: Fetch quiz with questions (more complex structure)
            const quizQuery = `
                SELECT 
                    lq.quiz_id,
                    lq.title as quiz_title,
                    lq.instructions,
                    lq.time_limit,
                    lq.passing_score,
                    qq.question_id,
                    qq.question_text,
                    qq.question_type,
                    qq.options,
                    qq.points,
                    qq.order_index
                FROM lesson_quizzes lq
                LEFT JOIN quiz_questions qq ON lq.quiz_id = qq.quiz_id
                WHERE lq.lesson_id = $1
                ORDER BY qq.order_index
            `;
            const quizResult = await db.query(quizQuery, [lessonId]);
            
            if (quizResult.rows.length > 0) {
                // Transform flat quiz data into nested structure
                const quiz = {
                    quiz_id: quizResult.rows[0].quiz_id,
                    title: quizResult.rows[0].quiz_title,
                                        instructions: quizResult.rows[0].instructions,
                    time_limit: quizResult.rows[0].time_limit,
                    passing_score: quizResult.rows[0].passing_score,
                    // Filter and map questions (handling LEFT JOIN results)
                    questions: quizResult.rows
                        .filter(row => row.question_id)  // Remove empty rows from LEFT JOIN
                        .map(row => ({
                            question_id: row.question_id,
                            question_text: row.question_text,
                            question_type: row.question_type,
                            options: row.options,  // JSON field containing answer choices
                            points: row.points,
                            order_index: row.order_index
                        }))
                };
                lesson.quiz = quiz;
            }
        }

        // PERSONALIZATION PATTERN: Add student-specific progress data
        // This makes the lesson content personalized for each student
        const progressQuery = `
            SELECT completed, score, completion_date, time_spent
            FROM student_lesson_progress 
            WHERE lesson_id = $1 AND student_id = $2
        `;
        const progressResult = await db.query(progressQuery, [lessonId, studentId]);
        
        // Provide default progress if none exists (new lesson for student)
        lesson.progress = progressResult.rows.length > 0 ? progressResult.rows[0] : {
            completed: false,
            score: null,
            completion_date: null,
            time_spent: 0
        };

        res.json(lesson);        
    } catch (err) {
        console.error("Error fetching lesson content:", err);
        res.status(500).json({message: "Error fetching lesson content"});
    }
})

// POST ROUTE PATTERN: Updating State (Progress Tracking)
// This demonstrates the "upsert" pattern - update if exists, insert if not
router.post("/api/lesson/:lessonId/complete", async (req, res) => {
    const lessonId = req.params.lessonId;
    const studentId = req.user.sid;
    const { score, timeSpent } = req.body;  // Data from request body

    try {
        // UPSERT PATTERN: Check if record exists, then update or insert
        // This is necessary because a student might complete a lesson multiple times
        const existingProgress = await db.query(
            "SELECT progress_id FROM student_lesson_progress WHERE lesson_id = $1 AND student_id = $2",
            [lessonId, studentId]
        );

        if (existingProgress.rows.length > 0) {
            // UPDATE: Record exists, so update completion status
            await db.query(`
                UPDATE student_lesson_progress 
                SET completed = true, 
                    completion_date = CURRENT_TIMESTAMP,  -- SQL function for current time
                    score = $3,
                    time_spent = COALESCE(time_spent, 0) + $4  -- Add to existing time, handle NULL
                WHERE lesson_id = $1 AND student_id = $2
            `, [lessonId, studentId, score, timeSpent || 0]);
        } else {
            // INSERT: No record exists, create new progress record
            await db.query(`
                INSERT INTO student_lesson_progress (student_id, lesson_id, completed, completion_date, score, time_spent)
                VALUES ($1, $2, true, CURRENT_TIMESTAMP, $3, $4)
            `, [studentId, lessonId, score, timeSpent || 0]);
        }

        res.json({message: "Lesson marked as completed", success: true});        
    } catch (err) {
        console.error("Error updating lesson progress:", err);
        res.status(500).json({message: "Error updating progress"});
    }
})

// COMPLEX BUSINESS LOGIC PATTERN: Quiz Processing and Scoring
// This route demonstrates automatic grading, score calculation, and detailed feedback
router.post("/api/lesson/:lessonId/submit-quiz", async (req, res) => {
    const lessonId = req.params.lessonId;
    const studentId = req.user.sid;
    const { answers, timeSpent } = req.body;  // answers = {questionId: selectedAnswer, ...}

    try {
        // Fetch quiz questions with correct answers for scoring
        // Note: We need correct_answer for grading, but never send it to frontend during quiz
        const quizQuery = `
            SELECT 
                lq.quiz_id,
                lq.passing_score,
                qq.question_id,
                qq.correct_answer,  -- Only accessed server-side for grading
                qq.points
            FROM lesson_quizzes lq
            JOIN quiz_questions qq ON lq.quiz_id = qq.quiz_id
            WHERE lq.lesson_id = $1
            ORDER BY qq.order_index
        `;
        
        const quizResult = await db.query(quizQuery, [lessonId]);
        
        if (quizResult.rows.length === 0) {
            return res.status(404).json({message: "Quiz not found"});
        }

        // SCORING ALGORITHM: Calculate points and provide detailed feedback
        let totalPoints = 0;
        let earnedPoints = 0;
        const results = [];  // Detailed results for each question

        quizResult.rows.forEach(question => {
            totalPoints += question.points;
            const userAnswer = answers[question.question_id];
            const isCorrect = userAnswer === question.correct_answer;
            
            if (isCorrect) {
                earnedPoints += question.points;
            }
            
            // Build detailed feedback for frontend
            results.push({
                question_id: question.question_id,
                user_answer: userAnswer,
                correct_answer: question.correct_answer,
                is_correct: isCorrect,
                points_earned: isCorrect ? question.points : 0
            });
        });

        // Calculate percentage score and determine pass/fail
        const scorePercentage = Math.round((earnedPoints / totalPoints) * 100);
        const passingScore = quizResult.rows[0].passing_score;
        const passed = scorePercentage >= passingScore;

        // Update student progress with quiz results (using same upsert pattern)
        const existingProgress = await db.query(
            "SELECT progress_id FROM student_lesson_progress WHERE lesson_id = $1 AND student_id = $2",
            [lessonId, studentId]
        );

        if (existingProgress.rows.length > 0) {
            await db.query(`
                UPDATE student_lesson_progress 
                SET completed = $3,  -- Only mark completed if passed
                    completion_date = CURRENT_TIMESTAMP,
                    score = $4,
                    time_spent = COALESCE(time_spent, 0) + $5
                WHERE lesson_id = $1 AND student_id = $2
            `, [lessonId, studentId, passed, scorePercentage, timeSpent || 0]);
        } else {
            await db.query(`
                INSERT INTO student_lesson_progress (student_id, lesson_id, completed, completion_date, score, time_spent)
                VALUES ($1, $2, $3, CURRENT_TIMESTAMP, $4, $5)
            `, [studentId, lessonId, passed, scorePercentage, timeSpent || 0]);
        }

        // Return comprehensive quiz results for frontend display
        res.json({
            success: true,
            score: scorePercentage,
            totalPoints,
            earnedPoints,
            passed,
            passingScore,
            results  // Detailed question-by-question feedback
        });        
    } catch (err) {
        console.error("Error submitting quiz:", err);
        res.status(500).json({message: "Error submitting quiz"});
    }
})

// EXPORT PATTERN: ES6 Module Export
// This makes the router available for import in other files (like server.js)
// The router contains all the route handlers and middleware defined above
export default router;

/* 
 * === SUMMARY OF PATTERNS DEMONSTRATED ===
 * 
 * 1. MIDDLEWARE PATTERN: Authentication guard for all routes
 * 2. DYNAMIC ROUTING: URL parameters (:courseId, :lessonId)
 * 3. AUTHORIZATION: Multi-level security checks (authentication + enrollment)
 * 4. COMPLEX SQL JOINS: Multi-table data aggregation
 * 5. DATA TRANSFORMATION: Flat SQL results → Hierarchical JSON
 * 6. POLYMORPHIC CONTENT: Different data structures based on type
 * 7. UPSERT PATTERN: Update if exists, insert if not
 * 8. BUSINESS LOGIC: Quiz scoring and automatic grading
 * 9. ERROR HANDLING: Consistent error responses and logging
 * 10. PERSONALIZATION: User-specific data (progress, scores)
 * 
 * These patterns are fundamental to building robust, secure, and scalable APIs
 * for educational platforms and similar data-driven applications.
 */