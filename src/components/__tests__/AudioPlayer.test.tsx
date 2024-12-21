import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import AudioPlayer from "../AudioPlayer";

jest.mock("../DividingLine", () => {
  return function MockDividingLine() {
    return <div data-testid="dividing-line" />;
  };
});

describe("AudioPlayer", () => {
  const mockOnPlay = jest.fn();
  const mockOnPause = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders play button when not playing", () => {
    render(
      <AudioPlayer onPlay={mockOnPlay} onPause={mockOnPause} isPlaying={false} />
    );
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("renders pause button when playing", () => {
    render(
      <AudioPlayer onPlay={mockOnPlay} onPause={mockOnPause} isPlaying={true} />
    );
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("calls onPlay when play button is clicked", () => {
    render(
      <AudioPlayer onPlay={mockOnPlay} onPause={mockOnPause} isPlaying={false} />
    );
    fireEvent.click(screen.getByRole("button"));
    expect(mockOnPlay).toHaveBeenCalledTimes(1);
    expect(mockOnPause).not.toHaveBeenCalled();
  });

  it("calls onPause when pause button is clicked", () => {
    render(
      <AudioPlayer onPlay={mockOnPlay} onPause={mockOnPause} isPlaying={true} />
    );
    fireEvent.click(screen.getByRole("button"));
    expect(mockOnPause).toHaveBeenCalledTimes(1);
    expect(mockOnPlay).not.toHaveBeenCalled();
  });

  it("renders the dividing line", () => {
    render(
      <AudioPlayer onPlay={mockOnPlay} onPause={mockOnPause} isPlaying={false} />
    );
    expect(screen.getByTestId("dividing-line")).toBeInTheDocument();
  });
});