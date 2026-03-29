import React, { useState, useEffect } from "react";
import API_URL from "./config";
import styled, { keyframes, css } from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  FileText, 
  Plus, 
  Search, 
  TrendingUp, 
  School, 
  UserPlus, 
  Sparkles, 
  MessageSquare, 
  Send, 
  Loader2,
  ChevronRight,
  ArrowRight
} from "lucide-react";

// ---------------- Styled Components ----------------
const Container = styled.div`
  display: flex;
  min-height: 100vh;
  font-family: 'Plus Jakarta Sans', sans-serif;
  background-color: #f0f8ff;
`;

const Sidebar = styled.aside`
  width: 18rem;
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(20px);
  border-right: 1px solid rgba(255, 255, 255, 0.3);
  padding: 2rem 0;
  display: flex;
  flex-direction: column;
  box-shadow: 4px 0 24px rgba(0, 0, 0, 0.02);
  z-index: 100;
`;

const Logo = styled.h1`
  padding: 0 2rem;
  font-weight: 800;
  font-size: 2.5rem;
  display: flex;
  gap: 2px;
  margin-bottom: 2rem;
  font-family: 'Fredoka', cursive;
`;

const Nav = styled.nav`
  margin-top: 1.5rem;
  padding: 0 1rem;
`;

const NavItem = styled.a`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  margin: 0.25rem 1rem;
  border-radius: 1rem;
  font-weight: 600;
  color: ${(props) => (props.active ? "#0da6f2" : "#64748b")};
  background: ${(props) => (props.active ? "rgba(13, 166, 242, 0.1)" : "transparent")};
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;

  &:hover {
    background: rgba(13, 166, 242, 0.05);
    color: #0da6f2;
    transform: translateX(4px);
  }

  ${(props) => props.active && `
    &::after {
      content: '';
      position: absolute;
      left: -1rem;
      top: 20%;
      bottom: 20%;
      width: 4px;
      background: #0da6f2;
      border-radius: 0 4px 4px 0;
    }
  `}
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(13, 166, 242, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(13, 166, 242, 0); }
  100% { box-shadow: 0 0 0 0 rgba(13, 166, 242, 0); }
`;

const Main = styled.main`
  flex: 1;
  padding: 2.5rem;
  background: #f8fafc;
  height: 100vh;
  overflow-y: auto;
`;

const FadeInDiv = styled.div`
  animation: ${fadeIn} 0.5s ease-out;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2.5rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2.5rem;
`;

const StatCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 1.5rem;
  border: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  gap: 1.25rem;
  transition: all 0.3s ease;
  animation: ${fadeIn} 0.6s ease-out backwards;
  animation-delay: ${(props) => props.delay || "0s"};

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05);
  }
`;

const StatIcon = styled.div`
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(props) => props.bg || "rgba(13, 166, 242, 0.1)"};
  color: ${(props) => props.color || "#0da6f2"};
`;

const StatInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const StatValue = styled.span`
  font-size: 1.75rem;
  font-weight: 800;
  color: #1e293b;
`;

const StatLabel = styled.span`
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
`;

const SectionContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  animation: ${fadeIn} 0.8s ease-out backwards;
  animation-delay: 0.2s;
  
  @media(min-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const Card = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 1.5rem;
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02);
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const InputGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const InputLabel = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: #64748b;
  margin-bottom: 0.5rem;
  margin-left: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem 1.25rem;
  border-radius: 1rem;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  font-size: 1rem;
  box-sizing: border-box;
  transition: all 0.2s;

  &:focus {
    outline: none;
    background: white;
    border-color: #0da6f2;
    box-shadow: 0 0 0 4px rgba(13, 166, 242, 0.1);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 1rem 1.25rem;
  border-radius: 1rem;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  font-size: 1rem;
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='Wait19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1.25rem;

  &:focus {
    outline: none;
    border-color: #0da6f2;
    box-shadow: 0 0 0 4px rgba(13, 166, 242, 0.1);
  }
`;

// AI Drawer Styles
const AIDrawer = styled.div`
  position: fixed;
  top: 0;
  right: ${(props) => (props.isOpen ? "0" : "-450px")};
  width: 400px;
  height: 100vh;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(25px);
  border-left: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: -10px 0 40px rgba(0, 0, 0, 0.1);
  transition: all 0.5s cubic-bezier(0.19, 1, 0.22, 1);
  z-index: 1000;
  display: flex;
  flex-direction: column;
`;

const AIHeader = styled.div`
  padding: 2rem;
  background: linear-gradient(135deg, rgba(13, 166, 242, 0.1), rgba(131, 56, 236, 0.1));
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const AIChatArea = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 3px;
  }
`;

const Message = styled.div`
  max-width: 85%;
  padding: 1rem 1.25rem;
  border-radius: 1.25rem;
  font-size: 0.95rem;
  line-height: 1.5;
  ${(props) => props.isAi ? css`
    align-self: flex-start;
    background: white;
    color: #1e293b;
    border: 1px solid rgba(0, 0, 0, 0.05);
    border-bottom-left-radius: 0.25rem;
  ` : css`
    align-self: flex-end;
    background: #0da6f2;
    color: white;
    border-bottom-right-radius: 0.25rem;
  `}
`;

const AIInputArea = styled.div`
  padding: 1.5rem;
  background: white;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  gap: 1rem;
`;

const AIButton = styled.button`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 4rem;
  height: 4rem;
  border-radius: 2rem;
  background: linear-gradient(135deg, #0da6f2, #8338ec);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 20px rgba(13, 166, 242, 0.3);
  transition: all 0.3s;
  z-index: 999;
  animation: ${pulse} 2s infinite;

  &:hover {
    transform: scale(1.1);
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 0.75rem;
  border-radius: 0.75rem;
  font-weight: bold;
  background-color: #0da6f2;
  color: white;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    background-color: #0b8ac9;
  }
  &:disabled {
    background-color: #cbd5e1;
    cursor: not-allowed;
  }
`;

const SuccessMessage = styled.div`
  background: #d1fae5;
  border: 1px solid #a7f3d0;
  color: #065f46;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;
`;

const ErrorMessage = styled.div`
  background: #fee2e2;
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;
`;

// Legend & Status Colors
const getStatusColor = (status) => {
  switch(status) {
    case "Active": return { color: "#d1fae5", textColor: "#065f46" };
    case "Pending": return { color: "#fef3c7", textColor: "#92400e" };
    case "Inactive": return { color: "#fee2e2", textColor: "#dc2626" };
    default: return { color: "#f1f5f9", textColor: "#64748b" };
  }
};

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 700;
  border-radius: 9999px;
  background-color: ${(props) => props.color || "#d1fae5"};
  color: ${(props) => props.textColor || "#111827"};
  border: 1px solid rgba(0, 0, 0, 0.05);
`;

const InstitutionCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 1.25rem;
  border: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  transition: all 0.3s;
  animation: ${fadeIn} 0.5s ease-out backwards;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 20px -5px rgba(0, 0, 0, 0.05);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const CardBody = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  padding: 1rem 0;
  border-top: 1px solid #f1f5f9;
  border-bottom: 1px solid #f1f5f9;
`;

const CardStat = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const CardStatLabel = styled.span`
  font-size: 0.75rem;
  color: #64748b;
  font-weight: 500;
`;

const CardStatValue = styled.span`
  font-size: 1rem;
  font-weight: 700;
  color: #1e293b;
`;

const ViewButton = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border-radius: 0.75rem;
  background: #f8fafc;
  color: #0da6f2;
  text-decoration: none;
  font-weight: 700;
  font-size: 0.875rem;
  transition: all 0.2s;

  &:hover {
    background: #0da6f2;
    color: white;
  }
`;

// ---------------- React Component ----------------
export default function AdminDashboard() {
  const [activeView, setActiveView] = useState("dashboard");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  
  // AI State
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [aiMessages, setAiMessages] = useState([
    { text: "Welcome to the Admin Command Center. I am Gestura AI. How can I assist you with platform insights today?", isAi: true }
  ]);
  const [userInput, setUserInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  // Institution form state
  const [institutionName, setInstitutionName] = useState("");
  const [institutionError, setInstitutionError] = useState("");
  const [institutionSuccess, setInstitutionSuccess] = useState("");
  const [institutionLoading, setInstitutionLoading] = useState(false);
  
  // Teacher form state
  const [teacherName, setTeacherName] = useState("");
  const [teacherEmail, setTeacherEmail] = useState("");
  const [teacherPassword, setTeacherPassword] = useState("");
  const [teacherInstitution, setTeacherInstitution] = useState("");
  const [teacherError, setTeacherError] = useState("");
  const [teacherSuccess, setTeacherSuccess] = useState("");
  const [teacherLoading, setTeacherLoading] = useState(false);
  
  // Institutions list
  const [institutions, setInstitutions] = useState([]);
  const [institutionsLoading, /* setInstitutionsLoading */] = useState(false);

  // Derive student counts per institution from localStorage (students added by teachers)
  const getLocalStudentCount = (institutionName) => {
    try {
      const local = JSON.parse(localStorage.getItem('teacherStudents') || '[]');
      console.log('All students in localStorage:', local);
      console.log('Looking for institution:', institutionName);
      const filtered = local.filter(s => {
        const studentInst = (s.institution || '').toLowerCase();
        const searchInst = (institutionName || '').toLowerCase();
        console.log(`Comparing: "${studentInst}" === "${searchInst}"`, studentInst === searchInst);
        return studentInst === searchInst;
      });
      console.log('Filtered students for', institutionName, ':', filtered);
      return filtered.length;
    } catch (e) {
      console.error('Error getting student count:', e);
      return 0;
    }
  };
  
  // Platform Stats aggregation
  const [platformStats, setPlatformStats] = useState({
    institutions: 0,
    teachers: 0,
    students: 0
  });

  const calculatePlatformStats = async () => {
    try {
      const instResponse = await fetch(`${API_URL}/institutions`);
      const instData = await instResponse.json();
      
      const teacherResponse = await fetch(`${API_URL}/users?role=teacher`);
      const teacherData = await teacherResponse.json();
      
      const localStudents = JSON.parse(localStorage.getItem('teacherStudents') || '[]');
      
      if (instData.institutions?.length === 0 && teacherData.users?.length === 0) {
        localStorage.removeItem('teacherStudents');
      }
      
      setPlatformStats({
        institutions: instData.institutions?.length || 0,
        teachers: teacherData.users?.length || 0,
        students: (instData.institutions?.length === 0 && teacherData.users?.length === 0) ? 0 : localStudents.length
      });
      
      if (instResponse.ok) {
        setInstitutions(instData.institutions || []);
      }
    } catch (err) {
      console.error("Failed to aggregate platform stats:", err);
    }
  };

  useEffect(() => {
    calculatePlatformStats();
  }, []);

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    const newMessages = [...aiMessages, { text: userInput, isAi: false }];
    setAiMessages(newMessages);
    setUserInput("");
    setIsTyping(true);

    try {
      const response = await fetch(`${API_URL}/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userInput,
          context: {
            role: "admin",
            stats: platformStats,
            view: activeView
          }
        })
      });

      const data = await response.json();
      setAiMessages([...newMessages, { text: data.reply, isAi: true }]);
    } catch (err) {
      setAiMessages([...newMessages, { text: "I'm having trouble connecting to my knowledge base. Please try again soon.", isAi: true }]);
    } finally {
      setIsTyping(false);
    }
  };
  
  // Handle institution submission
  const handleAddInstitution = async (e) => {
    e.preventDefault();
    setInstitutionError("");
    setInstitutionSuccess("");
    setInstitutionLoading(true);
    
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/institutions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ name: institutionName }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setInstitutionSuccess(`Institution "${institutionName}" added successfully!`);
        setInstitutionName("");
        // Refresh platform stats
        calculatePlatformStats();
      } else {
        setInstitutionError(data.message || "Failed to add institution");
      }
    } catch (err) {
      setInstitutionError("Connection error. Please make sure the server is running.");
    } finally {
      setInstitutionLoading(false);
    }
  };
  
  // Handle teacher submission
  const handleAddTeacher = async (e) => {
    e.preventDefault();
    setTeacherError("");
    setTeacherSuccess("");
    setTeacherLoading(true);
    
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: teacherName,
          email: teacherEmail,
          password: teacherPassword,
          role: "teacher",
          institution: teacherInstitution,
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setTeacherSuccess(`Teacher "${teacherName}" added successfully!`);
        setTeacherName("");
        setTeacherEmail("");
        setTeacherPassword("");
        setTeacherInstitution("");
        // Refresh platform stats to update counts
        calculatePlatformStats();
      } else {
        setTeacherError(data.message || "Failed to add teacher");
      }
    } catch (err) {
      setTeacherError("Connection error. Please make sure the server is running.");
    } finally {
      setTeacherLoading(false);
    }
  };



  return (
    <Container>
      <Sidebar>
        <Logo>
          <span style={{ color: "#FF6B6B" }}>G</span>
          <span style={{ color: "#FFD166" }}>e</span>
          <span style={{ color: "#06D6A0" }}>s</span>
          <span style={{ color: "#118AB2" }}>t</span>
          <span style={{ color: "#8338EC" }}>u</span>
          <span style={{ color: "#EF476F" }}>r</span>
          <span style={{ color: "#FF9F1C" }}>a</span>
        </Logo>
        <Nav>
          <NavItem active={activeView === "dashboard"} onClick={() => setActiveView("dashboard")}>
            <LayoutDashboard size={20} /> Dashboard
          </NavItem>
          <NavItem active={activeView === "institutions"} onClick={() => setActiveView("institutions")}>
            <Building2 size={20} /> Institutions
          </NavItem>
          <NavItem active={activeView === "reports"} onClick={() => setActiveView("reports")}>
            <FileText size={20} /> Analytics
          </NavItem>
        </Nav>
        <div style={{ marginTop: 'auto', padding: '2rem' }}>
          <Button onClick={() => { localStorage.clear(); navigate('/'); }}>Sign Out</Button>
        </div>
      </Sidebar>

      <Main>
        <Header>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#1e293b' }}>
              Welcome, <span style={{ color: '#0da6f2' }}>Admin</span>
            </h1>
            <p style={{ color: '#64748b', fontWeight: 500 }}>Here's what's happening across Gestura today.</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
             <StatusBadge color="rgba(131, 56, 236, 0.1)" textColor="#8338ec">
                <Sparkles size={14} style={{ marginRight: '4px' }} /> Premium Command Center
             </StatusBadge>
          </div>
        </Header>

        {activeView === "dashboard" && (
          <>
            <StatsGrid>
              <StatCard delay="0.1s">
                <StatIcon bg="rgba(13, 166, 242, 0.1)" color="#0da6f2">
                  <School size={24} />
                </StatIcon>
                <StatInfo>
                  <StatValue>{platformStats.institutions}</StatValue>
                  <StatLabel>Total Schools</StatLabel>
                </StatInfo>
              </StatCard>
              <StatCard delay="0.2s">
                <StatIcon bg="rgba(131, 56, 236, 0.1)" color="#8338ec">
                  <Users size={24} />
                </StatIcon>
                <StatInfo>
                  <StatValue>{platformStats.teachers}</StatValue>
                  <StatLabel>Active Teachers</StatLabel>
                </StatInfo>
              </StatCard>
              <StatCard delay="0.3s">
                <StatIcon bg="rgba(6, 214, 160, 0.1)" color="#06d6a0">
                  <TrendingUp size={24} />
                </StatIcon>
                <StatInfo>
                  <StatValue>{platformStats.students}</StatValue>
                  <StatLabel>Total Students</StatLabel>
                </StatInfo>
              </StatCard>
            </StatsGrid>

            <SectionContainer>
              <Card>
                <Title><Plus size={24} color="#0da6f2" /> Add New Institution</Title>
                {institutionSuccess && <SuccessMessage>{institutionSuccess}</SuccessMessage>}
                {institutionError && <ErrorMessage>{institutionError}</ErrorMessage>}
                <form onSubmit={handleAddInstitution}>
                  <InputGroup>
                    <InputLabel>Institution Name</InputLabel>
                    <Input 
                      placeholder="e.g. Springfield Academy" 
                      type="text" 
                      value={institutionName}
                      onChange={(e) => setInstitutionName(e.target.value)}
                      required
                    />
                  </InputGroup>
                  <Button type="submit" disabled={institutionLoading}>
                    {institutionLoading ? "Adding..." : "Register Institution"}
                  </Button>
                </form>
              </Card>

              <Card>
                <Title><UserPlus size={24} color="#8338ec" /> Register Teacher</Title>
                {teacherSuccess && <SuccessMessage>{teacherSuccess}</SuccessMessage>}
                {teacherError && <ErrorMessage>{teacherError}</ErrorMessage>}
                <form onSubmit={handleAddTeacher}>
                  <InputGroup>
                    <InputLabel>Target Institution</InputLabel>
                    <Select 
                      value={teacherInstitution}
                      onChange={(e) => setTeacherInstitution(e.target.value)}
                      required
                    >
                      <option value="">Select an institution</option>
                      {institutions.map((inst, idx) => (
                        <option key={idx} value={inst.name}>{inst.name}</option>
                      ))}
                    </Select>
                  </InputGroup>
                  <InputGroup>
                    <InputLabel>Full Name</InputLabel>
                    <Input 
                      placeholder="e.g. Sarah Johnson" 
                      type="text" 
                      value={teacherName}
                      onChange={(e) => setTeacherName(e.target.value)}
                      required
                    />
                  </InputGroup>
                  <InputGroup style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <InputLabel>Email Address</InputLabel>
                      <Input 
                        placeholder="s.johnson@edu.com" 
                        type="email" 
                        value={teacherEmail}
                        onChange={(e) => setTeacherEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <InputLabel>Access Password</InputLabel>
                      <Input 
                        placeholder="••••••••" 
                        type="password" 
                        value={teacherPassword}
                        onChange={(e) => setTeacherPassword(e.target.value)}
                        required
                      />
                    </div>
                  </InputGroup>
                  <Button type="submit" disabled={teacherLoading}>
                    {teacherLoading ? "Adding..." : "Confirm Registration"}
                  </Button>
                </form>
              </Card>
            </SectionContainer>
          </>
        )}

        {activeView === "institutions" && (
          <FadeInDiv>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <Title><Building2 size={24} color="#0da6f2" /> Institution Management</Title>
              <div style={{ position: 'relative', width: '300px' }}>
                <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <Input 
                  placeholder="Search institutions..." 
                  value={search} 
                  onChange={(e) => setSearch(e.target.value)} 
                  style={{ paddingLeft: '3rem' }}
                />
              </div>
            </div>

            {institutionsLoading ? (
               <div style={{ textAlign: "center", padding: "4rem" }}>
                  <Loader2 size={40} className="animate-spin" style={{ color: "#0da6f2", margin: "0 auto" }} />
                  <p style={{ marginTop: "1rem", color: "#64748b" }}>Loading platform data...</p>
               </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                {institutions
                  .filter(i => i.name.toLowerCase().includes(search.toLowerCase()))
                  .map((inst, idx) => (
                    <InstitutionCard key={idx}>
                      <CardHeader>
                        <div>
                          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e293b', marginBottom: '0.25rem' }}>{inst.name}</h3>
                          <StatusBadge {...getStatusColor(inst.status)}>{inst.status}</StatusBadge>
                        </div>
                        <StatIcon bg="rgba(13, 166, 242, 0.05)" color="#0da6f2">
                          <School size={20} />
                        </StatIcon>
                      </CardHeader>
                      <CardBody>
                        <CardStat>
                          <CardStatLabel>Teachers</CardStatLabel>
                          <CardStatValue>{inst.teachers || 0}</CardStatValue>
                        </CardStat>
                        <CardStat>
                          <CardStatLabel>Students</CardStatLabel>
                          <CardStatValue>{getLocalStudentCount(inst.name)}</CardStatValue>
                        </CardStat>
                      </CardBody>
                      <ViewButton to={`/institution-profile/${encodeURIComponent(inst.name)}`}>
                        View Profile <ArrowRight size={16} />
                      </ViewButton>
                    </InstitutionCard>
                  ))}
              </div>
            )}
          </FadeInDiv>
        )}

        {activeView === "reports" && (
          <FadeInDiv>
            <Title><FileText size={24} color="#8338ec" /> Platform Analytics</Title>
            <Card style={{ textAlign: 'center', padding: '4rem' }}>
               <StatIcon bg="rgba(131, 56, 236, 0.1)" color="#8338ec" style={{ margin: '0 auto 1.5rem' }}>
                  <TrendingUp size={30} />
               </StatIcon>
               <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b', marginBottom: '1rem' }}>Coming Soon</h3>
               <p style={{ color: '#64748b', maxWidth: '400px', margin: '0 auto' }}>
                  Advanced platform-wide heatmaps and performance forecasting are currently being calibrated.
               </p>
            </Card>
          </FadeInDiv>
        )}
      </Main>

      <AIButton onClick={() => setIsAiOpen(!isAiOpen)}>
        {isAiOpen ? <ChevronRight size={24} /> : <MessageSquare size={24} />}
      </AIButton>

      <AIDrawer isOpen={isAiOpen}>
        <AIHeader>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: "#0da6f2", display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}>
              <Sparkles size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800 }}>Gestura AI</h3>
              <span style={{ fontSize: "0.8rem", color: "#0da6f2", fontWeight: 600 }}>Command Center Assistant</span>
            </div>
          </div>
        </AIHeader>
        <AIChatArea>
          {aiMessages.map((msg, i) => (
            <Message key={i} isAi={msg.isAi}>
              {msg.text}
            </Message>
          ))}
          {isTyping && (
            <Message isAi={true}>
              <div style={{ display: "flex", gap: "4px" }}>
                <div style={{ width: "6px", height: "6px", background: "#0da6f2", borderRadius: "50%", animation: "pulse 1s infinite" }}></div>
                <div style={{ width: "6px", height: "6px", background: "#0da6f2", borderRadius: "50%", animation: "pulse 1s infinite 0.2s" }}></div>
                <div style={{ width: "6px", height: "6px", background: "#0da6f2", borderRadius: "50%", animation: "pulse 1s infinite 0.4s" }}></div>
              </div>
            </Message>
          )}
        </AIChatArea>
        <AIInputArea>
          <Input 
            placeholder="Ask me for platform insights..." 
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            style={{ marginBottom: 0 }}
          />
          <button 
            onClick={handleSendMessage}
            style={{ background: "#0da6f2", color: "white", border: "none", borderRadius: "12px", width: "45px", height: "45px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <Send size={20} />
          </button>
        </AIInputArea>
      </AIDrawer>
    </Container>
  );
}
