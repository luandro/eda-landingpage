import React from 'react';
import { render, act, screen, fireEvent } from '@testing-library/react';
import RotatingSubtitles from '../RotatingSubtitles';

jest.useFakeTimers();

describe('RotatingSubtitles', () => {
  const mockSubtitles = [
    { text: "Test 1", backgroundColor: "#000", textColor: "white" as const },
    { text: "Test 2", backgroundColor: "#fff", textColor: "dark" as const, href: "#test" }
  ];

  beforeEach(() => {
    // Mock scrollIntoView
    Element.prototype.scrollIntoView = jest.fn();
  });

  it('renders first subtitle initially', () => {
    render(<RotatingSubtitles subtitles={mockSubtitles} />);
    const text = screen.getByText((content, element) => {
      return element?.textContent === 'Test 1' && element.closest('.text-white');
    });
    expect(text).toBeInTheDocument();
  });

  it('rotates through subtitles', () => {
    render(<RotatingSubtitles subtitles={mockSubtitles} rotationSpeed={1000} />);
    
    act(() => {
      jest.advanceTimersByTime(1500); // 1000ms rotation + 500ms transition
    });
    
    const text = screen.getByText((content, element) => {
      return element?.textContent === 'Test 2' && element.closest('a');
    });
    expect(text).toBeInTheDocument();
  });

  it('renders links for subtitles with href', () => {
    render(<RotatingSubtitles subtitles={mockSubtitles} />);
    
    act(() => {
      jest.advanceTimersByTime(4500); // 4000ms rotation + 500ms transition
    });
    
    const link = screen.getByText((content, element) => {
      return element?.textContent === 'Test 2' && element.closest('a');
    });
    expect(link.closest('a')).toHaveAttribute('href', '#test');
  });

  it('scrolls to section when clicking link', () => {
    render(<RotatingSubtitles subtitles={mockSubtitles} />);
    
    act(() => {
      jest.advanceTimersByTime(4500); // 4000ms rotation + 500ms transition
    });
    
    const link = screen.getByText((content, element) => {
      return element?.textContent === 'Test 2' && element.closest('a');
    });
    fireEvent.click(link);
    
    expect(Element.prototype.scrollIntoView).toHaveBeenCalled();
  });
});
