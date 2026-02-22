import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate, Link } from "react-router-dom";
import { LEVEL_CONFIG, getLevelName } from "./levelConfig";

// ---------------- Styled Components ----------------
const Container = styled.div`
  display: flex;
  min-height: 100vh;
  font-family: 'Quicksand', cursive;
`;

const Sidebar = styled.aside`
  width: 16rem;
  background-color: #fff;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
`;

const Logo = styled.h1`
  padding: 1.5rem;
  font-family: 'Fredoka', cursive;
  font-weight: 700;
  font-size: 2.5rem;
  gap: 0.1rem;
  text-shadow: -1px -1px 0 rgba(255,255,255,0.6),
    1px -1px 0 rgba(255,255,255,0.6),
    -1px 1px 0 rgba(255,255,255,0.6),
    1px 1px 0 rgba(255,255,255,0.6),
    2px 4px 6px rgba(0,0,0,0.3);
`;

const Role = styled.p`
  padding: 0 1.5rem 1.5rem;
  font-size: 0.875rem;
  color: #6b7280;
`;

const Nav = styled.nav`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 0 1rem;
`;

const NavLink = styled.a`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  margin-bottom: 0.25rem;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.875rem;
  color: ${(props) => (props.active ? "#fff" : "#374151")};
  background-color: ${(props) => (props.active ? "#389cfa" : "transparent")};
  &:hover {
    background-color: ${(props) => (props.active ? "#389cfa" : "#e0f2fe")};
  }
`;

const Main = styled.main`
  flex: 1;
  background-color: #ebf5ff;
  padding: 2rem;
`;

const Header = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
`;

const Tabs = styled.div`
  display: flex;
  border-bottom: 2px solid #e5e7eb;
  margin-bottom: 1.5rem;
`;

const Tab = styled.a`
  margin-right: 2rem;
  padding-bottom: 0.5rem;
  font-weight: 500;
  font-size: 0.875rem;
  color: ${(props) => (props.active ? "#389cfa" : "#6b7280")};
  border-bottom: 2px solid ${(props) => (props.active ? "#389cfa" : "transparent")};
  text-decoration: none;
  cursor: pointer;
`;

const SearchWrapper = styled.div`
  position: relative;
  margin-bottom: 1.5rem;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.5rem 0.75rem 0.5rem 2.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  &:focus {
    outline: none;
    border-color: #389cfa;
    box-shadow: 0 0 0 1px #389cfa;
  }
`;

const TableWrapper = styled.div`
  background-color: #fff;
  border-radius: 0.75rem;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: left;
  padding: 0.75rem 1.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  color: #6b7280;
  border-bottom: 1px solid #e5e7eb;
`;

const Td = styled.td`
  padding: 0.75rem 1.5rem;
  font-size: 0.875rem;
  color: #374151;
  border-bottom: 1px solid #e5e7eb;
`;

const Avatar = styled.img`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 9999px;
  margin-right: 0.75rem;
`;

const ActionLink = styled.a`
  color: #389cfa;
  text-decoration: none;
  &:hover {
    color: #1d6fe1;
  }
`;

const Form = styled.form`
  background: #fff;
  padding: 2rem;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 4px rgba(0,0,0,0.05);
  max-width: 600px;
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  font-weight: 500;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  &:focus {
    outline: none;
    border-color: #389cfa;
    box-shadow: 0 0 0 1px #389cfa;
  }
`;

const SubmitButton = styled.button`
  background: #389cfa;
  color: #fff;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  &:hover {
    background: #1d6fe1;
  }
`;

// No static data - students will be added through the form

// ---------------- Main Component ----------------
export default function TeacherDashboard() {
  // Load students from localStorage or start with empty array
  const [students, setStudents] = useState(() => {
    const savedStudents = localStorage.getItem('teacherStudents');
    return savedStudents ? JSON.parse(savedStudents) : [];
  });
  const [activeTab, setActiveTab] = useState("view"); // "view" or "add"
  const [activeSidebar, setActiveSidebar] = useState("students"); // "students" or "reports"
  const [newStudent, setNewStudent] = useState({
    name: "",
    photo: "",
    age: "",
    mentalAge: "",
    parent: "",
    emergencyContact: "",
    studentId: "",
    grade: "",
    level: "",
    password: "",
  });
  const [reportFile, setReportFile] = useState(null);
  const navigate = useNavigate();
  // Institutions list for the select
  const [institutions, setInstitutions] = useState([]);
  const [institutionsLoading, setInstitutionsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewStudent((prev) => ({ ...prev, [name]: value }));
  };

  // Save students to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('teacherStudents', JSON.stringify(students));
  }, [students]);

  // Fetch institutions to populate the select
  useEffect(() => {
    const fetchInstitutions = async () => {
      setInstitutionsLoading(true);
      try {
        const res = await fetch('http://localhost:5000/api/institutions');
        const data = await res.json();
        if (res.ok) setInstitutions(data.institutions || []);
      } catch (e) {
        console.error('Failed to fetch institutions for teacher form:', e);
      } finally {
        setInstitutionsLoading(false);
      }
    };
    fetchInstitutions();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Format the student data before adding
    const formattedStudent = {
      ...newStudent,
      age: `${newStudent.age} years`,
      level: newStudent.level.startsWith('Level') ? newStudent.level : `Level ${newStudent.level}`,
      avatar: newStudent.photo || "https://via.placeholder.com/150"
    };
    
    console.log('Adding student with institution:', formattedStudent.institution);
    console.log('Full student data:', formattedStudent);
    
    setStudents((prev) => [...prev, formattedStudent]);
    setNewStudent({
      name: "",
      photo: "",
      age: "",
      mentalAge: "",
      parent: "",
      emergencyContact: "",
      studentId: "",
      grade: "",
      level: "",
      password: "",
    });
    setActiveTab("view");
  };

  const handleReportUpload = (e) => {
    e.preventDefault();
    if (reportFile) {
      alert(`Report file "${reportFile.name}" uploaded successfully!`);
      setReportFile(null);
    }
  };

  return (
    <Container>
      <Sidebar>
        <Logo>
          <span style={{ color: "#FF0000" }}>G</span>
          <span style={{ color: "#FFFF00" }}>e</span>
          <span style={{ color: "#008000" }}>s</span>
          <span style={{ color: "#0000FF" }}>t</span>
          <span style={{ color: "#800080" }}>u</span>
          <span style={{ color: "#FFC0CB" }}>r</span>
          <span style={{ color: "#FFA500" }}>a</span>
        </Logo>
        <Role>Teacher</Role>
        <Nav>
          <NavLink
            href="#"
            active={activeSidebar === "students"}
            onClick={() => setActiveSidebar("students")}
          >
            Students
          </NavLink>
          <NavLink
            href="#"
            active={activeSidebar === "reports"}
            onClick={() => setActiveSidebar("reports")}
          >
            Reports
          </NavLink>
        </Nav>
      </Sidebar>

      <Main>
        {activeSidebar === "students" ? (
          <>
            <Header>Students</Header>
            <Tabs>
              <Tab active={activeTab === "view"} onClick={() => setActiveTab("view")}>
                View Student Details
              </Tab>
              <Tab active={activeTab === "add"} onClick={() => setActiveTab("add")}>
                Add New Student
              </Tab>
            </Tabs>

            {activeTab === "view" ? (
              <>
                <SearchWrapper>
                  <SearchInput placeholder="Search students" />
                </SearchWrapper>
                {students.length === 0 ? (
                  <div style={{ 
                    textAlign: "center", 
                    padding: "3rem", 
                    background: "white", 
                    borderRadius: "0.5rem",
                    color: "#6b7280"
                  }}>
                    <h3 style={{ fontSize: "1.25rem", marginBottom: "0.5rem", color: "#374151" }}>
                      No Students Yet
                    </h3>
                    <p style={{ marginBottom: "1rem" }}>
                      You haven't added any students yet. Click "Add New Student" to get started!
                    </p>
                    <button
                      onClick={() => setActiveTab("add")}
                      style={{
                        background: "#389cfa",
                        color: "white",
                        padding: "0.75rem 1.5rem",
                        borderRadius: "0.5rem",
                        border: "none",
                        cursor: "pointer",
                        fontWeight: "600"
                      }}
                    >
                      Add Your First Student
                    </button>
                  </div>
                ) : (
                  <TableWrapper>
                    <Table>
                      <thead>
                        <tr>
                          <Th>Student</Th>
                          <Th>Mental Age</Th>
                          <Th>Learning Level</Th>
                          <Th>Actions</Th>
                        </tr>
                      </thead>
                      <tbody>
                        {students.map((student, index) => (
                          <tr key={index}>
                            <Td>
                              <div style={{ display: "flex", alignItems: "center" }}>
                                <Avatar src={student.photo || student.avatar || ""} />
                                <span>{student.name}</span>
                              </div>
                            </Td>
                            <Td>{student.mentalAge || student.age}</Td>
                            <Td>{getLevelName(parseInt(student.level.replace('Level ', '')))}</Td>
                            <Td>
                              <ActionLink 
                                as={Link} 
                                to="/view-details" 
                                state={{ student }}
                              >
                                View Details
                              </ActionLink>
                            </Td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </TableWrapper>
                )}
              </>
            ) : (
              <Form onSubmit={handleSubmit}>
                {/* Student form fields as before */}
                <FormGroup>
                  <Label>Student Name</Label>
                  <Input name="name" value={newStudent.name} onChange={handleChange} required />
                </FormGroup>
                <FormGroup>
                  <Label>Student Photo URL (optional)</Label>
                  <Input
                    name="photo"
                    type="text"
                    placeholder="Enter photo URL or leave blank for default"
                    value={newStudent.photo}
                    onChange={handleChange}
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Age</Label>
                  <Input 
                    name="age" 
                    type="number"
                    min="1"
                    max="20"
                    placeholder="Enter age"
                    value={newStudent.age} 
                    onChange={handleChange} 
                    required 
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Mental Age</Label>
                  <Input 
                    name="mentalAge" 
                    type="number"
                    min="1"
                    max="20"
                    placeholder="Enter mental age"
                    value={newStudent.mentalAge} 
                    onChange={handleChange} 
                    required 
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Parent Name</Label>
                  <Input name="parent" value={newStudent.parent} onChange={handleChange} required />
                </FormGroup>
                <FormGroup>
                  <Label>Emergency Contact Number</Label>
                  <Input name="emergencyContact" value={newStudent.emergencyContact} onChange={handleChange} required />
                </FormGroup>
                <FormGroup>
                  <Label>Student ID</Label>
                  <Input name="studentId" value={newStudent.studentId} onChange={handleChange} required />
                </FormGroup>
                <FormGroup>
                  <Label>Password (for student login)</Label>
                  <Input 
                    name="password" 
                    type="password"
                    placeholder="Set password for student"
                    value={newStudent.password} 
                    onChange={handleChange} 
                    required 
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Grade</Label>
                  <Input name="grade" value={newStudent.grade} onChange={handleChange} required />
                </FormGroup>
                <FormGroup>
                  <Label>Game Level</Label>
                  <select
                    name="level"
                    value={newStudent.level}
                    onChange={handleChange}
                    required
                    style={{
                      width: "100%",
                      padding: "0.5rem 0.75rem",
                      border: "1px solid #d1d5db",
                      borderRadius: "0.5rem",
                      fontFamily: "'Quicksand', cursive"
                    }}
                  >
                    <option value="">Select Level</option>
                    {Object.entries(LEVEL_CONFIG).map(([levelNum, config]) => (
                      <option key={levelNum} value={levelNum}>
                        Level {levelNum} - {config.name}
                      </option>
                    ))}
                  </select>
                </FormGroup>
                <SubmitButton type="submit">Add Student</SubmitButton>
              </Form>
            )}
          </>
        ) : (
          <>
            <Header>Upload Report</Header>
            <Form onSubmit={handleReportUpload}>
              <FormGroup>
                <Label>Report File</Label>
                <Input
                  type="file"
                  onChange={(e) => setReportFile(e.target.files[0])}
                  required
                />
              </FormGroup>
              <SubmitButton type="submit">Upload Report</SubmitButton>
            </Form>
          </>
        )}
      </Main>
    </Container>
  );
}

