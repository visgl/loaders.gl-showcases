import styled from "styled-components";
import {color_brand_quaternary} from "../../constants/colors";

type OptionsButtonProps = {
  id: string;
  onOptionsClick: (id: string) => void;
};

const OptionsButton = styled.div`
  position: relative;
  width: 4px;
  height: 4px;
  background-color: ${color_brand_quaternary};
  border-radius: 50%;
  margin-bottom: 12px;

  &:before,
  &:after {
    content: "";
    position: absolute;
    width: 4px;
    height: 4px;
    left: 0px;
    background-color: ${color_brand_quaternary};
    border-radius: inherit;
  }

  &:before {
    top: 6px;
  }

  &:after {
    top: 12px;
  }
`;

export const OptionButton = ({id, onOptionsClick}: OptionsButtonProps) => {
  return <OptionsButton onClick={() => onOptionsClick(id)} />;
};
