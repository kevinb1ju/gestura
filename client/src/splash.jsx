import React from "react";
import styled, { keyframes } from "styled-components";

// --- Animations ---
const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-30px); }
  60% { transform: translateY(-15px); }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
`;

const sparkle = keyframes`
  0%, 100% { opacity: 0; transform: scale(0.5); }
  50% { opacity: 1; transform: scale(1.2); }
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

// --- Styled Components ---
const Wrapper = styled.div`
  font-family: 'Fredoka', cursive;
  background: linear-gradient(to bottom, #7dd3fc, #38bdf8);
  height: 100vh;
  width: 100%;
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Cloud = styled.div`
  position: absolute;
  background: white;
  border-radius: 50%;
  opacity: ${(props) => props.opacity || 0.8};
  animation: ${float} ${(props) => props.speed || 6}s ease-in-out infinite;
  width: ${(props) => props.w || "100px"};
  height: ${(props) => props.h || "60px"};
  top: ${(props) => props.top};
  left: ${(props) => props.left};
  right: ${(props) => props.right};
  bottom: ${(props) => props.bottom};
`;

const Star = styled.div`
  position: absolute;
  color: #facc15;
  font-size: ${(props) => props.size || "24px"};
  animation: ${sparkle} 2s linear infinite;
  animation-delay: ${(props) => props.delay || "0s"};
  top: ${(props) => props.top};
  left: ${(props) => props.left};
  right: ${(props) => props.right};
  bottom: ${(props) => props.bottom};
`;

const TitleWrapper = styled.div`
  text-align: center;
  z-index: 10;
  animation: ${fadeIn} 2s ease-out;
`;

const TitleLetter = styled.span`
  display: inline-block;
  font-size: clamp(3rem, 8vw, 8rem);
  font-weight: bold;
  color: ${(props) => props.color};
  animation: ${bounce} 2s ease-in-out infinite;
  animation-delay: ${(props) => props.delay || "0s"};
  text-shadow: 2px 2px 0px #d1d5db, 4px 4px 0px #9ca3af, 6px 6px 0px #6b7280;
`;

const Subtitle = styled.p`
  margin-top: rem
  font-size: clamp(1rem, 2vw, 1.5rem);
  color: white;
  font-family: 'Roboto', sans-serif;
  font-weight: 00;
  opacity: 0;
  animation: ${fadeIn} 2s ease-out 1s forwards;
  letter-spacing: 0.05em;
`;

const Sun = styled.div`
  position: absolute;
  top: -4rem;
  right: -4rem;
  width: 16rem;
  height: 16rem;
  background: #facc15;
  border-radius: 50%;
  animation: ${spin} 20s linear infinite;
  &::before, &::after {
    content: "";
    position: absolute;
    background: #fde047;
    border-radius: 9999px;
  }
`;

const Ground = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 35%;
  overflow: hidden;
`;

const Hill = styled.div`
  position: absolute;
  bottom: 0;
  width: ${(props) => props.w};
  height: ${(props) => props.h};
  background: ${(props) => props.color};
  border-radius: 50% 50% 0 0;
  left: ${(props) => props.left};
  right: ${(props) => props.right};
`;

// --- Main Component ---
const SplashScreen = () => {
  const letters = [
    { c: "G", color: "#FF6B6B" },
    { c: "e", color: "#FFD166" },
    { c: "s", color: "#06D6A0" },
    { c: "t", color: "#118AB2" },
    { c: "u", color: "#7D53DE" },
    { c: "r", color: "#F786AA" },
    { c: "a", color: "#FF9F1C" },
  ];

  return (
    <Wrapper>
      {/* Clouds */}
      <Cloud top="40px" left="40px" w="128px" h="80px" />
      <Cloud top="80px" right="25%" w="192px" h="112px" opacity="0.7" speed={4} />
      <Cloud bottom="25%" left="25%" w="96px" h="64px" />
      <Cloud bottom="40px" right="40px" w="160px" h="96px" opacity="0.75" />

      {/* Stars */}
      <Star top="25%" left="25%" size="24px" delay="0.5s">✦</Star>
      <Star top="50%" left="33%" size="36px" delay="1s">✦</Star>
      <Star bottom="25%" right="25%" size="28px" delay="1.5s">✦</Star>
      <Star top="20%" right="20%" size="20px" delay="0.2s">✦</Star>
      <Star bottom="32%" left="32%" size="40px" delay="1.8s">✦</Star>

      {/* Title */}
      <TitleWrapper>
        <div>
          {letters.map((l, i) => (
            <TitleLetter key={i} color={l.color} delay={`${i * 0.1}s`}>
              {l.c}
            </TitleLetter>
          ))}
        </div>
        <Subtitle>Your Gateway to Fun & Learning!</Subtitle>
      </TitleWrapper>

      {/* Sun and Hills */}
      <Sun />
      <Ground>
        <Hill color="#22c55e" w="120%" h="12rem" left="50%" style={{ transform: "translateX(-50%)" }} />
        <Hill color="#16a34a" w="120%" h="14rem" right="-25%" />
        <Hill color="#15803d" w="100%" h="10rem" left="-25%" />
      </Ground>
    </Wrapper>
  );
};

export default SplashScreen;
