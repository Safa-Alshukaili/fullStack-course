import '@testing-library/jest-dom'; 
import { describe, it, expect } from "vitest";// Import necessary testing functions from Vitest
import { render,screen } from "@testing-library/react";// Import the render function from React Testing Library to render React components in a test environment
import About from "../src/Components/About";// Import the About component to be tested
import React from "react"; // Import React to support JSX syntax 
import '@testing-library/jest-dom';


describe("About", () => {
    //Test Case 1
    it("should render the About component", () => {
      render(<About />);  // Render the About component
      
      //Assertion: check if there is an h1 element 
      const aboutElement = screen.getByRole('heading', {level: 1})
      expect(aboutElement).toBeInTheDocument();
    });
  
//Test Case 2
    it("should have the text about", () => {
      render(<About />);
      const text = screen.queryByText(/about/i); 
      expect(text).toBeInTheDocument();
      console.log(text);
  }); 
//Test Case 3
it("should have the image", () => {
  render(<About />);
  const image = screen.getByAltText('devimage')
  expect(image).toHaveClass('userImage');
});  

//Test Case 4
test('should render an <img> element',() => {
    render(<About/>);
    const image = screen.getByRole('img'); //get by role 'img'
    expect(image).toBeInTheDocument();
});

//Test Case 5
it('should have a src attribute', () => {
    render(<About/>);
    const image = screen.getByAltText('devimage');
    expect(image).toHaveAttribute('src');
});

//Test Case 6
it('should have the correct CSS class', () => {
    render(<About/>);
    const image = screen.getByAltText('devimage');
    expect(image).toHaveClass('userImage');
});
  });