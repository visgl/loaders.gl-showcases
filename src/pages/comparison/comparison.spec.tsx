import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom'
import {Comparison} from './comparison'

describe("Comparison", () => {
  it("renders Comaparison component", () => {
    render(<Comparison />);
    screen.getByText("We are woriking on it...")
  });
});