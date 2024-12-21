import React from "react";
import { render, act, screen, waitFor } from "@testing-library/react";
import TypewriterText from "../TypewriterText";

jest.useFakeTimers();

describe("TypewriterText", () => {
  const mockSubtitles = [
    { text: "Test 1", backgroundColor: "#000", textColor: "white" as const },
    { text: "Test 2", backgroundColor: "#fff", textColor: "dark" as const },
  ];

  it("renders text character by character", async () => {
    render(
      <TypewriterText 
        text="Hello" 
        delay={100} 
        subtitles={mockSubtitles}
      />
    );

    expect(screen.getByText("|")).toBeInTheDocument();

    // Advance timers to type each character
    for (let i = 0; i < "Hello".length; i++) {
      act(() => {
        jest.advanceTimersByTime(100);
      });

      // Wait for the current substring to appear
      await waitFor(() => {
        const expectedText = "Hello".substring(0, i + 1);
        const element = screen.getByText((content) => content.includes(expectedText));
        expect(element).toBeInTheDocument();
      });
    }
  });

  it("calls onComplete when typing finishes", async () => {
    const onComplete = jest.fn();
    render(
      <TypewriterText 
        text="Hi" 
        delay={100} 
        onComplete={onComplete}
        subtitles={mockSubtitles}
      />
    );

    // Type each character
    for (let i = 0; i < "Hi".length; i++) {
      act(() => {
        jest.advanceTimersByTime(100);
      });
    }

    // Wait for onComplete to be called
    await waitFor(() => {
      expect(onComplete).toHaveBeenCalled();
    });
  });

  it("renders rotating subtitles when reaching placeholder", async () => {
    render(
      <TypewriterText
        text="Hello {rotating} world"
        delay={100}
        subtitles={mockSubtitles}
      />
    );

    // Type until placeholder
    for (let i = 0; i < "Hello {rotating}".length; i++) {
      act(() => {
        jest.advanceTimersByTime(100);
      });
    }

    // Wait for the first subtitle to start typing
    await waitFor(() => {
      const element = screen.getByText((content) => content === "", {
        selector: ".text-white",
      });
      expect(element).toBeInTheDocument();
    });

    // Wait for the first subtitle to finish typing
    for (let i = 0; i < "Test 1".length; i++) {
      act(() => {
        jest.advanceTimersByTime(100);
      });
    }

    await waitFor(() => {
      const element = screen.getByText("Test 1");
      expect(element).toBeInTheDocument();
    });
  });
});