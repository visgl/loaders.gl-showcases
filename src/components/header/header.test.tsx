//TODO Fix tests

import { render, screen } from "@testing-library/react";
import { Header } from "./header";

test("Render header logo", () => {
  render(<Header />);
  const logo = screen.getAllByRole("img");
  expect(logo).toHaveAttribute("src", "/esri-logo.jpg");
  expect(logo).toHaveAttribute("alt", "ESRI Logo");
});

test("Render menu items", () => {
  render(<Header />);
  const homeLink = screen.getByText(/Home/i);
  expect(homeLink).toBeInTheDocument();
  const I3SApp = screen.getByText(/I3S Explorer/i);
  expect(I3SApp).toBeInTheDocument();
  const I3SDebugApp = screen.getByText(/I3S Debug App/i);
  expect(I3SDebugApp).toBeInTheDocument();
  const AboutUs = screen.getByText(/About Us/i);
  expect(AboutUs).toBeInTheDocument();
});
