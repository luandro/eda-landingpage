import React from "react";
import { render, act, screen } from "@testing-library/react";
import HeroSection from "../sections/HeroSection";

jest.useFakeTimers();

describe("HeroSection", () => {
  const defaultProps = {
    currentText: "Test text",
    currentTime: 0,
    isPlaying: false,
    onPlay: jest.fn(),
    onPause: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders with default text when not playing", () => {
    render(<HeroSection {...defaultProps} />);
    expect(screen.getByText("Test text")).toBeInTheDocument();
  });

  it("shows play button when not playing", () => {
    render(<HeroSection {...defaultProps} />);
    expect(screen.getByText("Aperte o Play para iniciar")).toBeInTheDocument();
  });

  it("updates content based on currentTime", () => {
    const props = {
      ...defaultProps,
      isPlaying: true,
      currentTime: 1000, // 1 second
    };
    render(<HeroSection {...props} />);
    expect(screen.getByText("Test text")).toBeInTheDocument();
  });

  it("handles play/pause toggle", () => {
    const { rerender } = render(<HeroSection {...defaultProps} />);

    // Test play
    act(() => {
      screen.getByRole("button").click();
    });
    expect(defaultProps.onPlay).toHaveBeenCalled();

    // Test pause
    rerender(<HeroSection {...defaultProps} isPlaying={true} />);
    act(() => {
      screen.getByRole("button").click();
    });
    expect(defaultProps.onPause).toHaveBeenCalled();
  });
});
