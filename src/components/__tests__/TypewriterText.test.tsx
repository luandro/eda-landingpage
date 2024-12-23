import React from "react";
import { render, act, screen, waitFor } from "@testing-library/react";
import TypewriterText from "../TypewriterText";

// Mock the NarrativeContext
jest.mock("@/contexts/NarrativeContext", () => ({
  useNarrative: jest.fn(),
}));

import { useNarrative } from "@/contexts/NarrativeContext";

jest.useFakeTimers();

describe("TypewriterText", () => {
  // Reset all mocks before each test
  beforeEach(() => {
    (useNarrative as jest.Mock).mockReset();
  });
  const mockSubtitles = [
    { text: "Test 1", backgroundColor: "#000", textColor: "white" as const },
    { text: "Test 2", backgroundColor: "#fff", textColor: "dark" as const },
  ];

  it("renders text character by character", async () => {
    render(
      <TypewriterText text="Hello" delay={100} subtitles={mockSubtitles} />,
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
        const element = screen.getByText((content) =>
          content.includes(expectedText),
        );
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
      />,
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
      />,
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

  it("shows/hides progress bar based on isPlaying state", () => {
    // Initially set isPlaying to false
    (useNarrative as jest.Mock).mockReturnValue({
      isPlaying: false,
      progress: 0,
      isComplete: false,
      currentText: "Test",
    });

    const { rerender } = render(<TypewriterText text="Test" delay={100} />);

    // Get the progress bar element
    const progressBar = document.querySelector(".bg-blue-500\\/10");
    expect(progressBar).toHaveStyle({ opacity: "0" }); // Initially hidden

    // Update mock to set isPlaying to true
    (useNarrative as jest.Mock).mockReturnValue({
      isPlaying: true,
      progress: 50,
      isComplete: false,
      currentText: "Test",
    });

    // Re-render with isPlaying true
    rerender(<TypewriterText text="Test" delay={100} />);

    expect(progressBar).toHaveStyle({ opacity: "1" }); // Visible when playing
  });
});
