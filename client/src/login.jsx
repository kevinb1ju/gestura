import React, { useState } from "react";
import API_URL from "./config";
import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";

// ---------- Animations ----------
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

// ---------- Styled Components ----------
const Wrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
  background-color: #87ceeb;
  font-family: "Quicksand", cursive;
  color: #0f172a;
`;

const Background = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;
`;

const Sun = styled.div`
  position: absolute;
  top: -8rem;
  right: -8rem;
  width: 20rem;
  height: 20rem;
  background: #fde047;
  border-radius: 50%;
  animation: ${spin} 25s linear infinite;
`;

const Cloud = styled.div`
  position: absolute;
  background: white;
  border-radius: 9999px;
  opacity: ${(p) => p.opacity || 0.8};
  width: ${(p) => p.w || "10rem"};
  height: ${(p) => p.h || "5rem"};
  top: ${(p) => p.top};
  left: ${(p) => p.left};
  right: ${(p) => p.right};
  filter: blur(${(p) => p.blur || "0px"});
`;

const HillsContainer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 30%;
  overflow: hidden;
  background: linear-gradient(to top, #34a853, #67b346);
`;

const Hill = styled.div`
  position: absolute;
  bottom: 0;
  width: ${(p) => p.w};
  height: ${(p) => p.h};
  background: ${(p) => p.color};
  border-radius: 50% 50% 0 0;
  opacity: ${(p) => p.opacity || 1};
  left: ${(p) => p.left};
  right: ${(p) => p.right};
`;

const Card = styled.div`
  position: relative;
  z-index: 10;
  max-width: 28rem;
  width: 100%;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 1rem;
  box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.07);
  padding: 2rem;
  animation: ${fadeIn} 1s ease-out;
`;

const LogoText = styled.h1`
  font-family: "Fredoka", cursive;
  font-size: clamp(3rem, 7vw, 5rem);
  text-align: center;
  text-shadow: -1px -1px 0 rgba(255, 255, 255, 0.6),
    1px -1px 0 rgba(255, 255, 255, 0.6), -1px 1px 0 rgba(255, 255, 255, 0.6),
    1px 1px 0 rgba(255, 255, 255, 0.6), 2px 4px 6px rgba(0, 0, 0, 0.1);
`;

const ColoredSpan = styled.span`
  color: ${(p) => p.color};
`;

// ---------- Role Selector ----------
const RoleSwitch = styled.div`
  position: relative;
  display: flex;
  background: rgba(186, 230, 253, 0.7);
  padding: 0.25rem;
  border-radius: 9999px;
  border: 1px solid rgba(186, 230, 253, 0.8);
  margin-bottom: 1.5rem;
  overflow: hidden;
`;

const Highlight = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  width: ${props => props.adminVisible ? '25%' : '33.33%'};
  background: #fbbf24;
  border-radius: 9999px;
  transition: transform 0.4s ease;
  transform: translateX(
    ${(p) =>
      p.role === "student"
        ? "0%"
        : p.role === "teacher"
        ? "100%"
        : p.role === "parent"
        ? "200%"
        : "300%"}
  );
`;

const RoleButton = styled.button`
  flex: 1;
  padding: 0.7rem 0.5rem;
  border-radius: 9999px;
  font-weight: 700;
  font-size: 0.9rem;
  border: none;
  cursor: pointer;
  background: transparent;
  color: ${(p) => (p.active ? "white" : "#64748B")};
  position: relative;
  z-index: 1;
  transition: color 0.3s ease;
`;

const Input = styled.input`
  display: block;
  width: 90%;
  padding: 0.9rem 1.25rem;
  border-radius: 9999px;
  border: 1px solid #e2e8f0;
  background: rgba(255, 255, 255, 0.9);
  margin-bottom: 1rem;
  font-size: 1rem;
  &:focus {
    outline: none;
    border-color: #fbbf24;
    box-shadow: 0 0 0 2px rgba(251, 191, 36, 0.3);
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  background: #fbbf24;
  color: white;
  font-weight: 700;
  border: none;
  border-radius: 9999px;
  padding: 0.9rem;
  margin-bottom: 1rem;
  font-size: 1rem;
  transition: 0.3s ease;
  cursor: pointer;
  box-shadow: 0px 4px 10px rgba(251, 191, 36, 0.3);
  &:hover {
    background: #facc15;
    box-shadow: 0px 0px 20px rgba(251, 191, 36, 0.5);
  }
  &:disabled {
    background: #cbd5e1;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  background: #fee2e2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  text-align: center;
  animation: ${fadeIn} 0.3s ease-out;
`;

// ---------- Component ----------
const Login = ({ isAdminMode = false }) => {
  const [role, setRole] = useState(isAdminMode ? "admin" : "student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [parentName, setParentName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [studentPassword, setStudentPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Student login uses Student ID + Password
      if (role === "student") {
        const students = JSON.parse(localStorage.getItem('teacherStudents') || '[]');
        const matchingStudent = students.find(
          s => s.studentId === studentId && s.password === studentPassword
        );

        if (matchingStudent) {
          const studentUser = {
            role: "student",
            name: matchingStudent.name,
            studentId: matchingStudent.studentId,
            institution: matchingStudent.institution,
            grade: matchingStudent.grade,
            level: matchingStudent.level
          };
          
          localStorage.setItem("user", JSON.stringify(studentUser));
          navigate("/dashboard");
        } else {
          setError("Invalid Student ID or Password. Please check and try again.");
        }
        setLoading(false);
        return;
      }

      // Parent login uses different authentication
      if (role === "parent") {
        // Check localStorage for student with matching parent name and student ID
        const students = JSON.parse(localStorage.getItem('teacherStudents') || '[]');
        const matchingStudent = students.find(
          s => s.parent?.toLowerCase() === parentName.toLowerCase() && 
               s.studentId === studentId
        );

        if (matchingStudent) {
          // Create a parent user object
          const parentUser = {
            role: "parent",
            name: parentName,
            studentId: studentId,
            studentName: matchingStudent.name,
            institution: matchingStudent.institution
          };
          
          localStorage.setItem("user", JSON.stringify(parentUser));
          navigate("/parent-dashboard");
        } else {
          setError("Invalid Parent Name or Student ID. Please check and try again.");
        }
        setLoading(false);
        return;
      }

      // Regular login for teacher and admin
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Check if user role matches selected role
        if (data.user.role !== role) {
          setError("Incorrect credentials. Please select the correct role.");
          setLoading(false);
          return;
        }

        // Store token and user data
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // Navigate based on role
        if (role === "student") navigate("/dashboard");
        else if (role === "teacher") navigate("/teacher-dashboard");
        else if (role === "admin") navigate("/admin-dashboard");
      } else {
        setError(data.message || "Incorrect credentials. Please try again.");
      }
    } catch (err) {
      setError("Connection error. Please make sure the server is running.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <Wrapper>
      <Background>
        <Sun />
        <Cloud top="10%" left="5%" w="16rem" h="8rem" opacity="0.8" blur="20px" />
        <Cloud top="20%" right="10%" w="20rem" h="10rem" opacity="0.7" blur="25px" />
        <Cloud top="5%" right="40%" w="12rem" h="6rem" opacity="0.6" blur="15px" />
        <HillsContainer>
          <Hill color="#2F9C49" w="60%" h="12rem" left="-16%" opacity="0.8" />
          <Hill color="#3AA757" w="55%" h="10rem" right="-10%" opacity="0.9" />
          <Hill color="#4CAF50" w="40%" h="8rem" left="25%" opacity="0.7" />
        </HillsContainer>
      </Background>

      <Card>
        <LogoText>
          <ColoredSpan color="#FF6B6B">G</ColoredSpan>
          <ColoredSpan color="#FFD166">e</ColoredSpan>
          <ColoredSpan color="#06D6A0">s</ColoredSpan>
          <ColoredSpan color="#118AB2">t</ColoredSpan>
          <ColoredSpan color="#8338EC">u</ColoredSpan>
          <ColoredSpan color="#EF476F">r</ColoredSpan>
          <ColoredSpan color="#FF9F1C">a</ColoredSpan>
        </LogoText>

        <h2 style={{ textAlign: "center", marginTop: "1rem", fontWeight: "800", fontSize: "1.8rem" }}>
          Welcome!
        </h2>
        <p style={{ textAlign: "center", color: "#64748B", marginBottom: "1.5rem" }}>
          Select your role to get started.
        </p>

        <RoleSwitch>
          <Highlight role={role} adminVisible={isAdminMode} />
          <RoleButton active={role === "student"} onClick={() => setRole("student")}>
            Student
          </RoleButton>
          <RoleButton active={role === "teacher"} onClick={() => setRole("teacher")}>
            Teacher
          </RoleButton>
          <RoleButton active={role === "parent"} onClick={() => setRole("parent")}>
            Parent
          </RoleButton>
          {isAdminMode && (
            <RoleButton active={role === "admin"} onClick={() => setRole("admin")}>
              Admin
            </RoleButton>
          )}
        </RoleSwitch>

        <form onSubmit={handleSubmit}>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          
          {role === "student" ? (
            <>
              <Input 
                type="text" 
                placeholder="Student ID" 
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                required 
              />
              <Input 
                type="password" 
                placeholder="Password" 
                value={studentPassword}
                onChange={(e) => setStudentPassword(e.target.value)}
                required 
              />
            </>
          ) : role === "parent" ? (
            <>
              <Input 
                type="text" 
                placeholder="Parent Name" 
                value={parentName}
                onChange={(e) => setParentName(e.target.value)}
                required 
              />
              <Input 
                type="text" 
                placeholder="Student ID" 
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                required 
              />
            </>
          ) : (
            <>
              <Input 
                type="email" 
                placeholder="Email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
              <Input 
                type="password" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </>
          )}
          
          <SubmitButton type="submit" disabled={loading}>
            {loading ? "Signing In..." : "Sign In"}
          </SubmitButton>
        </form>
      </Card>
    </Wrapper>
  );
};

export default Login;
