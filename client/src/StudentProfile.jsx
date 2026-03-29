import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";

// ---------------- Styled Components ----------------
const Container = styled.div`
  min-height: 100vh;
  background-color: #f0f8ff;
  padding: 2rem;
  font-family: 'Plus Jakarta Sans', sans-serif;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: white;
  border: 1px solid #e5e7eb;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 0.9rem;
  color: #6b7280;
  transition: all 0.2s;
  
  &:hover {
    background: #f9fafb;
    color: #111827;
  }
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  color: #111827;
  margin: 0;
`;

const Card = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const StudentHeader = styled.div`
  display: flex;
  gap: 2rem;
  align-items: start;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #e5e7eb;
`;

const Avatar = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  color: white;
  font-weight: bold;
`;

const StudentInfo = styled.div`
  flex: 1;
`;

const StudentName = styled.h2`
  font-size: 2rem;
  font-weight: bold;
  color: #111827;
  margin: 0 0 0.5rem 0;
`;

const StudentMeta = styled.div`
  display: flex;
  gap: 2rem;
  color: #6b7280;
  font-size: 0.9rem;
  margin-bottom: 1rem;
`;

const MetaItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const MetaLabel = styled.span`
  font-size: 0.75rem;
  color: #9ca3af;
`;

const MetaValue = styled.span`
  font-weight: 600;
  color: #111827;
`;

const LevelControl = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
`;

const LevelButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 2px solid #0da6f2;
  background: white;
  color: #0da6f2;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #0da6f2;
    color: white;
  }
  
  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

const LevelDisplay = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #0da6f2;
  min-width: 60px;
  text-align: center;
`;

const Section = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: bold;
  color: #111827;
  margin-bottom: 1rem;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const InfoLabel = styled.span`
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
`;

const InfoValue = styled.span`
  font-size: 1rem;
  color: #111827;
  font-weight: 600;
`;

const ProgressSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
`;

const ProgressCard = styled.div`
  background: #f9fafb;
  padding: 1.5rem;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
`;

const ProgressTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 1rem 0;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 12px;
  background: #e5e7eb;
  border-radius: 9999px;
  overflow: hidden;
  margin-bottom: 0.5rem;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: ${props => props.color || '#0da6f2'};
  width: ${props => props.percentage}%;
  transition: width 0.3s ease;
  border-radius: 9999px;
`;

const ProgressPercentage = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${props => props.color || '#0da6f2'};
  text-align: center;
`;

const OverallProgress = styled.div`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
  border-radius: 1rem;
  color: white;
  text-align: center;
`;

const OverallTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
  opacity: 0.9;
`;

const OverallPercentage = styled.div`
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const OverallLabel = styled.div`
  font-size: 1rem;
  opacity: 0.8;
`;

const SaveButton = styled.button`
  background: #0da6f2;
  color: white;
  padding: 0.75rem 2rem;
  border-radius: 0.5rem;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #0b8ac9;
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
`;

// ---------------- Component ----------------
export default function StudentProfile() {
  const navigate = useNavigate();
  const { studentId } = useParams();
  const [student, setStudent] = useState(null);
  const [level, setLevel] = useState(3);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetchStudentData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentId]);

  const fetchStudentData = async () => {
    setLoading(true);
    try {
      // TODO: Fetch student from API
      // For now, using mock data
      const mockStudent = {
        id: studentId || "12345",
        name: "Sophia Clark",
        email: "sophia@example.com",
        age: 10,
        mentalAge: 8,
        grade: 5,
        level: 3,
        parentName: "Emily Clark",
        emergencyContact: "+1-555-123-4567",
        progress: {
          cognitive: 78,
          motorSkills: 65,
          social: 82,
          emotional: 75,
          overall: 75
        }
      };
      
      setStudent(mockStudent);
      setLevel(mockStudent.level);
    } catch (err) {
      console.error("Failed to fetch student data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLevelChange = (increment) => {
    setLevel(prev => {
      const newLevel = prev + increment;
      return Math.max(1, Math.min(10, newLevel)); // Keep between 1-10
    });
  };

  const handleSaveLevel = async () => {
    setSaving(true);
    setSuccessMessage("");
    
    try {
      // TODO: Save level to API
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      
      setSuccessMessage(`Student level updated to ${level} successfully!`);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Failed to save level:", err);
    } finally {
      setSaving(false);
    }
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 80) return '#10b981'; // Green
    if (percentage >= 60) return '#f59e0b'; // Orange
    return '#ef4444'; // Red
  };

  if (loading) {
    return (
      <Container>
        <p style={{ textAlign: "center", padding: "3rem", color: "#6b7280" }}>
          Loading student profile...
        </p>
      </Container>
    );
  }

  if (!student) {
    return (
      <Container>
        <p style={{ textAlign: "center", padding: "3rem", color: "#6b7280" }}>
          Student not found.
        </p>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate(-1)}>
          ← Back
        </BackButton>
        <Title>Student Profile</Title>
      </Header>

      <Card>
        {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
        
        <StudentHeader>
          <Avatar>{student.name.charAt(0)}</Avatar>
          <StudentInfo>
            <StudentName>{student.name}</StudentName>
            <StudentMeta>
              <MetaItem>
                <MetaLabel>Student ID</MetaLabel>
                <MetaValue>{student.id}</MetaValue>
              </MetaItem>
              <MetaItem>
                <MetaLabel>Grade</MetaLabel>
                <MetaValue>{student.grade}</MetaValue>
              </MetaItem>
            </StudentMeta>
            <div>
              <MetaLabel>Game Level</MetaLabel>
              <LevelControl>
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
                  disabled={saving || level === student.level}
                >
                  {saving ? "Saving..." : "Save Level"}
                </SaveButton>
              </LevelControl>
            </div>
          </StudentInfo>
        </StudentHeader>

        <Section>
          <SectionTitle>Student Information</SectionTitle>
          <InfoGrid>
            <InfoItem>
              <InfoLabel>Parent Name</InfoLabel>
              <InfoValue>{student.parentName}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Age</InfoLabel>
              <InfoValue>{student.age} years</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Mental Age</InfoLabel>
              <InfoValue>{student.mentalAge} years</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Emergency Contact</InfoLabel>
              <InfoValue>{student.emergencyContact}</InfoValue>
            </InfoItem>
          </InfoGrid>
        </Section>

        <Section>
          <SectionTitle>Progress Overview</SectionTitle>
          <ProgressSection>
            <ProgressCard>
              <ProgressTitle>Cognitive</ProgressTitle>
              <ProgressBar>
                <ProgressFill 
                  percentage={student.progress.cognitive}
                  color={getProgressColor(student.progress.cognitive)}
                />
              </ProgressBar>
              <ProgressPercentage color={getProgressColor(student.progress.cognitive)}>
                {student.progress.cognitive}%
              </ProgressPercentage>
            </ProgressCard>

            <ProgressCard>
              <ProgressTitle>Motor Skills</ProgressTitle>
              <ProgressBar>
                <ProgressFill 
                  percentage={student.progress.motorSkills}
                  color={getProgressColor(student.progress.motorSkills)}
                />
              </ProgressBar>
              <ProgressPercentage color={getProgressColor(student.progress.motorSkills)}>
                {student.progress.motorSkills}%
              </ProgressPercentage>
            </ProgressCard>

            <ProgressCard>
              <ProgressTitle>Social</ProgressTitle>
              <ProgressBar>
                <ProgressFill 
                  percentage={student.progress.social}
                  color={getProgressColor(student.progress.social)}
                />
              </ProgressBar>
              <ProgressPercentage color={getProgressColor(student.progress.social)}>
                {student.progress.social}%
              </ProgressPercentage>
            </ProgressCard>

            <ProgressCard>
              <ProgressTitle>Emotional</ProgressTitle>
              <ProgressBar>
                <ProgressFill 
                  percentage={student.progress.emotional}
                  color={getProgressColor(student.progress.emotional)}
                />
              </ProgressBar>
              <ProgressPercentage color={getProgressColor(student.progress.emotional)}>
                {student.progress.emotional}%
              </ProgressPercentage>
            </ProgressCard>
          </ProgressSection>
        </Section>

        <OverallProgress>
          <OverallTitle>Overall Progress</OverallTitle>
          <OverallPercentage>{student.progress.overall}%</OverallPercentage>
          <OverallLabel>Keep up the great work!</OverallLabel>
        </OverallProgress>
      </Card>
    </Container>
  );
}
