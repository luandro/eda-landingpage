import React from "react";
import { MessageSquare } from "lucide-react";
import { motion, Target, TargetAndTransition, Transition } from "framer-motion";
import { cn } from "@/lib/utils";

export type MessageType = "user" | "agent";

export interface AnimationConfig {
  initial?: Target;
  animate?: TargetAndTransition;
  transition?: Transition;
}

export interface StepAnimationConfig extends AnimationConfig {
  stepDelay?: number; // Delay between each step
}

export interface ChatMessageProps {
  type: MessageType;
  content: string;
  timestamp: string;
  steps?: string[];
  className?: string;
  animation?: AnimationConfig | AnimationConfig[];
  stepsAnimation?: StepAnimationConfig;
}

const defaultAnimation: AnimationConfig = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.5 },
};

const defaultStepsAnimation: StepAnimationConfig = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.3 },
  stepDelay: 0.5,
};

const ChatMessage: React.FC<ChatMessageProps> = ({
  type,
  content,
  timestamp,
  steps,
  className,
  animation,
  stepsAnimation,
}) => {
  const isAgent = type === "agent";

  // Determine which animations to use
  const animations = Array.isArray(animation) ? animation : [animation || defaultAnimation];
  const currentAnimation = animations[0];

  // Merge default animation with provided animation
  const finalAnimation: AnimationConfig = {
    initial: {
      ...defaultAnimation.initial,
      ...currentAnimation?.initial,
      x: currentAnimation?.initial?.x ?? (isAgent ? 20 : -20), // Default x offset if not provided
    },
    animate: {
      ...defaultAnimation.animate,
      ...currentAnimation?.animate,
    },
    transition: {
      ...defaultAnimation.transition,
      ...currentAnimation?.transition,
      layout: true, // Enable smooth layout animations
    },
  };

  // Merge default steps animation with provided animation
  const finalStepsAnimation: StepAnimationConfig = {
    ...defaultStepsAnimation,
    ...stepsAnimation,
  };

  return (
    <motion.div
      className={cn(
        "flex items-start gap-6",
        isAgent ? "flex-row-reverse" : "",
        className,
      )}
      initial={finalAnimation.initial}
      animate={finalAnimation.animate}
      transition={finalAnimation.transition}
      layout
    >
      <motion.div
        className={cn(
          "text-white p-3 rounded-2xl shadow-lg transform hover:scale-105 transition-transform",
          isAgent ? "bg-gradient-to-br from-eda-orange to-eda-orange/80" : "bg-gradient-to-br from-eda-green to-eda-green/80",
        )}
        aria-hidden="true"
        layout
      >
        <MessageSquare size={22} className="drop-shadow-sm" />
      </motion.div>
      <motion.div className="flex-1 space-y-3" layout>
        {steps && (
          <motion.div
            className="space-y-2.5 mb-3"
            initial={finalStepsAnimation.initial}
            animate={finalStepsAnimation.animate}
            transition={finalStepsAnimation.transition}
            layout
          >
            {steps.map((step, index) => (
              <motion.div
                key={index}
                className="text-sm text-gray-600 italic font-light tracking-wide"
                initial={finalStepsAnimation.initial}
                animate={finalStepsAnimation.animate}
                transition={{
                  ...finalStepsAnimation.transition,
                  delay: index * (finalStepsAnimation.stepDelay || 0.5),
                }}
                layout
              >
                {step}
                <span className="animate-blink ml-1 opacity-70">...</span>
              </motion.div>
            ))}
          </motion.div>
        )}
        <motion.div
          className={cn(
            "rounded-2xl p-6 shadow-md backdrop-blur-sm border border-gray-100/20",
            isAgent
              ? "bg-gradient-to-br from-eda-orange/10 to-eda-orange/5"
              : "bg-gradient-to-br from-white to-gray-50",
          )}
          role="article"
          aria-label={`${type} message`}
          layout
        >
          <p className="text-base leading-relaxed whitespace-pre-line">
            {content}
          </p>
          <span className="text-xs text-gray-500/80 mt-3 block font-light tracking-wider">
            {timestamp}
          </span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default ChatMessage;
