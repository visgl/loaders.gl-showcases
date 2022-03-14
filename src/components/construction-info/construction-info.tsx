import styled, {keyframes} from "styled-components";

const pulse = keyframes`
0% {
    opacity: 1;
    transform: scale(1);
}

100% {
    opacity: .25;
    transform: scale(.75)
    }
}
`;

const Info = styled.div`
position: absolute;
left: 40%;
top: 50%;
`;

const InfoTitle = styled.h1`
span:nth-child(1) {
    animation: ${pulse} .4s ease 0s infinite alternate;
}
span:nth-child(2) {
    animation: ${pulse} .4s ease 2s infinite alternate;
}
span:nth-child(3) {
    animation: ${pulse} .4s ease 3s infinite alternate;
}      
`;

export const ConstructionInfo = () => {
  return (
    <Info id="construction-info">
      <InfoTitle id="construction-title">
        We are working on it <span>.</span>
        <span>.</span>
        <span>.</span>
      </InfoTitle>
    </Info>
  );
};
