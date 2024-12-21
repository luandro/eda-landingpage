import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import ChatMessage, { ChatMessageProps, AnimationConfig } from '../ChatMessage';

// Mock framer-motion to avoid animation-related warnings in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, initial, animate, transition, ...props }: any) => (
      <div
        {...props}
        data-testid="motion-div"
        data-initial={JSON.stringify(initial)}
        data-animate={JSON.stringify(animate)}
        data-transition={JSON.stringify(transition)}
      >
        {children}
      </div>
    ),
  },
}));

describe('ChatMessage', () => {
  const defaultProps: ChatMessageProps = {
    type: 'user',
    content: 'Test message',
    timestamp: '12:00 PM',
  };

  it('renders with default animations', () => {
    render(<ChatMessage {...defaultProps} />);
    expect(screen.getByText('Test message')).toBeInTheDocument();
    expect(screen.getByText('12:00 PM')).toBeInTheDocument();
  });

  it('accepts custom animation configuration', () => {
    const customAnimation: AnimationConfig = {
      initial: { opacity: 0, scale: 0.8, x: 10 }, // Explicitly set x to override default
      animate: { opacity: 1, scale: 1 },
      transition: { duration: 0.3 },
    };

    render(<ChatMessage {...defaultProps} animation={customAnimation} />);

    const motionDiv = screen.getByTestId('motion-div');
    const initial = JSON.parse(motionDiv.getAttribute('data-initial') || '{}');
    const animate = JSON.parse(motionDiv.getAttribute('data-animate') || '{}');
    const transition = JSON.parse(motionDiv.getAttribute('data-transition') || '{}');

    expect(initial).toEqual(customAnimation.initial);
    expect(animate).toEqual(customAnimation.animate);
    expect(transition).toEqual(customAnimation.transition);
  });

  it('handles array of animations', () => {
    const animations: AnimationConfig[] = [
      {
        initial: { opacity: 0, scale: 0.8, x: 10 }, // Explicitly set x to override default
        animate: { opacity: 1, scale: 1 },
        transition: { duration: 0.3 },
      },
      {
        initial: { x: -20 },
        animate: { x: 0 },
        transition: { duration: 0.5 },
      },
    ];

    render(<ChatMessage {...defaultProps} animation={animations} />);

    const motionDiv = screen.getByTestId('motion-div');
    const initial = JSON.parse(motionDiv.getAttribute('data-initial') || '{}');
    const animate = JSON.parse(motionDiv.getAttribute('data-animate') || '{}');
    const transition = JSON.parse(motionDiv.getAttribute('data-transition') || '{}');

    expect(initial).toEqual(animations[0].initial);
    expect(animate).toEqual(animations[0].animate);
    expect(transition).toEqual(animations[0].transition);
  });

  it('applies correct default x offset based on message type when no x is provided', () => {
    // Test user message (left side)
    render(<ChatMessage {...defaultProps} />);
    const userMotionDiv = screen.getByTestId('motion-div');
    const userInitial = JSON.parse(userMotionDiv.getAttribute('data-initial') || '{}');
    expect(userInitial.x).toBe(-20);
    cleanup();

    // Test agent message (right side)
    render(<ChatMessage {...defaultProps} type="agent" />);
    const agentMotionDiv = screen.getByTestId('motion-div');
    const agentInitial = JSON.parse(agentMotionDiv.getAttribute('data-initial') || '{}');
    expect(agentInitial.x).toBe(20);
    cleanup();
  });

  it('renders steps with custom step animation', () => {
    const steps = ['Step 1', 'Step 2'];
    const customStepAnimation = {
      initial: { opacity: 0, y: 10 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.2 },
      stepDelay: 0.3,
    };

    render(
      <ChatMessage
        {...defaultProps}
        steps={steps}
        stepsAnimation={customStepAnimation}
      />
    );

    steps.forEach(step => {
      const stepElement = screen.getByText(step);
      expect(stepElement).toBeInTheDocument();
      const stepMotionDiv = stepElement.closest('[data-testid="motion-div"]') as HTMLElement;
      expect(stepMotionDiv).toBeTruthy();
      expect(JSON.parse(stepMotionDiv.getAttribute('data-initial') || '{}')).toEqual(customStepAnimation.initial);
      expect(JSON.parse(stepMotionDiv.getAttribute('data-animate') || '{}')).toEqual(customStepAnimation.animate);
    });
  });
});
