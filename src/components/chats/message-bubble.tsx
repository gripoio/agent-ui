import React from "react";
import { Markdown } from "../../utils/markdownToReact.js";
import { components } from "../../constant/index.js";
import { ToolDisplay } from "./tool-display.js";
import { LifecycleIndicator, StageStatus } from "./life-cycle-indicator.js";
import { ToolCall } from "../../types/chats.js";

type MessageBubbleProps = {
  text: string;
  sender: "user" | "bot";
  timestamp?: string;
  className?: string;

  stages?: Record<string, StageStatus>;
  currentStage?: string;
  isProcessing?: boolean;
  showLifecycle?: boolean;
  toolCalls?: ToolCall[] | undefined;
};

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  text,
  sender,
  timestamp,
  className = "",
  stages,
  currentStage,
  isProcessing = false,
  showLifecycle = false,
  toolCalls,
}) => {
  const isUser = sender === "user";

  return (
    <div
      className={`tw-flex ${
        isUser ? "tw-justify-end" : "tw-justify-start"
      } tw-mb-8`}
    >
      <div
        className={`
           tw-rounded-lg tw-leading-7 tw-max-w-full
          ${isUser ? "tw-max-w-1/2" : "tw-w-full"} 
          ${isUser
            ? " tw-px-4 tw-py-3 tw-bg-opacity-25 tw-bg-blue-400 tw-text-gray-800 tw-rounded-br-none"
            : "tw-p-8 tw-bg-gray-50 tw-text-black tw-rounded-bl-none tw-border tw-border-gray-200"
          }
          ${className}
        `}
      >
        {/* Show lifecycle indicator for bot messages when processing */}
        {!isUser && showLifecycle && stages && isProcessing && (
          <LifecycleIndicator stages={stages} isProcessing={isProcessing} />
        )}

        {isUser ? (
          <p>{text}</p>
        ) : (
          <>
            {toolCalls && toolCalls.length > 0 && (
              <section className="tw-mb-2">
                <ToolDisplay toolCalls={toolCalls} />
              </section>
            )}
            <Markdown components={components} className="markdown">
              {text}
            </Markdown>
          </>
        )}

        {/* Optional timestamp */}
        {/* {timestamp && (
          <span className="tw-block tw-mt-1 tw-text-xs tw-text-gray-400 tw-text-right">
            {timestamp}
          </span>
        )} */}
      </div>
    </div>
  );
};
