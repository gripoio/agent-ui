import React from "react";

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

  return (
    <div className={`tw-flex ${isUser ? "tw-justify-end" : "tw-justify-start"} tw-mb-2`}>
      <div
        className={`tw-max-w-xs md:tw-max-w-md tw-px-4 tw-py-2 tw-rounded-lg tw-shadow tw-text-sm ${
          isUser
            ? "tw-bg-blue-500 tw-text-white tw-rounded-br-none"
            : "tw-bg-gray-200 tw-text-black tw-rounded-bl-none"
        } ${className}`}
      >
        <p>{text}</p>
        {timestamp && (
          <span className="tw-block tw-mt-1 tw-text-xs tw-text-gray-400 tw-text-right">
            {timestamp}
          </span>
        )}
      </div>
    </div>
  );
};