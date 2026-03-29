import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useParams, useLocation } from "react-router-dom";

// ---------------- Styled Components ----------------
const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  font-family: 'Lexend', sans-serif;
  background-color: #f0f8ff;
`;

const Header = styled.header`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  width: 100%;
  padding: 1rem 0;
`;

const Logo = styled.div`
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

const Main = styled.main`
  flex-grow: 1;
  max-width: 1024px;
  margin: 0 auto;
  padding: 7rem 1rem 2rem;
`;

const SectionTitle = styled.h1`
  font-size: 1.875rem;
  font-weight: bold;
  text-align: center;
  color: #1f2937;
`;

const SectionSubtitle = styled.p`
  font-size: 0.875rem;
  text-align: center;
  color: #6b7280;
  margin-top: 0.25rem;
`;

const ProfileCard = styled.div`
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(12px);
  border-radius: 1rem;
  box-shadow: 0 10px 15px rgba(0,0,0,0.1);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1.5rem;
  margin: 2rem 0;

  @media(min-width: 768px){
    flex-direction: row;
    align-items: center;
  }
`;

const Avatar = styled.div`
  width: 8rem;
  height: 8rem;
  border-radius: 9999px;
  border: 4px solid white;
  background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuDQ2iri6Hg73AwLg1prq5gg4wEAxAxGccpvhO75YpZAFmTQBEzNf1A0kkjLi6wkZfFu7wfLHin6jAWJdihp_M-DHbGzuOASz7VygEh2HX_8o80LLQDOfwAO6Qv0niyD0rS8Rp6xUhkqVTQx_A56WPzbPbTQ0VLsyfkkOusgXRd3ANA3cRdy_DN8D6cLRilOQ5_ssjPYpZTh5k8zbGBeF34csvyPVjYSTeQiQzM-F198jD_Wt9qsN-fBf84WTw38veHyh5NPRSHCfVAI");
  background-size: cover;
  background-position: center;
`;

const ProfileInfo = styled.div`
  text-align: center;
  @media(min-width: 768px){
    text-align: left;
  }
`;

const Name = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  color: #1f2937;
`;

const StudentID = styled.p`
  color: #6b7280;
`;

const Badge = styled.span`
  display: inline-flex;
  background-color: rgba(56, 156, 250, 0.2);
  color: #389cfa;
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.125rem 0.625rem;
  border-radius: 9999px;
  margin-right: 0.5rem;
`;

const LevelControl = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.75rem;
`;

const LevelButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid #389cfa;
  background: white;
  color: #389cfa;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #389cfa;
    color: white;
  }
  
  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

const LevelDisplay = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  color: #389cfa;
  min-width: 80px;
  text-align: center;
`;

const SaveButton = styled.button`
  background: #389cfa;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: none;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #2d7ac9;
  }
  
  &:disabled {
    background: #cbd5e1;
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
  text-align: center;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;

  @media(min-width: 1024px){
    grid-template-columns: repeat(3, 1fr);
  }
`;

const InfoCard = styled.div`
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(12px);
  border-radius: 1rem;
  box-shadow: 0 10px 15px rgba(0,0,0,0.1);
  padding: 1.5rem;
`;

const InfoItem = styled.div`
  margin-bottom: 1rem;
`;

const InfoLabel = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
`;

const InfoValue = styled.p`
  color: #1f2937;
  font-weight: 500;
`;

const ProgressGrid = styled.div`
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(12px);
  border-radius: 1rem;
  box-shadow: 0 10px 15px rgba(0,0,0,0.1);
  padding: 1.5rem;
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1.5rem;
  text-align: center;

  @media(min-width: 640px){
    grid-template-columns: repeat(2, 1fr);
  }
  @media(min-width: 768px){
    grid-template-columns: repeat(4, 1fr);
  }
`;

const Pie = styled.div`
  --p: ${(props) => props.progress};
  --c: ${(props) => props.color || "#389cfa"};
  --w: 60px;
  width: var(--w);
  aspect-ratio: 1;
  position: relative;
  display: inline-grid;
  place-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  border-radius: 50%;
  background: radial-gradient(farthest-side, var(--c) 98%, #0000) top/var(--w) var(--w) no-repeat,
              conic-gradient(var(--c) calc(var(--p) * 1%), #0000 0);
  -webkit-mask: radial-gradient(farthest-side, #0000 calc(99% - calc(var(--w)/10)), #000 calc(100% - calc(var(--w)/10)));
  mask: radial-gradient(farthest-side, #0000 calc(99% - calc(var(--w)/10)), #000 calc(100% - calc(var(--w)/10)));
`;

const ProgressText = styled.p`
  color: ${(props) => (props.large ? "#389cfa" : "#6b7280")};
  font-weight: ${(props) => (props.large ? 700 : 500)};
  font-size: ${(props) => (props.large ? "2.25rem" : "0.875rem")};
  margin-top: ${(props) => (props.large ? "0.25rem" : "0")};
`;

const CardRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin: 2rem 0;

  @media(min-width: 1024px){
    flex-direction: row;
    gap: 2rem;
  }

  & > * {
    flex: 1; // make children equal width
  }
`;

const OverallProgress = styled.div`
  margin-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
  padding-top: 1rem;
`;

// ---------------- Main Component ----------------
export default function ViewDetails() {
  const { studentId } = useParams();
  const location = useLocation();
  const passedStudent = location.state?.student;
  
  const [level, setLevel] = useState(3);
  const [originalLevel, setOriginalLevel] = useState(3);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [studentData, setStudentData] = useState(null);

  useEffect(() => {
    if (passedStudent) {
      // Use the passed student data
      const levelNum = passedStudent.level ? parseInt(passedStudent.level.replace('Level ', '')) : 3;
      setLevel(levelNum);
      setOriginalLevel(levelNum);
      
      // Format the student data
      const formattedData = {
        name: passedStudent.name,
        id: passedStudent.studentId || Math.floor(10000 + Math.random() * 90000).toString(),
        grade: passedStudent.grade || 5,
        age: passedStudent.age ? passedStudent.age.replace(' years', '') : 10,
        mentalAge: passedStudent.mentalAge || 8,
        parentName: passedStudent.parent || "Parent Name",
        emergencyContact: passedStudent.emergencyContact || "+1-555-000-0000",
        avatar: passedStudent.photo || passedStudent.avatar || "",
        progress: {
          cognitive: Math.floor(Math.random() * 30) + 65,
          motorSkills: Math.floor(Math.random() * 30) + 60,
          social: Math.floor(Math.random() * 35) + 55,
          emotional: Math.floor(Math.random() * 30) + 65,
        }
      };
      
      const overall = Math.floor(
        (formattedData.progress.cognitive + formattedData.progress.motorSkills + 
         formattedData.progress.social + formattedData.progress.emotional) / 4
      );
      formattedData.progress.overall = overall;
      
      setStudentData(formattedData);
    } else {
      // Generate random student data as fallback
      const generateStudentData = () => {
        const firstNames = ["Sophia", "Liam", "Emma", "Noah", "Olivia", "Ava", "Isabella"];
        const lastNames = ["Clark", "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia"];
        const parentFirstNames = ["Emily", "Michael", "Sarah", "David", "Jennifer", "Robert"];
        
        const randomFirst = firstNames[Math.floor(Math.random() * firstNames.length)];
        const randomLast = lastNames[Math.floor(Math.random() * lastNames.length)];
        const randomParent = parentFirstNames[Math.floor(Math.random() * parentFirstNames.length)];
        
        return {
          name: `${randomFirst} ${randomLast}`,
          id: studentId || Math.floor(10000 + Math.random() * 90000).toString(),
          grade: Math.floor(Math.random() * 5) + 3,
          age: Math.floor(Math.random() * 4) + 8,
          mentalAge: Math.floor(Math.random() * 4) + 6,
          parentName: `${randomParent} ${randomLast}`,
          emergencyContact: `+1-555-${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`,
          progress: {
            cognitive: Math.floor(Math.random() * 30) + 65,
            motorSkills: Math.floor(Math.random() * 30) + 60,
            social: Math.floor(Math.random() * 35) + 55,
            emotional: Math.floor(Math.random() * 30) + 65,
          }
        };
      };
      
      const data = generateStudentData();
      const overall = Math.floor(
        (data.progress.cognitive + data.progress.motorSkills + 
         data.progress.social + data.progress.emotional) / 4
      );
      data.progress.overall = overall;
      
      setStudentData(data);
    }
  }, [studentId, passedStudent]);

  const handleLevelChange = (increment) => {
    setLevel(prev => {
      const newLevel = prev + increment;
      return Math.max(1, Math.min(10, newLevel));
    });
  };

  const handleSaveLevel = async () => {
    setSaving(true);
    setSuccessMessage("");
    
    try {
      // Update level in localStorage teacherStudents
      const students = JSON.parse(localStorage.getItem('teacherStudents') || '[]');
      const updatedStudents = students.map(s => {
        if (s.studentId === passedStudent?.studentId) {
          return { ...s, level: `Level ${level}` };
        }
        return s;
      });
      localStorage.setItem('teacherStudents', JSON.stringify(updatedStudents));
      
      // Also update the user object if this student is currently logged in
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      if (currentUser.role === 'student' && currentUser.studentId === passedStudent?.studentId) {
        currentUser.level = `Level ${level}`;
        localStorage.setItem('user', JSON.stringify(currentUser));
      }
      
      // Update local state
      setStudentData(prev => ({ ...prev, level: `Level ${level}` }));
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setOriginalLevel(level);
      setSuccessMessage(`Student level updated to ${level} successfully!`);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Failed to save level:", err);
    } finally {
      setSaving(false);
    }
  };

  if (!studentData) {
    return (
      <Container>
        <p style={{ textAlign: "center", padding: "3rem", color: "#6b7280" }}>
          Loading student profile...
        </p>
      </Container>
    );
  }
  return (
    <Container>
      <Header>
        <Logo>
          <span style={{ color: "#FF0000" }}>G</span>
          <span style={{ color: "#FFFF00" }}>e</span>
          <span style={{ color: "#008000" }}>s</span>
          <span style={{ color: "#0000FF" }}>t</span>
          <span style={{ color: "#800080" }}>u</span>
          <span style={{ color: "#FFC0CB" }}>r</span>
          <span style={{ color: "#FFA500" }}>a</span>
        </Logo>
      </Header>

      <Main>
        <SectionTitle>Student Profile</SectionTitle>
        <SectionSubtitle>View and manage student details and progress.</SectionSubtitle>

        {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}

        <ProfileCard>
          <Avatar />
          <ProfileInfo>
            <Name>{studentData.name}</Name>
            <StudentID>Student ID: {studentData.id}</StudentID>
            <div style={{ marginTop: "0.5rem" }}>
              <Badge>Grade: {studentData.grade}</Badge>
            </div>
            <LevelControl>
              <span style={{ fontSize: "0.875rem", color: "#6b7280", fontWeight: "500" }}>Game Level:</span>
              <LevelButton 
                onClick={() => handleLevelChange(-1)}
                disabled={level <= 1}
              >
                −
              </LevelButton>
              <LevelDisplay>Level {level}</LevelDisplay>
              <LevelButton 
                onClick={() => handleLevelChange(1)}
                disabled={level >= 10}
              >
                +
              </LevelButton>
              <SaveButton 
                onClick={handleSaveLevel}
                disabled={saving || level === originalLevel}
              >
                {saving ? "Saving..." : "Save Level"}
              </SaveButton>
            </LevelControl>
          </ProfileInfo>
        </ProfileCard>

        <CardRow>
        <InfoCard>
            <h3 style={{ fontWeight: 700, marginBottom: "1rem", color: "#1f2937" }}>Student Information</h3>
            <InfoItem>
            <InfoLabel>Parent Name</InfoLabel>
            <InfoValue>{studentData.parentName}</InfoValue>
            </InfoItem>
            <InfoItem>
            <InfoLabel>Age</InfoLabel>
            <InfoValue>{studentData.age}</InfoValue>
            </InfoItem>
            <InfoItem>
            <InfoLabel>Mental Age</InfoLabel>
            <InfoValue>{studentData.mentalAge}</InfoValue>
            </InfoItem>
            <InfoItem>
            <InfoLabel>Emergency Contact</InfoLabel>
            <InfoValue>{studentData.emergencyContact}</InfoValue>
            </InfoItem>
        </InfoCard>

        <ProgressGrid>
            <div>
            <Pie progress={studentData.progress.cognitive} color="#389cfa" />
            <ProgressText>Cognitive</ProgressText>
            </div>
            <div>
            <Pie progress={studentData.progress.motorSkills} color="#389cfa" />
            <ProgressText>Motor Skills</ProgressText>
            </div>
            <div>
            <Pie progress={studentData.progress.social} color="#389cfa" />
            <ProgressText>Social</ProgressText>
            </div>
            <div>
            <Pie progress={studentData.progress.emotional} color="#389cfa" />
            <ProgressText>Emotional</ProgressText>
            </div>
            <OverallProgress>
            <ProgressText>Overall Progress</ProgressText>
            <ProgressText large>{studentData.progress.overall}%</ProgressText>
            </OverallProgress>
        </ProgressGrid>
        </CardRow>

      </Main>
    </Container>
  );
}
