export const DropDownStyle = `
  position: static;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 4px 16px;
  height: 28px;
  cursor: pointer;
  border-radius: 4px;
  box-sizing: border-box;
    option {
      color: white;
      background: #0E111A;
      display: flex;
      white-space: pre;
      min-height: 20px;
      padding: 0px 2px 1px;
    }
  &:hover {
    background: #4F52CC;
    color: black;
  }
`;

export const Color = `
  background: #0E111A;
  color: white;
`;

export const Font = `
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 19px;
  letter-spacing: 0em;
  text-align: left;
`;
