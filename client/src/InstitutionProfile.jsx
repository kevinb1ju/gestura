import React, { useState, useEffect } from "react";
import API_URL from "./config";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import { 
  ArrowLeft, 
  Building2, 
  Users, 
  GraduationCap, 
  Calendar, 
  MapPin, 
  ShieldCheck, 
  Edit3, 
  Trash2
} from "lucide-react";

// ---------------- Styled Components ----------------
const Container = styled.div`
  min-height: 100vh;
  background-color: #f8fafc;
  padding: 2.5rem;
  font-family: 'Plus Jakarta Sans', sans-serif;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2.5rem;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.05);
  padding: 0.75rem 1.25rem;
  border-radius: 1rem;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 700;
  color: #64748b;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02);
  
  &:hover {
    background: #0da6f2;
    color: white;
    transform: translateX(-4px);
    box-shadow: 0 10px 15px -3px rgba(13, 166, 242, 0.2);
  }
`;

const Card = styled.div`
  background: white;
  border-radius: 2rem;
  padding: 2.5rem;
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.02);
  margin-bottom: 2rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: linear-gradient(90deg, #0da6f2, #8338ec);
  }
`;

const InstitutionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
`;

const InstitutionInfo = styled.div`
  flex: 1;
`;

const InstitutionName = styled.h2`
  font-size: 2rem;
  font-weight: bold;
  color: #111827;
  margin: 0 0 0.5rem 0;
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 0.35rem 1rem;
  font-size: 0.8rem;
  font-weight: 700;
  border-radius: 9999px;
  background-color: ${(props) => props.color || "#d1fae5"};
  color: ${(props) => props.textColor || "#111827"};
  border: 1px solid rgba(0, 0, 0, 0.05);
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 1rem;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
  
  ${props => props.variant === 'primary' && `
    background-color: #0da6f2;
    color: white;
    box-shadow: 0 4px 12px rgba(13, 166, 242, 0.2);
    &:hover {
      background-color: #0b8ac9;
      transform: translateY(-2px);
    }
  `}
  
  ${props => props.variant === 'danger' && `
    background-color: rgba(239, 68, 68, 0.1);
    color: #ef4444;
    border: 1px solid rgba(239, 68, 68, 0.2);
    &:hover {
      background-color: #ef4444;
      color: white;
      transform: translateY(-2px);
    }
  `}
`;

const DetailsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
`;

const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const DetailLabel = styled.span`
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
`;

const DetailValue = styled.span`
  font-size: 1.125rem;
  color: #1e293b;
  font-weight: 800;
`;

const Avatar = styled.div`
  width: 3rem;
  height: 3rem;
  border-radius: 1rem;
  background: ${(props) => props.bg || "rgba(13, 166, 242, 0.1)"};
  color: ${(props) => props.color || "#0da6f2"};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 1.25rem;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: #6b7280;
`;

// ---------------- Component ----------------
export default function InstitutionProfile() {
  const navigate = useNavigate();
  const { institutionName } = useParams();
  const [institution, setInstitution] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInstitutionData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [institutionName]);

  const fetchInstitutionData = async () => {
    setLoading(true);
    try {
      const decodedName = decodeURIComponent(institutionName);
      
      // Fetch institutions
      const instResponse = await fetch(`${API_URL}/institutions`);
      const instData = await instResponse.json();
      
      if (instResponse.ok) {
        const foundInst = instData.institutions.find(
          i => i.name === decodedName
        );
        setInstitution(foundInst);
      }

      // Fetch teachers for this institution
      const teachersResponse = await fetch(
        `${API_URL}/users?role=teacher&institution=${encodeURIComponent(decodedName)}`
      );
      const teachersData = await teachersResponse.json();
      if (teachersResponse.ok) {
        setTeachers(teachersData.users || []);
      }
      
      // Fetch students for this institution from localStorage (added by teachers)
      try {
        const localStudents = JSON.parse(localStorage.getItem('teacherStudents') || '[]');
        const institutionStudents = localStudents.filter(
          s => (s.institution || '').toLowerCase() === decodedName.toLowerCase()
        );
        setStudents(institutionStudents);
      } catch (e) {
        console.error("Failed to load students from localStorage:", e);
        setStudents([]);
      }
      
    } catch (err) {
      console.error("Failed to fetch institution data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to permanently delete "${institution.name}"? All associated teachers and students will also be removed. This action cannot be undone.`)) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/institutions/${institution._id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        // Also cleanup localStorage students for this institution
        try {
          const localStudents = JSON.parse(localStorage.getItem('teacherStudents') || '[]');
          const updatedStudents = localStudents.filter(
            s => (s.institution || '').toLowerCase() !== institution.name.toLowerCase()
          );
          localStorage.setItem('teacherStudents', JSON.stringify(updatedStudents));
        } catch (e) {
          console.error("Failed to cleanup localStorage:", e);
        }

        alert("Institution and all associated data deleted successfully.");
        navigate("/admin-dashboard");
      } else {
        const data = await response.json();
        alert(data.message || "Failed to delete institution.");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("Connection error. Could not delete institution.");
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case "Active": return { color: "#d1fae5", textColor: "#065f46" };
      case "Pending": return { color: "#fef3c7", textColor: "#92400e" };
      case "Inactive": return { color: "#fee2e2", textColor: "#991b1b" };
      default: return { color: "#d1fae5", textColor: "#065f46" };
    }
  };

  const generateRegistrationId = (name) => {
    const prefix = name.split(' ').map(word => word[0]).join('').toUpperCase();
    return `${prefix}-2024-001`;
  };

  if (loading) {
    return (
      <Container>
        <p style={{ textAlign: "center", padding: "3rem", color: "#6b7280" }}>
          Loading institution details...
        </p>
      </Container>
    );
  }

  if (!institution) {
    return (
      <Container>
        <EmptyState>
          <h2>Institution not found</h2>
          <p>The institution you're looking for doesn't exist.</p>
          <Button variant="primary" onClick={() => navigate("/admin-dashboard")}>
            Back to Dashboard
          </Button>
        </EmptyState>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <BackButton onClick={() => navigate("/admin-dashboard")}>
          <ArrowLeft size={20} /> Back to Command Center
        </BackButton>
        <StatusBadge color="rgba(13, 166, 242, 0.1)" textColor="#0da6f2">
          <ShieldCheck size={14} style={{ marginRight: '4px' }} /> Verified Institution
        </StatusBadge>
      </Header>

      <Card>
        <InstitutionHeader>
          <InstitutionInfo>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
              <Avatar bg="rgba(131, 56, 236, 0.1)" color="#8338ec">
                <Building2 size={24} />
              </Avatar>
              <InstitutionName>{institution.name}</InstitutionName>
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
              <StatusBadge {...getStatusColor(institution.status)}>
                {institution.status}
              </StatusBadge>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.85rem', fontWeight: 600 }}>
                <MapPin size={14} /> Springfield, USA
              </div>
            </div>
          </InstitutionInfo>
          <ActionButtons>
            <Button variant="primary">
              <Edit3 size={18} /> Edit
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              <Trash2 size={18} /> Delete Institution
            </Button>
          </ActionButtons>
        </InstitutionHeader>

        <DetailsGrid>
          <DetailItem>
            <DetailLabel><Calendar size={14} style={{ marginBottom: '-2px', marginRight: '4px' }} /> Registration ID</DetailLabel>
            <DetailValue>{generateRegistrationId(institution.name)}</DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailLabel><Users size={14} style={{ marginBottom: '-2px', marginRight: '4px' }} /> Lead Teacher</DetailLabel>
            <DetailValue>{teachers.length > 0 ? teachers[0].name : "Not Assigned"}</DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailLabel><Users size={14} style={{ marginBottom: '-2px', marginRight: '4px' }} /> Total Staff</DetailLabel>
            <DetailValue>{teachers.length}</DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailLabel><GraduationCap size={14} style={{ marginBottom: '-2px', marginRight: '4px' }} /> Enrolled Students</DetailLabel>
            <DetailValue>{students.length}</DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailLabel><ShieldCheck size={14} style={{ marginBottom: '-2px', marginRight: '4px' }} /> Security Status</DetailLabel>
            <DetailValue>Encrypted</DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailLabel><Clock size={14} style={{ marginBottom: '-2px', marginRight: '4px' }} /> Onboarded</DetailLabel>
            <DetailValue>{new Date(institution.createdAt).toLocaleDateString()}</DetailValue>
          </DetailItem>
        </DetailsGrid>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', marginTop: '3rem' }}>
          <Section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <SectionTitle>
                <Users size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} /> 
                Teaching Staff
              </SectionTitle>
              <StatusBadge color="#f1f5f9" textColor="#64748b">{teachers.length} Active</StatusBadge>
            </div>
            {teachers.length === 0 ? (
              <EmptyState>
                <Users size={40} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                <p>No teachers registered for this institution.</p>
              </EmptyState>
            ) : (
              <MemberList>
                {teachers.map((teacher, idx) => (
                  <MemberItem key={idx}>
                    <MemberInfo>
                      <Avatar bg="rgba(13, 166, 242, 0.1)" color="#0da6f2">
                        {teacher.name[0]}
                      </Avatar>
                      <div>
                        <div style={{ fontWeight: 800, color: '#1e293b' }}>{teacher.name}</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Mail size={12} /> {teacher.email}
                        </div>
                      </div>
                    </MemberInfo>
                    <ChevronRight size={18} color="#cbd5e1" />
                  </MemberItem>
                ))}
              </MemberList>
            )}
          </Section>

          <Section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <SectionTitle>
                <GraduationCap size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} /> 
                Student Roster
              </SectionTitle>
              <StatusBadge color="#f1f5f9" textColor="#64748b">{students.length} Enrolled</StatusBadge>
            </div>
            {students.length === 0 ? (
              <EmptyState>
                <GraduationCap size={40} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                <p>No students enrolled yet.</p>
              </EmptyState>
            ) : (
              <MemberList>
                {students.map((student, idx) => (
                  <MemberItem key={idx}>
                    <MemberInfo>
                      <Avatar bg="rgba(6, 214, 160, 0.1)" color="#06d6a0">
                        {student.name[0]}
                      </Avatar>
                      <div>
                        <div style={{ fontWeight: 800, color: '#1e293b' }}>{student.name}</div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <TrendingUp size={12} /> Performance Tracked
                        </div>
                      </div>
                    </MemberInfo>
                    <ChevronRight size={18} color="#cbd5e1" />
                  </MemberItem>
                ))}
              </MemberList>
            )}
          </Section>
        </div>
      </Card>
    </Container>
  );
}
