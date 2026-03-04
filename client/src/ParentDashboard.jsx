import React, { useState, useEffect } from "react";
import styled from "styled-components";

const Container = styled.div`
  font-family: "Quicksand", sans-serif;
  background-color: #f0f7ff;
  color: #1e293b;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  position: sticky;
  top: 0;
  background: rgba(240, 247, 255, 0.8);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid #cbd5e1;
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
  &:nth-child(1) {
    color: #ef4444;
  }
  &:nth-child(2) {
    color: #facc15;
  }
  &:nth-child(3) {
    color: #4ade80;
  }
  &:nth-child(4) {
    color: #3b82f6;
  }
  &:nth-child(5) {
    color: #a855f7;
  }
  &:nth-child(6) {
    color: #ec4899;
  }
  &:nth-child(7) {
    color: #f97316;
  }
`;

const ProfileImg = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-size: cover;
  background-position: center;
`;

const Main = styled.main`
  flex-grow: 1;
  padding: 48px 24px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Section = styled.section`
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 32px;
`;

const Title = styled.h2`
  font-family: "Fredoka", sans-serif;
  font-size: 32px;
  font-weight: 700;
`;

const Subtext = styled.p`
  color: #64748b;
  margin-top: 4px;
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
  color: #13a4ec;
`;

const ChartWrapper = styled.div`
  height: 200px;
  width: 100%;
`;

const ProgressFooter = styled.div`
  display: flex;
  justify-content: space-around;
  border-top: 1px solid #e2e8f0;
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

export default function ParentDashboard() {
  const [parentData, setParentData] = useState(null);
  const [studentData, setStudentData] = useState(null);
  const [reportData, setReportData] = useState(null);

  useEffect(() => {
    // Get logged-in parent data from localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.role === 'parent') {
      setParentData(user);

      // Find the student data from teacherStudents
      const students = JSON.parse(localStorage.getItem('teacherStudents') || '[]');
      const child = students.find(s => s.studentId === user.studentId);
      setStudentData(child);

      // Fetch the parent report sent by the teacher
      const reportKey = `parent_report_${user.studentId}`;
      const savedReport = localStorage.getItem(reportKey);
      if (savedReport) {
        setReportData(JSON.parse(savedReport));
      }
    }
  }, []);

  // Extract level number
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
        <div>
          <Title>Parent Dashboard</Title>
          <Subtext>Review your child's progress and feedback from their teacher.</Subtext>
        </div>

        <Section>
          <ChildInfo>
            <ChildImg
              src={studentData?.photo || studentData?.avatar || "https://lh3.googleusercontent.com/aida-public/AB6AXuBtoxodHFcm333X5bYA_OtgWF1dIOvChUzxfid7nyTiqhZiRR5cawKYJRYcroLVbmt2U23_s2bUudXMcqZL_1MvTzUg4SoRy2wMOz8dhlJXQwUh7bbA2DUAHciQz4PMu2GSFpQjGZJHmQZnxOdAS343NGHuDvivqkh2RKD79HO0a4eRpcLynGqKc1cRzAgBv-6ZRBie75CLCx2k5IF_G2Zr9YNQZbs1crg4dp0JFg_jVy4DGi53G_JGBlKtouzaWZwWZjf0GaD2C6__"}
              alt={studentData?.name || "Student"}
            />
            <ChildText>
              <ChildName>{studentData?.name || 'Your Child'}</ChildName>
              <ChildDetails>
                Age: {studentData?.age?.replace(' years', '') || 'N/A'},
                Grade: {studentData?.grade || 'N/A'},
                Level: {currentLevel}
              </ChildDetails>
            </ChildText>
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
                  stroke="#13a4ec"
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
                    <stop stopColor="#13a4ec" stopOpacity="0.2" />
                    <stop offset="1" stopColor="#13a4ec" stopOpacity="0" />
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
    </Container>
  );
}
