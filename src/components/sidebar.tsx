import { useState } from "react";
import { CiCirclePlus, CiChat1, CiMenuKebab } from "react-icons/ci";
import { RiSettings3Line } from "react-icons/ri";
import {ChatUIButton} from "./button";

export interface Chat {
  label: string;
  value: string;
}

type ChatObj = {
  id: string;
  chats: Chat[];
};

type ChatItemProps = {
  selectedChatId: string;
  chat: Chat;
  isActive: boolean;
  onSelect: (id: string, chat: Chat) => void;
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

function ChatItem({ selectedChatId, chat, isActive, onSelect, onOptions }: ChatItemProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <li
      className={`tw-group tw-relative tw-transition-all tw-duration-200 tw-mx-2 tw-rounded-lg ${
        isActive ? "tw-bg-blue-50 tw-border-l-4 tw-border-blue-500" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`tw-flex tw-items-center tw-p-3 tw-rounded-lg tw-cursor-pointer tw-transition-all tw-duration-200 ${
          isActive
            ? "tw-bg-blue-100 tw-text-blue-900 tw-shadow-sm"
            : "hover:tw-bg-gray-100 tw-text-gray-700 hover:tw-text-gray-900"
        }`}
        onClick={() => onSelect(selectedChatId, chat)}
      >
        <div className="tw-flex tw-items-center tw-gap-3 tw-flex-1 tw-min-w-0">
          <div
            className={`tw-w-2 tw-h-2 tw-rounded-full tw-flex-shrink-0 tw-transition-colors tw-duration-200 ${
              isActive ? "tw-bg-blue-500" : "tw-bg-gray-300"
            }`}
          />
          <span className={`tw-truncate tw-font-medium tw-text-sm tw-flex-1 tw-transition-colors tw-duration-200 ${
            isActive ? "tw-text-blue-900 tw-font-semibold" : "tw-text-gray-700"
          }`}>
            {chat.label}
          </span>
        </div>

        {(isHovered || isActive) && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOptions(chat.value);
            }}
            className={`tw-p-1 tw-rounded tw-flex-shrink-0 tw-transition-colors tw-duration-200 ${
              isActive 
                ? "tw-text-blue-600 hover:tw-text-blue-800 hover:tw-bg-blue-200" 
                : "tw-text-gray-400 hover:tw-text-gray-600 hover:tw-bg-gray-200"
            }`}
          >
            <CiMenuKebab className="tw-w-4 tw-h-4" />
          </button>
        )}
      </div>
    </li>
  );
}

export function ChatSidebar({
  chats,
  activeId,
  onSelectChat,
  onNewChat,
  onButtonClick,
  onDeleteChat, 
  children,
}: {
  chats: ChatObj | null;
  activeId: string;
  onSelectChat: (id: string, chat: Chat) => void;
  onNewChat?: () => void;
  onButtonClick: () => void;
  onDeleteChat: (id: string) => void; 
  children: React.ReactNode;
}) {
  const [menuChatId, setMenuChatId] = useState<string | null>(null);

  const handleOptions = (id: string) => {
    setMenuChatId((prev) => (prev === id ? null : id));
  };

  return (
    <aside className="tw-border-r tw-border-gray-200 tw-h-full tw-flex tw-flex-col tw-relative tw-w-80 tw-bg-white">
      {/* header */}
      <div className="tw-p-4 tw-border-b tw-border-gray-100 tw-relative tw-z-10 tw-bg-white">
        <div className="tw-relative tw-z-20 tw-mb-3">{children}</div>
        <h2 className="tw-text-lg tw-font-semibold tw-text-gray-900 tw-mb-3">
          Conversations
        </h2>
        <ChatUIButton
          className="tw-w-full tw-bg-blue-600 hover:tw-bg-blue-700 tw-text-white"
          onClick={onNewChat}
        >
          <CiCirclePlus className="tw-w-4 tw-h-4" />
          New Chat
        </ChatUIButton>
      </div>

      {/* list */}
      <div className="tw-flex-1 tw-overflow-y-auto tw-relative tw-z-0 tw-bg-gray-50">
        {!chats || chats.chats.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div className="tw-px-4 tw-py-3 tw-border-b tw-border-gray-100 tw-bg-white">
              <span className="tw-text-xs tw-font-semibold tw-text-gray-500 tw-uppercase tw-tracking-wide">
                Recent Chats
              </span>
            </div>
            <ul className="tw-space-y-1 tw-py-2">
              {chats.chats.map((chat, index) => (
                <div key={`${chat.value}-${index}`} className="tw-relative">
                  <ChatItem
                    selectedChatId={chats.id}
                    chat={chat}
                    isActive={chat.value === activeId}
                    onSelect={onSelectChat}
                    onOptions={handleOptions}
                  />
                  {menuChatId === chat.value && (
                    <div className="tw-absolute tw-right-2 tw-top-10 tw-bg-white tw-shadow-md tw-rounded-md tw-p-2 tw-z-50">
                      <button
                        onClick={() => {
                          onDeleteChat(chat.value); // ✅ call parent
                          setMenuChatId(null);
                        }}
                        className="tw-block tw-w-full tw-text-left tw-text-sm tw-text-red-600 hover:tw-bg-red-50 tw-rounded-md tw-px-3 tw-py-1"
                      >
                        Delete Chat
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </ul>
          </>
        )}
      </div>

      {/* footer */}
      <div className="tw-p-4 tw-border-t tw-border-gray-100 tw-bg-white">
        <ChatUIButton onClick={onButtonClick} className="tw-w-full" variant="outline">
          <RiSettings3Line size={18} />
          Settings
        </ChatUIButton>
      </div>
    </aside>
  );  
}
