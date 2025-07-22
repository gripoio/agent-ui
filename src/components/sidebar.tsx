import { CiCirclePlus, CiChat1, CiMenuKebab } from "react-icons/ci";
import { useState } from "react";
import {ChatUIButton} from "./button";

type Chat = {
  id: string;
  title: string;
};

type ChatItemProps = {
  chat: Chat;
  isActive: boolean;
  onSelect: (id: string) => void;
  onOptions: (id: string) => void;
};

function EmptyState() {
  return (
    <div className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-flex-1 tw-text-center tw-px-4 tw-py-8">
      <div className="tw-w-16 tw-h-16 tw-bg-gray-200 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-mb-4">
        <CiChat1 className="tw-w-8 tw-h-8 tw-text-gray-400" />
      </div>
      <h3 className="tw-text-lg tw-font-semibold tw-text-gray-800">No conversations yet</h3>
      <p className="tw-text-sm tw-text-gray-500 tw-mt-2">Start a new conversation to begin chatting</p>
    </div>
  );
}

function ChatItem({ chat, isActive, onSelect, onOptions }: ChatItemProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <li
      className={`tw-group tw-relative tw-transition-all tw-duration-200 ${isActive ? "tw-bg-blue-50" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`tw-flex tw-items-center tw-p-3 tw-rounded-lg tw-cursor-pointer tw-transition-all ${
          isActive
            ? "tw-bg-blue-50 tw-border-l-4 tw-border-blue-500 tw-text-blue-900"
            : "hover:tw-bg-gray-50 tw-text-gray-700 hover:tw-text-gray-900"
        }`}
        onClick={() => onSelect(chat.id)}
      >
        <div className="tw-flex tw-items-center tw-gap-3 tw-flex-1">
          <div
            className={`tw-w-2 tw-h-2 tw-rounded-full ${
              isActive ? "tw-bg-blue-500" : "tw-bg-gray-300"
            }`}
          />
          <span className="tw-truncate tw-font-medium tw-text-sm">{chat.title}</span>
        </div>

        {(isHovered || isActive) && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOptions(chat.id);
            }}
            className="tw-p-1 tw-rounded tw-text-gray-400 hover:tw-text-gray-600 hover:tw-bg-gray-100"
          >
            <CiMenuKebab className="tw-w-4 tw-h-4" />
          </button>
        )}
      </div>
    </li>
  );
}

export function ChatSidebar({
  chats = [],
  activeId,
  onSelectChat,
  onNewChat,
}: {
  chats: Chat[];
  activeId: string;
  onSelectChat: (id: string) => void;
  onNewChat?: () => void;
}) {
  return (
    <aside className=" tw-border-r tw-border-gray-200 tw-h-full tw-flex tw-flex-col">
      {/* Header */}
      <div className="tw-p-4 tw-border-b tw-border-gray-100">
        <h2 className="tw-text-lg tw-font-semibold tw-text-gray-900 tw-mb-3">Conversations</h2>
        <ChatUIButton onClick={onNewChat} className="tw-w-full tw-justify-center tw-border-none">
          <CiCirclePlus className="tw-w-5 tw-h-5" />
          <span className="tw-ml-2">New Chat</span>
        </ChatUIButton>
      </div>

      {/* Chat List */}
      <div className="tw-flex-1 tw-overflow-y-auto">
        {chats.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div className="tw-px-4 tw-py-3 tw-border-b tw-border-gray-50">
              <span className="tw-text-xs tw-font-semibold tw-text-gray-500">Recent</span>
            </div>
            <ul className="tw-space-y-1 tw-px-2">
              {chats.map((chat) => (
                <ChatItem
                  key={chat.id}
                  chat={chat}
                  isActive={chat.id === activeId}
                  onSelect={onSelectChat}
                  onOptions={() => {}}
                />
              ))}
            </ul>
          </>
        )}
      </div>
    </aside>
  );
}