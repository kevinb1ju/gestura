import React, { useState, useEffect } from "react";
import API_URL from "./config";
import styled, { keyframes } from "styled-components";
import { 
  PlusCircle, 
  MessageSquare, 
  Send, 
  Bot, 
  X, 
  ChevronRight,
  Activity,
  Sparkles,
  Camera,
  BrainCircuit,
  Zap,
  TrendingUp,
  History,
  Info
} from "lucide-react";

const Container = styled.div`
  font-family: "Quicksand", sans-serif;
  background-color: #f8fafc;
  color: #1e293b;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-image: 
    radial-gradient(at 0% 0%, rgba(37, 99, 235, 0.05) 0px, transparent 50%),
    radial-gradient(at 100% 100%, rgba(56, 189, 248, 0.05) 0px, transparent 50%);
`;

const Header = styled.header`
  position: sticky;
  top: 0;
  background: rgba(248, 250, 252, 0.8);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid #e2e8f0;
  z-index: 10;
`;

const HeaderInner = styled.div`
  max-width: 1200px;
  height: 64px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
`;

const Logo = styled.h1`
  font-family: "Fredoka", sans-serif;
  font-size: 28px;
  font-weight: 700;
  letter-spacing: 1px;
`;

const LogoSpan = styled.span`
  text-shadow: 1px 1px 0 #f8fafc, 2px 2px 2px rgba(0, 0, 0, 0.2);
  &:nth-child(1) { color: #ef4444; }
  &:nth-child(2) { color: #facc15; }
  &:nth-child(3) { color: #4ade80; }
  &:nth-child(4) { color: #3b82f6; }
  &:nth-child(5) { color: #a855f7; }
  &:nth-child(6) { color: #ec4899; }
  &:nth-child(7) { color: #f97316; }
`;

const ProfileImg = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-size: cover;
  background-position: center;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const Main = styled.main`
  flex-grow: 1;
  padding: 48px 24px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 24px 16px;
  }
`;

const Section = styled.section`
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 1.5rem;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
`;

const ProgressJourney = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  margin: 3rem 0;
  padding: 0 1rem;

  @media (max-width: 640px) {
    flex-direction: column;
    gap: 3rem;
    align-items: flex-start;
    padding-left: 2rem;
    
    &::before {
      width: 4px;
      height: 100%;
      left: 2.4rem;
      top: 0;
      transform: none;
    }
  }

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 4px;
    background: #e2e8f0;
    transform: translateY(-50%);
    z-index: 1;
    border-radius: 2px;
  }
`;

const JourneyNode = styled.div`
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background: ${props => props.active ? 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)' : 'white'};
  border: 4px solid ${props => props.active ? '#e0e7ff' : '#f1f5f9'};
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  position: relative;
  color: ${props => props.active ? 'white' : '#94a3b8'};
  box-shadow: ${props => props.active ? '0 10px 15px -3px rgba(37, 99, 235, 0.3)' : 'none'};
  transition: all 0.3s ease;

  span {
    position: absolute;
    top: 110%;
    font-size: 0.75rem;
    font-weight: 700;
    white-space: nowrap;
    color: ${props => props.active ? '#2563eb' : '#94a3b8'};

    @media (max-width: 640px) {
      top: 50%;
      left: 120%;
      transform: translateY(-50%);
    }
  }
`;

const Title = styled.h2`
  font-family: "Fredoka", sans-serif;
  font-size: 32px;
  font-weight: 700;
  letter-spacing: -0.02em;

  @media (max-width: 640px) {
    font-size: 24px;
  }
`;

const Subtext = styled.p`
  color: #64748b;
  margin-top: 4px;
  font-size: 1.1rem;
`;

const ChildInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
`;

const ChildImg = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
`;

const ChildText = styled.div`
  text-align: left;
`;

const ChildName = styled.h3`
  font-size: 24px;
  font-weight: 700;
`;

const ChildDetails = styled.p`
  color: #64748b;
  margin-top: 4px;
`;

const ChartSection = styled(Section)`
  flex: 2;
`;

const FeedbackSection = styled(Section)`
  flex: 1;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;

  @media (min-width: 1024px) {
    grid-template-columns: 2fr 1fr;
  }
`;

const ProgressHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 16px;
`;

const ProgressValue = styled.p`
  font-size: 36px;
  font-weight: 700;
  color: #2563eb;
`;

const ChartWrapper = styled.div`
  height: 200px;
  width: 100%;
`;

const ProgressFooter = styled.div`
  display: flex;
  justify-content: space-around;
  border-top: 1px solid #f1f5f9;
  padding-top: 8px;
  margin-top: 8px;
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
`;

const FeedbackText = styled.p`
  margin-top: 8px;
  color: #475569;
  line-height: 1.5;
`;

// --- AI Assistant Styled Components ---
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
  max-width: calc(100vw - 2rem);
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

export default function ParentDashboard() {
  const [studentData, setStudentData] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [aiInput, setAiInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const loadData = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.role === 'parent') {
      const students = JSON.parse(localStorage.getItem('teacherStudents') || '[]');
      const child = students.find(s => s.studentId === user.studentId);
      setStudentData(child);

      const reportKey = `parent_report_${user.studentId}`;
      const savedReport = localStorage.getItem(reportKey);
      if (savedReport) {
        setReportData(JSON.parse(savedReport));
      }
    }
  };

  useEffect(() => {
    loadData();

    // Real-time synchronization: listen for localStorage changes
    const handleStorageChange = (e) => {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (e.key === 'teacherStudents' || e.key === `parent_report_${user.studentId}`) {
        loadData();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

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
          role: 'parent',
          context: { studentData, reportData }
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

  const currentLevel = studentData?.level ?
    (typeof studentData.level === 'string' ?
      parseInt(studentData.level.replace('Level ', '')) :
      studentData.level) :
    3;

  return (
    <Container>
      <Header>
        <HeaderInner>
          <Logo>
            <LogoSpan>G</LogoSpan>
            <LogoSpan>e</LogoSpan>
            <LogoSpan>s</LogoSpan>
            <LogoSpan>t</LogoSpan>
            <LogoSpan>u</LogoSpan>
            <LogoSpan>r</LogoSpan>
            <LogoSpan>a</LogoSpan>
          </Logo>
          <ProfileImg
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDR0bwBSRfCsTzYcwksMs0RUGSyyvoI4j5tZvegTBg4lB6CXTyU7_bRDSy5rrgY06Vktxad20wqWct63OEmnhVzU7kD-mw1K2DjEmAhH-K-A2szlyfoGeiJ3aQxBpl20xA40lyUE40wNAY5ki3Oi2onCiefx3zcySZ2eoLg1O2PnnQvQGeDH8gAqNoceO3Gl7CB3V0gVFVX5-p0rcJX9i6R2uRNXrD8LH9MdaHqJzwemteqZwt1eKiOtvgVR_Ij9awPeuji1B5XpmhL')",
            }}
          />
        </HeaderInner>
      </Header>

      <Main>
        <div style={{ marginBottom: '2.5rem' }}>
          <Title>Good Afternoon, {studentData?.name ? `${studentData.name}'s Parent` : 'Parent'}! 👋</Title>
          <Subtext>Here's a live look at your child's learning journey and recent milestones.</Subtext>
        </div>

        <Section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Milestone Progress</h3>
            <span style={{ fontSize: '0.85rem', color: '#2563eb', fontWeight: 700, background: '#eff6ff', padding: '0.4rem 0.8rem', borderRadius: '2rem' }}>
              Level {currentLevel} of 5
            </span>
          </div>
          
          <ProgressJourney>
            {[1, 2, 3, 4, 5].map(lvl => (
              <JourneyNode key={lvl} active={lvl <= currentLevel}>
                {lvl <= currentLevel ? <Sparkles size={16} /> : lvl}
                <span>Stage {lvl}</span>
              </JourneyNode>
            ))}
          </ProgressJourney>

          <ChildInfo style={{ marginTop: '3rem', borderTop: '1px solid #f1f5f9', paddingTop: '2rem' }}>
            <ChildImg
              src={studentData?.photo || studentData?.avatar || "https://lh3.googleusercontent.com/aida-public/AB6AXuBtoxodHFcm333X5bYA_OtgWF1dIOvChUzxfid7nyTiqhZiRR5cawKYJRYcroLVbmt2U23_s2bUudXMcqZL_1MvTzUg4SoRy2wMOz8dhlJXQwUh7bbA2DUAHciQz4PMu2GSFpQjGZJHmQZnxOdAS343NGHuDvivqkh2RKD79HO0a4eRpcLynGqKc1cRzAgBv-6ZRBie75CLCx2k5IF_G2Zr9YNQZbs1crg4dp0JFg_jVy4DGi53G_JGBlKtouzaWZwWZjf0GaD2C6__"}
              alt={studentData?.name || "Student"}
              style={{ width: '80px', height: '80px', border: '4px solid white', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}
            />
            <ChildText>
              <ChildName>{studentData?.name || 'Your Child'}</ChildName>
              <ChildDetails>
                Enrolled in {studentData?.grade || 'Assessment'} • Stage {currentLevel} Achieved
              </ChildDetails>
            </ChildText>
            <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
              <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Last Assessment</div>
              <div style={{ fontWeight: 700 }}>{reportData ? new Date(reportData.timestamp).toLocaleDateString() : 'Pending'}</div>
            </div>
          </ChildInfo>
        </Section>

        <Grid>
          <ChartSection>
            <h3 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "16px" }}>
              Progress Overview
            </h3>
            {reportData ? (
              <ProgressHeader>
                <div>
                  <p
                    style={{
                      fontSize: "14px",
                      fontWeight: "500",
                      color: "#64748b",
                      marginBottom: "4px",
                    }}
                  >
                    Overall Skills Development
                  </p>
                  <ProgressValue>{reportData.analysis?.overall ?? 0}%</ProgressValue>
                </div>
                <div style={{ fontSize: "14px", color: reportData.analysis?.overall > 50 ? "#22c55e" : "#ef4444" }}>
                  {reportData.analysis?.overallLevel?.level || ''}
                </div>
              </ProgressHeader>
            ) : (
              <ProgressHeader>
                <div>
                  <p
                    style={{
                      fontSize: "14px",
                      fontWeight: "500",
                      color: "#64748b",
                      marginBottom: "4px",
                    }}
                  >
                    No Report Available
                  </p>
                  <ProgressValue>N/A</ProgressValue>
                </div>
              </ProgressHeader>
            )}

            <ChartWrapper>
              <svg
                fill="none"
                height="100%"
                width="100%"
                viewBox="0 0 472 150"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25V150H0V109Z"
                  fill="url(#paint0_linear_chart)"
                />
                <path
                  d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25"
                  stroke="#2563eb"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear_chart"
                    x1="236"
                    x2="236"
                    y1="1"
                    y2="150"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#2563eb" stopOpacity="0.2" />
                    <stop offset="1" stopColor="#2563eb" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </ChartWrapper>

            <ProgressFooter>
              <span>Month 1</span>
              <span>Month 2</span>
              <span>Month 3</span>
            </ProgressFooter>
          </ChartSection>

          <FeedbackSection>
            <h3 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "16px" }}>
              Teacher Feedback
            </h3>
            <div>
              <h4 style={{ fontSize: "16px", fontWeight: "700" }}>
                {reportData ? "Latest Report Received" : "No Report Yet"}
              </h4>
              {reportData ? (
                <div>
                  <FeedbackText style={{ fontSize: "12px", color: "#94a3b8", marginBottom: "8px" }}>
                    Sent on: {new Date(reportData.timestamp).toLocaleDateString()}
                  </FeedbackText>
                  <FeedbackText>
                    <strong>Category Feedback:</strong>
                  </FeedbackText>
                  <ul style={{ paddingLeft: "20px", marginTop: "8px", fontSize: "14px", color: "#475569", lineHeight: "1.5" }}>
                    <li><strong>Cognitive:</strong> {reportData.analysis?.cognitive?.level?.description || "N/A"} ({reportData.analysis?.cognitive?.score}%)</li>
                    <li><strong>Motor:</strong> {reportData.analysis?.motor?.level?.description || "N/A"} ({reportData.analysis?.motor?.score}%)</li>
                    <li><strong>Social:</strong> {reportData.analysis?.social?.level?.description || "N/A"} ({reportData.analysis?.social?.score}%)</li>
                    <li><strong>Emotional:</strong> {reportData.analysis?.emotional?.level?.description || "N/A"} ({reportData.analysis?.emotional?.score}%)</li>
                  </ul>

                  {reportData.recommendations && reportData.recommendations.length > 0 && (
                    <>
                      <FeedbackText style={{ marginTop: "16px" }}>
                        <strong>Recommendations for Home:</strong>
                      </FeedbackText>
                      <ul style={{ paddingLeft: "20px", marginTop: "8px", fontSize: "14px", color: "#475569", lineHeight: "1.5" }}>
                        {reportData.recommendations.map((rec, idx) => (
                          <li key={idx}><strong>{rec.category}:</strong> {rec.suggestion}</li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              ) : (
                <FeedbackText>
                  There are no recent feedback reports from your child's teacher. Please check back later.
                </FeedbackText>
              )}
            </div>
          </FeedbackSection>
        </Grid>
      </Main>

      {/* AI Assistant UI */}
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
