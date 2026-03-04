import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useLocation } from "react-router-dom";
import SplashScreen from "./splash";
import Login from "./login";
import StudentDashboard from "./StudentDashboard";
import TeacherDashboard from "./TeacherDashboard";
import ViewDetails from "./ViewDetails";
import StudentPerformanceTracker from "./StudentPerformanceTracker";
import AIStudentReport from "./AIStudentReport";
import AdminDashboard from "./AdminDashboard"; // import admin dashboard
import ParentDashboard from "./ParentDashboard";
import InstitutionProfile from "./InstitutionProfile";

// Wrapper component to handle location state
function StudentPerformanceTrackerWrapper() {
  const location = useLocation();
  const student = location.state?.student;
  
  if (!student) {
    return <div>No student selected. Please go back and select a student.</div>;
  }
  
  return (
    <StudentPerformanceTracker 
      student={student} 
      onBack={() => window.history.back()} 
    />
  );
}

// Wrapper component for AI Student Report
function AIStudentReportWrapper() {
  const location = useLocation();
  const student = location.state?.student;
  
  if (!student) {
    return <div>No student selected. Please go back and select a student.</div>;
  }
  
  return (
    <AIStudentReport 
      student={student} 
      onBack={() => window.history.back()} 
    />
  );
}

function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000); // 3 seconds splash
    return () => clearTimeout(timer); // cleanup
  }, []);

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<StudentDashboard />} />
        <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} /> {/* new */}
        <Route path="/view-details" element={<ViewDetails />} />
        <Route path="/student-performance" element={<StudentPerformanceTrackerWrapper />} />
        <Route path="/ai-student-report" element={<AIStudentReportWrapper />} />
        <Route path="/institution-profile/:institutionName" element={<InstitutionProfile />} />
        <Route path="/parent-dashboard" element={<ParentDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
