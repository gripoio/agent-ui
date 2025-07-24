import React from "react";
import {Markdown} from "../../utils/markdownToReact.js"
import { components } from "../../constant/index.js";
import { ToolDisplay } from "./tool-display.js";
type MessageBubbleProps = {
  text: string;
  sender: "user" | "bot";
  timestamp?: string;
  className?: string;
};

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  text,
  sender,
  timestamp,
  className = "",
}) => {
  const isUser = sender === "user";
console.log("sender", sender )
  return (
    <div className={`tw-flex ${isUser ? "tw-justify-end" : "tw-justify-start"} tw-mb-2`}>
      <div
        className={`tw-w-auto md:tw-max-w-6xl tw-px-4 tw-py-2 tw-rounded-lg  tw-leading-8 ${
          isUser
            ? "tw-bg-blue-500 tw-text-white tw-rounded-br-none"
            : "tw-bg-gray-50 tw-text-black tw-rounded-bl-none"
        } ${className}`}
      >
        {isUser? (
          <p>{text}</p>
        ):(
       <>
     <section className=" tool-display-section tw-w-fit tw-max-w-2xl  tw-p-4 tw-bg-gray-200 dark:tw-bg-gray-900 tw-transition-colors">
        <ToolDisplay/>
     </section>
          <Markdown 
          components={components}
          className="markdown"
          >
            {text}
          </Markdown>
       </>
        )}
        {timestamp && (
          <span className="tw-block tw-mt-1 tw-text-xs tw-text-gray-400 tw-text-right">
            {timestamp}
          </span>
        )}
      </div>
    </div>
  );
};