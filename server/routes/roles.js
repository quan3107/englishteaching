// Role Management Routes
// This file provides endpoints for role-based operations including:
// 1. User role information retrieval
// 2. Teacher-to-student view switching
// 3. Role-based permission checking
// 4. User capability discovery

import express from "express";
import { 
    requireAuth, 
    requireTeacher,
    switchToStudentView, 
    switchToTeacherView, 
    getUserInfo 
} from "../middleware/roleMiddleware.js";

const router = express.Router();

// Apply authentication to all role routes
router.use(requireAuth);

// Get Current User Information and Permissions
// GET /api/roles/me
// Returns comprehensive user information including role, permissions, and current view state
router.get("/api/roles/me", getUserInfo);

// Switch to Student View (Teachers Only)
// POST /api/roles/switch-to-student
// Allows teachers to view the platform from a student perspective
router.post("/api/roles/switch-to-student", requireTeacher, switchToStudentView);

// Switch Back to Teacher View
// POST /api/roles/switch-to-teacher  
// Allows teachers to return to their normal teacher view
router.post("/api/roles/switch-to-teacher", requireTeacher, switchToTeacherView);

// Get Current View State
// GET /api/roles/view-state
// Returns information about current viewing mode (useful for UI state)
router.get("/api/roles/view-state", (req, res) => {
    res.json({
        isAuthenticated: req.isAuthenticated(),
        user: req.user ? {
            id: req.user.sid,
            role: req.user.role,
            activeRole: req.user.activeRole,
            isTeacher: req.user.isTeacher,
            isViewingAsStudent: req.user.isViewingAsStudent,
            canSwitchViews: req.user.isTeacher
        } : null
    });
});

export default router;
