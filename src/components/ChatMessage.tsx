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
        "flex items-start gap-4",
        isAgent ? "flex-row-reverse" : "",
        className,
      )}
      initial={finalAnimation.initial}
      animate={finalAnimation.animate}
      transition={finalAnimation.transition}
      layout // Enable layout animations for the container
    >
      <motion.div
        className={cn(
          "text-white p-2 rounded-full",
          isAgent ? "bg-eda-orange" : "bg-eda-green",
        )}
        aria-hidden="true"
        layout // Enable layout animations for the icon
      >
        <MessageSquare size={20} />
      </motion.div>
      <motion.div className="flex-1 space-y-2" layout> {/* Enable layout animations for the content container */}
        {steps && (
          <motion.div
            className="space-y-2 mb-2"
            initial={finalStepsAnimation.initial}
            animate={finalStepsAnimation.animate}
            transition={finalStepsAnimation.transition}
            layout // Enable layout animations for steps container
          >
            {steps.map((step, index) => (
              <motion.div
                key={index}
                className="text-sm text-gray-500 italic"
                initial={finalStepsAnimation.initial}
                animate={finalStepsAnimation.animate}
                transition={{
                  ...finalStepsAnimation.transition,
                  delay: index * (finalStepsAnimation.stepDelay || 0.5),
                }}
                layout // Enable layout animations for each step
              >
                {step}
                <span className="animate-blink">...</span>
              </motion.div>
            ))}
          </motion.div>
        )}
        <motion.div
          className={cn(
            "rounded-lg p-6 shadow-sm",
            isAgent ? "bg-eda-orange/10" : "bg-white",
          )}
          role="article"
          aria-label={`${type} message`}
          layout // Enable layout animations for the message bubble
        >
          <p className="text-base leading-relaxed whitespace-pre-line">
            {content}
          </p>
          <span className="text-xs text-gray-500 mt-2 block">{timestamp}</span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default ChatMessage;
