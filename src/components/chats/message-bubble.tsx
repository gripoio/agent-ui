import React from "react";
import { Markdown } from "../../utils/markdownToReact.js"
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
    <div className={`tw-flex ${isUser ? "tw-justify-end" : "tw-justify-start"} tw-mb-2`}>
      <div
        className={`tw-w-auto md:tw-max-w-6xl tw-px-4 tw-py-2 tw-rounded-lg  tw-leading-8 ${isUser
            ? "tw-bg-blue-500 tw-text-white tw-rounded-br-none"
            : "tw-bg-gray-50 tw-text-black tw-rounded-bl-none"
          } ${className}`}
      >
        {/* && isProcessing */}
        {/* Show lifecycle indicator for bot messages when processing or when stages exist */}
        {!isUser && showLifecycle && stages && isProcessing && (
          <LifecycleIndicator
            stages={stages}
            isProcessing={isProcessing}
          />
        )}
        {isUser ? (
          <p>{text}</p>
        ) : (
          <>
            <section className="">
              <ToolDisplay toolCalls={toolCalls} />
            </section>
            <Markdown
              components={components}
              className="markdown"
            >
              {text}
            </Markdown>
          </>
        )}
        {/* {timestamp && (
          <span className="tw-block tw-mt-1 tw-text-xs tw-text-gray-400 tw-text-right">
            {timestamp}
          </span>
        )} */}
      </div>
    </div>
  );
};