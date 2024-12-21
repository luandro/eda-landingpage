import React from 'react';
import { render, act, screen, waitFor } from '@testing-library/react';
import TypewriterText from '../TypewriterText';

jest.useFakeTimers();

describe('TypewriterText', () => {
  const mockSubtitles = [
    { text: "Test 1", backgroundColor: "#000", textColor: "white" as const },
    { text: "Test 2", backgroundColor: "#fff", textColor: "dark" as const }
  ];

  it('renders text character by character', async () => {
    render(<TypewriterText text="Hello" delay={100} />);
    
    expect(screen.getByText('|')).toBeInTheDocument();
    
    // Advance timers to type each character
    for (let i = 0; i < "Hello".length; i++) {
      act(() => {
        jest.advanceTimersByTime(100);
      });
      await waitFor(() => {
        const text = screen.getByText((content, element) => {
          const parent = element?.parentElement;
          return parent?.textContent === "Hello".substring(0, i + 1) + "|" || false;
        });
        expect(text).toBeInTheDocument();
      });
    }
  });

  it('calls onComplete when typing finishes', () => {
    const onComplete = jest.fn();
    render(<TypewriterText text="Hi" delay={100} onComplete={onComplete} />);
    
    act(() => {
      jest.advanceTimersByTime(300); // 2 characters * 100ms + extra tick
    });
    
    expect(onComplete).toHaveBeenCalled();
  });

  it('renders rotating subtitles when reaching placeholder', async () => {
    render(
      <TypewriterText 
        text="Hello {rotating} world" 
        delay={100}
        subtitles={mockSubtitles}
        showSubtitles={true}
      />
    );

    // Type until placeholder
    for (let i = 0; i < "Hello {rotating}".length; i++) {
      act(() => {
        jest.advanceTimersByTime(100);
      });
    }

    // Check if first subtitle is rendered
    await waitFor(() => {
      const text = screen.getByText((content, element) => {
        return element?.textContent === "Test 1" && element.closest('.text-white');
      });
      expect(text).toBeInTheDocument();
    });
  });
});
