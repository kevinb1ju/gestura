import { useState, useEffect } from "react";
import API_URL from "./config";
import styled, { keyframes } from "styled-components";
import { Link } from "react-router-dom";
import { 
  Users, 
  PlusCircle, 
  MessageSquare, 
  TrendingUp, 
  Award, 
  Search, 
  LayoutGrid, 
  List, 
  Send, 
  Bot, 
  X, 
  ChevronRight,
  Activity,
  Sparkles,
  Camera,
  User
} from "lucide-react";
import { LEVEL_CONFIG, getLevelName } from "./levelConfig";

// ---------------- Styled Components ----------------
const Container = styled.div`
  display: flex;
  min-height: 100vh;
  font-family: 'Quicksand', sans-serif;
  background-color: #f8fafc;
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
  cursor: pointer;
  &:hover {
    background-color: ${(props) => (props.active ? "#389cfa" : "#e0f2fe")};
  }
`;

const Main = styled.main`
  flex: 1;
  background-color: #f0f7ff;
  padding: 2rem;
  overflow-y: auto;
`;

const WelcomeHeader = styled.div`
  margin-bottom: 2rem;
  background: white;
  padding: 2rem;
  border-radius: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const WelcomeText = styled.div`
  h2 {
    font-size: 2rem;
    font-weight: 800;
    color: #1e293b;
    margin: 0;
  }
  p {
    color: #64748b;
    font-size: 1rem;
    margin-top: 0.25rem;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 1.25rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.03);
  display: flex;
  align-items: center;
  gap: 1rem;
  border-left: 6px solid ${props => props.color || '#389cfa'};
`;

const StatIcon = styled.div`
  width: 3rem;
  height: 3rem;
  border-radius: 1rem;
  background: ${props => props.bg || '#eff6ff'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.color || '#389cfa'};
`;

const StatInfo = styled.div`
  h4 {
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: #64748b;
    margin: 0;
  }
  span {
    font-size: 1.5rem;
    font-weight: 700;
    color: #1e293b;
  }
`;

const DashboardActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ViewOptions = styled.div`
  display: flex;
  gap: 0.25rem;
  background: #e2e8f0;
  padding: 0.25rem;
  border-radius: 0.75rem;
`;

const ViewButton = styled.button`
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  border: none;
  background: ${props => props.active ? 'white' : 'transparent'};
  color: ${props => props.active ? '#389cfa' : '#64748b'};
  box-shadow: ${props => props.active ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-weight: 600;
  font-size: 0.8rem;
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
`;

const StudentCard = styled.div`
  background: white;
  border-radius: 1.5rem;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  border: 1px solid #f1f5f9;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 20px -5px rgba(0, 0, 0, 0.1);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 6px;
    height: 100%;
    background: ${props => props.levelColor || '#389cfa'};
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const CardAvatar = styled.img`
  width: 4rem;
  height: 4rem;
  border-radius: 1rem;
  object-fit: cover;
  background: #f1f5f9;
`;

const CardTitle = styled.div`
  h3 {
    font-size: 1.15rem;
    font-weight: 700;
    color: #1e293b;
    margin: 0;
  }
  span {
    font-size: 0.85rem;
    color: #64748b;
  }
`;

const CardBody = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
`;

const Badge = styled.span`
  padding: 0.25rem 0.6rem;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${props => props.bg || '#f1f5f9'};
  color: ${props => props.color || '#475569'};
`;

const CardActions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  border-top: 1px solid #f1f5f9;
  padding-top: 1rem;
`;

const ActionLink = styled(Link)`
  color: #389cfa;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.4rem;
  border-radius: 0.5rem;
  transition: background 0.2s;
  &:hover {
    background: #eff6ff;
    color: #1d6fe1;
  }
`;

const TableWrapper = styled.div`
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  text-align: left;
  padding: 1rem 1.5rem;
  background: #f8fafc;
  font-size: 0.75rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  border-bottom: 1px solid #f1f5f9;
`;

const Td = styled.td`
  padding: 1rem 1.5rem;
  font-size: 0.875rem;
  color: #334155;
  border-bottom: 1px solid #f1f5f9;
`;

const Form = styled.form`
  background: white;
  padding: 2.5rem;
  border-radius: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  max-width: 800px;
  margin: 0 auto;
`;

const FormSection = styled.div`
  margin-bottom: 2rem;
  h3 {
    font-size: 1.1rem;
    font-weight: 700;
    color: #334155;
    margin-bottom: 1.25rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.85rem;
  font-weight: 600;
  color: #64748b;
`;

const Input = styled.input`
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  border: 1px solid #e2e8f0;
  font-family: inherit;
  font-size: 0.95rem;
  &:focus {
    outline: none;
    border-color: #389cfa;
    box-shadow: 0 0 0 3px rgba(56, 156, 250, 0.1);
  }
`;

const Select = styled.select`
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  border: 1px solid #e2e8f0;
  background: white;
  font-family: inherit;
  font-size: 0.95rem;
  &:focus {
    outline: none;
    border-color: #389cfa;
  }
`;

const SubmitButton = styled.button`
  background: #389cfa;
  color: white;
  padding: 0.75rem 2rem;
  border-radius: 0.75rem;
  border: none;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    background: #1d6fe1;
    transform: translateY(-1px);
  }
  &:disabled {
    background: #cbd5e1;
  }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.1); opacity: 0.7; }
  100% { transform: scale(1); opacity: 1; }
`;

const AIButton = styled.button`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 4rem;
  height: 4rem;
  border-radius: 1.25rem;
  background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
  color: white;
  border: none;
  box-shadow: 0 10px 25px -5px rgba(37, 99, 235, 0.4);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  animation: ${pulse} 3s infinite ease-in-out;
  
  &:hover {
    transform: scale(1.1) rotate(5deg);
    box-shadow: 0 15px 30px -5px rgba(37, 99, 235, 0.5);
  }
`;

const AIDrawer = styled.div`
  position: fixed;
  top: 1rem;
  right: ${props => props.open ? '1rem' : '-450px'};
  width: 400px;
  height: calc(100vh - 2rem);
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: -20px 20px 50px rgba(0,0,0,0.1);
  border-radius: 2rem;
  z-index: 100;
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const AIHeader = styled.div`
  padding: 1.5rem;
  background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  
  h3 { 
    margin: 0; 
    display: flex; 
    align-items: center; 
    gap: 0.75rem; 
    font-weight: 800;
    letter-spacing: -0.02em;
    font-size: 1.25rem;
  }
`;

const ChatBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: rgba(248, 250, 252, 0.5);

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: #e2e8f0;
    border-radius: 10px;
  }
`;

const Message = styled.div`
  max-width: 85%;
  padding: 1rem 1.25rem;
  border-radius: 1.25rem;
  font-size: 0.95rem;
  line-height: 1.5;
  animation: ${fadeIn} 0.4s ease-out;
  position: relative;
  
  ${props => props.isAi ? `
    background: white;
    color: #1e293b;
    align-self: flex-start;
    border-bottom-left-radius: 0.25rem;
    box-shadow: 0 4px 15px -3px rgba(0,0,0,0.05);
  ` : `
    background: #2563eb;
    color: white;
    align-self: flex-end;
    border-bottom-right-radius: 0.25rem;
    box-shadow: 0 4px 15px -3px rgba(37, 99, 235, 0.2);
  `}
  white-space: pre-wrap;
`;

const TypingIndicator = styled.div`
  display: flex;
  gap: 0.4rem;
  padding: 1rem 1.25rem;
  background: white;
  align-self: flex-start;
  border-radius: 1.25rem;
  border-bottom-left-radius: 0.25rem;
  box-shadow: 0 4px 15px -3px rgba(0,0,0,0.05);
  animation: ${fadeIn} 0.3s ease-out;

  span {
    width: 6px;
    height: 6px;
    background: #2563eb;
    border-radius: 50%;
    animation: ${pulse} 1.5s infinite ease-in-out;
    &:nth-child(2) { animation-delay: 0.2s; }
    &:nth-child(3) { animation-delay: 0.4s; }
  }
`;

const ChatFooter = styled.form`
  padding: 1.25rem;
  background: white;
  border-top: 1px solid #f1f5f9;
  display: flex;
  gap: 0.75rem;
  align-items: center;
`;

const ChatInput = styled.input`
  flex: 1;
  padding: 0.85rem 1.25rem;
  border-radius: 1.5rem;
  border: 1px solid #e2e8f0;
  outline: none;
  font-family: inherit;
  font-size: 0.95rem;
  transition: all 0.2s;
  background: #f8fafc;
  
  &:focus {
    background: white;
    border-color: #2563eb;
    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
  }
`;

const SendButton = styled.button`
  width: 3rem;
  height: 3rem;
  border-radius: 1rem;
  background: #2563eb;
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover:not(:disabled) {
    background: #1d4ed8;
    transform: scale(1.05);
  }
  
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

const Tabs = styled.div`
  display: flex;
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 1.5rem;
`;

export default function TeacherDashboard() {
  const [students, setStudents] = useState(() => {
    try {
      const saved = localStorage.getItem('teacherStudents');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Error parsing teacherStudents:', e);
      return [];
    }
  });
  const [activeTab, setActiveTab] = useState("view");
  const [activeSidebar, setActiveSidebar] = useState("students");
  const [viewMode, setViewMode] = useState("grid");
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { isAi: true, text: "Welcome! I'm Gestura AI. I can help you analyze student performance data. Ask me anything about your class." }
  ]);
  const [aiInput, setAiInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const [newStudent, setNewStudent] = useState({
    name: "", age: "", mentalAge: "", parent: "", emergencyContact: "",
    studentId: "", grade: "", level: "1", password: "", photo: ""
  });
  const [reportFile, setReportFile] = useState(null);

  useEffect(() => {
    localStorage.setItem('teacherStudents', JSON.stringify(students));
  }, [students]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewStudent(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024) { // 1MB limit for localStorage safety
        alert("Image is too large. Please select an image under 1MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewStudent(prev => ({ ...prev, photo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updated = [...students, { ...newStudent, id: Date.now() }];
    setStudents(updated);
    setActiveTab("view");
    setNewStudent({ 
      name: "", age: "", mentalAge: "", parent: "", emergencyContact: "", 
      studentId: "", grade: "", level: "1", password: "", photo: "" 
    });
  };

  const handleAiSubmit = async (e) => {
    e.preventDefault();
    if (!aiInput.trim()) return;

    const userMsg = { isAi: false, text: aiInput };
    setChatMessages(prev => [...prev, userMsg]);
    setIsTyping(true);
    const messageToSend = aiInput;
    setAiInput("");

    try {
      const res = await fetch(`${API_URL}/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageToSend,
          role: 'teacher',
          context: { students }
        })
      });
      const data = await res.json();
      
      if (data.success) {
        setChatMessages(prev => [...prev, { isAi: true, text: data.response }]);
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      console.error('AI Chat Error:', err);
      setChatMessages(prev => [...prev, { isAi: true, text: "I'm having trouble connecting to my brain right now. Please try again later!" }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleReportUpload = (e) => {
    e.preventDefault();
    if (!reportFile) return;
    alert(`Report "${reportFile.name}" uploaded successfully for AI analysis!`);
    setReportFile(null);
  };

  const getLevelColor = (level) => {
    const colors = { '1': '#389cfa', '2': '#10b981', '3': '#f59e0b', '4': '#ef4444', '5': '#8b5cf6' };
    return colors[level] || '#389cfa';
  };

  return (
    <Container>
      <Sidebar>
        <Logo>Gestura</Logo>
        <Role>Teacher Dashboard</Role>
        <Nav>
          <NavLink active={activeSidebar === "students"} onClick={() => setActiveSidebar("students")}>
            <Users size={18} /> Students
          </NavLink>
          <NavLink active={activeSidebar === "reports"} onClick={() => setActiveSidebar("reports")}>
            <TrendingUp size={18} /> Reports
          </NavLink>
        </Nav>
      </Sidebar>

      <Main>
        {activeSidebar === "students" ? (
          <>
            <WelcomeHeader>
              <WelcomeText>
                <h2>Good Morning, Teacher! 👋</h2>
                <p>You have {students.length} students enrolled in your class.</p>
              </WelcomeText>
              <SubmitButton onClick={() => setActiveTab("add")} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <PlusCircle size={20} /> Add Student
              </SubmitButton>
            </WelcomeHeader>

            <StatsGrid>
              <StatCard color="#389cfa">
                <StatIcon color="#389cfa" bg="#eff6ff"><Users size={24}/></StatIcon>
                <StatInfo><h4>Enrolled</h4><span>{students.length}</span></StatInfo>
              </StatCard>
              <StatCard color="#10b981">
                <StatIcon color="#10b981" bg="#ecfdf5"><Activity size={24}/></StatIcon>
                <StatInfo><h4>Active Level</h4><span>Lv. {students.length > 0 ? Math.max(...students.map(s => parseInt(s.level) || 0)) : 1}</span></StatInfo>
              </StatCard>
            </StatsGrid>

            <Tabs>
              <NavLink 
                active={activeTab === "view"} 
                onClick={() => setActiveTab("view")}
                style={{ background: 'transparent', color: activeTab === 'view' ? '#389cfa' : '#64748b', borderBottom: activeTab === 'view' ? '2px solid #389cfa' : 'none', borderRadius: 0 }}
              >
                Directory
              </NavLink>
              <NavLink 
                active={activeTab === "add"} 
                onClick={() => setActiveTab("add")}
                style={{ background: 'transparent', color: activeTab === 'add' ? '#389cfa' : '#64748b', borderBottom: activeTab === 'add' ? '2px solid #389cfa' : 'none', borderRadius: 0 }}
              >
                Registration
              </NavLink>
            </Tabs>

            {activeTab === "view" ? (
              <>
                <DashboardActions>
                  <div style={{ position: 'relative', width: '300px' }}>
                    <Search size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <Input placeholder="Search students..." style={{ paddingLeft: '2.5rem', width: '100%', fontSize: '0.85rem' }} />
                  </div>
                  <ViewOptions>
                    <ViewButton active={viewMode === "grid"} onClick={() => setViewMode("grid")}><LayoutGrid size={16} /> Grid</ViewButton>
                    <ViewButton active={viewMode === "list"} onClick={() => setViewMode("list")}><List size={16} /> List</ViewButton>
                  </ViewOptions>
                </DashboardActions>

                {viewMode === "grid" ? (
                  <GridContainer>
                    {students.map(student => (
                      <StudentCard key={student.id} levelColor={getLevelColor(student.level)}>
                        <CardHeader>
                          <CardAvatar src={student.photo || 'https://via.placeholder.com/150'} alt={student.name} />
                          <CardTitle>
                            <h3>{student.name}</h3>
                            <span>ID: {student.studentId}</span>
                          </CardTitle>
                        </CardHeader>
                        <CardBody>
                          <Badge bg="#eff6ff" color="#3b82f6">Age: {student.age}</Badge>
                          <Badge bg="#f5f3ff" color="#8b5cf6">Mental: {student.mentalAge}</Badge>
                          <Badge bg="#ecfdf5" color="#10b981">{getLevelName(student.level)}</Badge>
                        </CardBody>
                        <CardActions>
                          <ActionLink to="/view-details" state={{ student }}><ChevronRight size={16} /> Profile Summary</ActionLink>
                          <ActionLink to="/student-performance" state={{ student }}><TrendingUp size={16} /> Performance Metrics</ActionLink>
                          <ActionLink to="/ai-student-report" state={{ student }}><Bot size={16} /> AI Insight Report</ActionLink>
                        </CardActions>
                      </StudentCard>
                    ))}
                    {students.length === 0 && (
                      <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', color: '#64748b' }}>
                        No students found. Click "Add Student" to begin.
                      </div>
                    )}
                  </GridContainer>
                ) : (
                  <TableWrapper>
                    <Table>
                      <thead>
                        <tr>
                          <Th>Student</Th>
                          <Th>Level</Th>
                          <Th>Parent</Th>
                          <Th>Contact</Th>
                          <Th>Actions</Th>
                        </tr>
                      </thead>
                      <tbody>
                        {students.map(student => (
                          <tr key={student.id}>
                            <Td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <img src={student.photo || 'https://via.placeholder.com/40'} alt={student.name} style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%' }} />
                                <strong>{student.name}</strong>
                              </div>
                            </Td>
                            <Td><Badge bg={getLevelColor(student.level) + '20'} color={getLevelColor(student.level)}>Level {student.level}</Badge></Td>
                            <Td>{student.parent}</Td>
                            <Td>{student.emergencyContact}</Td>
                            <Td>
                              <ActionLink to="/view-details" state={{ student }} style={{ padding: 0 }}>View Details</ActionLink>
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
                <FormSection>
                  <h3><User size={20} color="#389cfa" /> Basic Information</h3>
                  <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                    <div style={{ textAlign: 'center' }}>
                      <Label>Student Photo</Label>
                      <div 
                        style={{ 
                          width: '120px', 
                          height: '120px', 
                          borderRadius: '1rem', 
                          background: '#f8fafc', 
                          border: '2px dashed #e2e8f0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          overflow: 'hidden',
                          cursor: 'pointer',
                          position: 'relative',
                          marginTop: '0.5rem'
                        }}
                        onClick={() => document.getElementById('student-photo-input').click()}
                      >
                        {newStudent.photo ? (
                          <img src={newStudent.photo} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <Camera color="#94a3b8" size={32} />
                        )}
                        <input 
                          id="student-photo-input" 
                          type="file" 
                          accept="image/*" 
                          onChange={handleFileChange} 
                          style={{ display: 'none' }} 
                        />
                      </div>
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.5rem', display: 'block' }}>Click to upload</span>
                    </div>
                    <FormGrid style={{ flex: 1 }}>
                      <FormGroup>
                        <Label>Admission Number / ID</Label>
                        <Input name="studentId" value={newStudent.studentId} onChange={handleChange} placeholder="e.g. GST-2024-001" required />
                      </FormGroup>
                      <FormGroup>
                        <Label>Full Name</Label>
                        <Input name="name" value={newStudent.name} onChange={handleChange} placeholder="Student's name" required />
                      </FormGroup>
                    </FormGrid>
                  </div>
                  <FormGrid>
                    <FormGroup>
                      <Label>Current Grade/Class</Label>
                      <Input name="grade" value={newStudent.grade} onChange={handleChange} placeholder="e.g. Grade 1" />
                    </FormGroup>
                    <FormGrid style={{ gap: '1rem' }}>
                      <FormGroup>
                        <Label>Chronological Age</Label>
                        <Input name="age" value={newStudent.age} onChange={handleChange} placeholder="e.g. 7" />
                      </FormGroup>
                      <FormGroup>
                        <Label>Mental Age (optional)</Label>
                        <Input name="mentalAge" type="number" value={newStudent.mentalAge} onChange={handleChange} placeholder="e.g. 5" />
                      </FormGroup>
                    </FormGrid>
                  </FormGrid>
                </FormSection>

                <FormSection>
                  <h3><MessageSquare size={20} color="#389cfa" /> Contact Details</h3>
                  <FormGrid>
                    <FormGroup>
                      <Label>Parent/Guardian Name</Label>
                      <Input name="parent" value={newStudent.parent} onChange={handleChange} placeholder="Contact Person" />
                    </FormGroup>
                    <FormGroup>
                      <Label>Emergency Contact</Label>
                      <Input name="emergencyContact" value={newStudent.emergencyContact} onChange={handleChange} placeholder="Phone number" />
                    </FormGroup>
                  </FormGrid>
                </FormSection>

                <FormSection>
                  <h3><Award size={20} color="#389cfa" /> Academic Placement</h3>
                  <FormGrid>
                    <FormGroup>
                      <Label>Learning Level</Label>
                      <Select name="level" value={newStudent.level} onChange={handleChange}>
                        {Object.entries(LEVEL_CONFIG).map(([id, cfg]) => (
                          <option key={id} value={id}>{cfg.name}</option>
                        ))}
                      </Select>
                    </FormGroup>
                    <FormGroup>
                      <Label>Access Password</Label>
                      <Input name="password" type="password" value={newStudent.password} onChange={handleChange} placeholder="Set student password" />
                    </FormGroup>
                  </FormGrid>
                </FormSection>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <SubmitButton type="submit">Complete Registration</SubmitButton>
                  <button type="button" onClick={() => setActiveTab("view")} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
                </div>
              </Form>
            )}
          </>
        ) : (
          <form onSubmit={handleReportUpload} style={{ textAlign: 'center', padding: '5rem' }}>
            <TrendingUp size={48} color="#cbd5e1" style={{ marginBottom: '1rem' }} />
            <h3>Upload Evaluation Report</h3>
            <p style={{ color: '#64748b', marginBottom: '2rem' }}>Analyze medical or academic assessment reports using AI.</p>
            <FormSection style={{ maxWidth: '500px', margin: '0 auto' }}>
              <Input type="file" onChange={(e) => setReportFile(e.target.files[0])} />
              <SubmitButton type="submit" style={{ marginTop: '1rem', width: '100%' }} disabled={!reportFile}>Analyze with AI</SubmitButton>
            </FormSection>
          </form>
        )}
      </Main>

      <AIButton onClick={() => setIsAiOpen(true)}>
        <Sparkles size={28} />
      </AIButton>

      <AIDrawer open={isAiOpen}>
        <AIHeader>
          <h3><Sparkles size={22} /> Gestura AI</h3>
          <X size={20} style={{ cursor: 'pointer', opacity: 0.8 }} onClick={() => setIsAiOpen(false)} />
        </AIHeader>
        <ChatBody>
          {chatMessages.length === 0 && (
            <div style={{ textAlign: 'center', color: '#64748b', marginTop: '2rem' }}>
              <Bot size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
              <p>Hello! I'm Gestura AI.<br/>How can I help you today?</p>
            </div>
          )}
          {chatMessages.map((msg, i) => (
            <Message key={i} isAi={msg.isAi}>{msg.text}</Message>
          ))}
          {isTyping && (
            <TypingIndicator>
              <span /><span /><span />
            </TypingIndicator>
          )}
        </ChatBody>
        <ChatFooter onSubmit={handleAiSubmit}>
          <ChatInput 
            placeholder="Type your question..." 
            value={aiInput} 
            onChange={(e) => setAiInput(e.target.value)} 
          />
          <SendButton type="submit" disabled={!aiInput.trim() || isTyping}>
            <Send size={18} />
          </SendButton>
        </ChatFooter>
      </AIDrawer>
    </Container>
  );
}
