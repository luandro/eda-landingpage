import React from "react";
import { render, screen } from "@testing-library/react";
import ChatContainer from "../ChatContainer";

// Mock framer-motion
jest.mock("framer-motion", () => ({
  motion: {
    div: ({ children, animate, transition, ...props }: any) => (
      <div
        {...props}
        data-testid="motion-div"
        data-animate={JSON.stringify(animate)}
        data-transition={JSON.stringify(transition)}
      >
        {children}
      </div>
    ),
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock chat content
jest.mock("../../config/chatContent.json", () => ({
  conversations: [
    {
      id: 1,
      messages: [
        {
          id: "1",
          type: "user",
          content: "Test message 1",
          timestamp: "12:00 PM",
        },
      ],
    },
  ],
}));

describe("ChatContainer", () => {
  it("renders loading state initially", () => {
    // Mock empty chat content
    const emptyContent = {
      conversations: [],
    };
    jest.mock("../../config/chatContent.json", () => emptyContent);

    render(<ChatContainer />);
    expect(screen.getByText("Loading messages...")).toBeInTheDocument();
  });

  it("applies continuous animation with correct timing", async () => {
    render(<ChatContainer />);

    // Wait for messages to be loaded
    const message1 = await screen.findByText("Test message 1");
    expect(message1).toBeInTheDocument();

    const containerDiv = screen.getByTestId("chat-container");
    const animate = JSON.parse(
      containerDiv.getAttribute("data-animate") || "{}",
    );
    const transition = JSON.parse(
      containerDiv.getAttribute("data-transition") || "{}",
    );

    // Check animation properties
    expect(animate.y).toEqual([0, "-150px", "-150px", 0]); // 1 message * 150px
    expect(transition).toEqual({
      duration: 2, // 1 message * 2 seconds
      times: [0, 0.4, 0.5, 1],
      repeat: Infinity,
      ease: "linear",
      repeatDelay: 3, // 3-second pause at the end
    });
  });

  it("has no overflow-y-auto class", async () => {
    render(<ChatContainer />);

    // Wait for messages to be loaded
    await screen.findByText("Test message 1");

    const containerDiv = screen.getByTestId("chat-container");
    expect(containerDiv.className).toContain("overflow-hidden");
    expect(containerDiv.className).not.toContain("overflow-y-auto");
  });
});
