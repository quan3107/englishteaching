import React from "react";
import {useParams} from "react-router-dom";
import CourseContent from "../components/CourseContent";
import { useAuth } from "../Routes/Auth";
import axios from "axios";

function CourseContentPage() {
    const {courseId, lessonId} = useParams();
    const {user} = useAuth();
    return (<CourseContent courseId={courseId} lessonId={lessonId}/>)
}

export default CourseContentPage;