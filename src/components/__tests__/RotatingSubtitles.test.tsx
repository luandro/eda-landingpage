import React from "react";
import { render, act, screen, fireEvent, waitFor } from "@testing-library/react";
import RotatingSubtitles from "../RotatingSubtitles";

jest.useFakeTimers();

describe("RotatingSubtitles", () => {
  const mockSubtitles = [
    { text: "Test 1", backgroundColor: "#000", textColor: "white" as const },
    {
      text: "Test 2",
      backgroundColor: "#fff",
      textColor: "dark" as const,
      href: "#test",
    },
  ];

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    // Mock scrollIntoView
    window.HTMLElement.prototype.scrollIntoView = jest.fn();
  });

  it("renders first subtitle initially", () => {
    render(<RotatingSubtitles subtitles={mockSubtitles} />);
    const element = screen.getByText((content) => content.includes("Test 1"));
    expect(element).toBeInTheDocument();
    expect(element.closest(".text-white")).toBeTruthy();
  });

  it("rotates through subtitles", () => {
    render(
      <RotatingSubtitles subtitles={mockSubtitles} rotationSpeed={1000} />,
    );

    act(() => {
      jest.advanceTimersByTime(1500); // 1000ms rotation + 500ms transition
    });

    const element = screen.getByText((content) => content.includes("Test 2"));
    expect(element).toBeInTheDocument();
    expect(element.closest("a")).toBeTruthy();
  });

  it("renders links for subtitles with href", () => {
    render(<RotatingSubtitles subtitles={mockSubtitles} />);

    act(() => {
      jest.advanceTimersByTime(4500); // 4000ms rotation + 500ms transition
    });

    const element = screen.getByText((content) => content.includes("Test 2"));
    expect(element).toBeInTheDocument();
    expect(element.closest("a")).toHaveAttribute("href", "#test");
  });

  it("scrolls to section when clicking link", () => {
    render(<RotatingSubtitles subtitles={mockSubtitles} />);

    act(() => {
      jest.advanceTimersByTime(4500); // 4000ms rotation + 500ms transition
    });

    const element = screen.getByText((content) => content.includes("Test 2"));
    expect(element).toBeInTheDocument();
    fireEvent.click(element);

    expect(window.HTMLElement.prototype.scrollIntoView).toHaveBeenCalled();
  });

  it("animates text with typewriter effect when enabled", async () => {
    render(
      <RotatingSubtitles
        subtitles={mockSubtitles}
        typewriterEnabled={true}
        typewriterDelay={100}
      />,
    );

    // Check initial empty state
    await waitFor(() => {
      const element = screen.getByText((content) => content === "", {
        selector: ".text-white",
      });
      expect(element).toBeInTheDocument();
    });

    // Advance time to type each character
    for (let i = 0; i < "Test 1".length; i++) {
      act(() => {
        jest.advanceTimersByTime(100);
      });
    }

    // Check final state
    await waitFor(() => {
      const element = screen.getByText((content) => content === "Test 1", {
        selector: ".text-white",
      });
      expect(element).toBeInTheDocument();
    });
  });

  it("types new subtitle after rotation", async () => {
    render(
      <RotatingSubtitles
        subtitles={mockSubtitles}
        typewriterEnabled={true}
        typewriterDelay={100}
        rotationSpeed={1000}
      />,
    );

    // Wait for first subtitle to finish typing
    for (let i = 0; i < "Test 1".length; i++) {
      act(() => {
        jest.advanceTimersByTime(100);
      });
    }

    // Check first subtitle is fully typed
    await waitFor(() => {
      const element = screen.getByText((content) => content === "Test 1", {
        selector: ".text-white",
      });
      expect(element).toBeInTheDocument();
    });

    // Trigger rotation
    act(() => {
      jest.advanceTimersByTime(1500); // 1000ms rotation + 500ms transition
    });

    // Check initial state of second subtitle
    await waitFor(() => {
      const element = screen.getByText((content) => content === "", {
        selector: "a",
      });
      expect(element).toBeInTheDocument();
    });

    // Wait for second subtitle to finish typing
    for (let i = 0; i < "Test 2".length; i++) {
      act(() => {
        jest.advanceTimersByTime(100);
      });
    }

    // Check final state of second subtitle
    await waitFor(() => {
      const element = screen.getByText((content) => content === "Test 2", {
        selector: "a",
      });
      expect(element).toBeInTheDocument();
    });
  });
});
