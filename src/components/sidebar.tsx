"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { CiCirclePlus, CiChat1, CiMenuKebab, CiTrash } from "react-icons/ci";
import { RiSettings3Line } from "react-icons/ri";
import { ChatUIButton } from "./button";

export interface Chat {
  label: string;
  id: string;
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
  onOptions: (id: string, chat: Chat, buttonEl: HTMLButtonElement) => void;
};

function EmptyState() {
  return (
    <div className="tw-flex tw-flex-col tw-items-center tw-justify-center tw-flex-1 tw-text-center tw-px-4 tw-py-8">
      <div className="tw-w-16 tw-h-16 tw-bg-gray-200 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-mb-4">
        <CiChat1 className="tw-w-8 tw-h-8 tw-text-gray-400" />
      </div>
      <h3 className="tw-text-lg tw-font-semibold tw-text-gray-800">
        No conversations yet
      </h3>
      <p className="tw-text-sm tw-text-gray-500 tw-mt-2">
        Start a new conversation to begin chatting
      </p>
    </div>
  );
}

function ChatItem({ selectedChatId, chat, isActive, onSelect, onOptions }: ChatItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <li
      className={`tw-group tw-relative tw-transition-all tw-duration-200 tw-mx-2 tw-rounded-lg ${
        isActive ? "tw-bg-blue-50  tw-border-blue-500" : ""
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
          <span
            className={`tw-truncate tw-font-medium tw-text-lg tw-flex-1 tw-transition-colors tw-duration-200 ${
              isActive ? "tw-text-blue-900 tw-font-semibold" : "tw-text-gray-700"
            }`}
          >
            {chat.label}
          </span>
        </div>

        {(isHovered || isActive) && (
          <button
            ref={buttonRef}
            onClick={(e) => {
              e.stopPropagation();
              if (buttonRef.current) {
                // ✅ Use selectedChatId instead of chat.?.id
                onOptions(selectedChatId, chat, buttonRef.current);
              }
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
  onDeleteChat: (id: string, chat: Chat) => void;
  children: React.ReactNode;
}) {
const [menuChat, setMenuChat] = useState<Chat | null>(null);
  const [menuPos, setMenuPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const [isOpen, setIsOpen] = useState(false);

  const sidebarRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // handle options (open delete menu)
const handleOptions = (id: string, chat: Chat, buttonEl: HTMLButtonElement) => {
  const rect = buttonEl.getBoundingClientRect();
  setMenuPos({
    top: rect.bottom + window.scrollY + 4,
    left: rect.left + window.scrollX,
  });
setMenuChat((prev) => (prev?.id === chat?.id ? null : chat))
  setMenuChat(chat);
};

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuChat) {
        const target = event.target as Node;
        if (
          !sidebarRef.current?.contains(target) &&
          !menuRef.current?.contains(target)
        ) {
          setMenuChat(null);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuChat]);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="tw-fixed tw-inset-0 tw-bg-black tw-bg-opacity-50 tw-z-30 md:tw-hidden" />
      )}

      <aside
        ref={sidebarRef}
        className={`tw-fixed md:tw-static tw-inset-y-0 tw-left-0 tw-z-40 tw-flex tw-flex-col tw-bg-white tw-border-r tw-border-gray-200 tw-h-full tw-transition-all tw-duration-300
          ${isOpen ? "tw-w-72 sm:tw-w-80 md:tw-w-80 lg:tw-w-96" : "tw-w-0 md:tw-w-72 lg:tw-w-80"}`}
      >
        {/* Header */}
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

        {/* List */}
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
              <ul className="tw-space-y-4 tw-pt-4">
                {chats.chats.map((chat, index) => (
                  <ChatItem
                    key={`${chat?.id}-${index}`}
                    selectedChatId={chats.id}
                    chat={chat}
                    isActive={chat?.id === activeId}
                    onSelect={onSelectChat}
                    onOptions={handleOptions}
                  />
                ))}
              </ul>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="tw-p-4 tw-border-t tw-border-gray-100 tw-bg-white">
          <ChatUIButton onClick={onButtonClick} className="tw-w-full" variant="outline">
            <RiSettings3Line size={18} />
            Settings
          </ChatUIButton>
        </div>
      </aside>

      {/* Hamburger toggle button (mobile only) */}
      <button
        className="tw-fixed tw-top-4 tw-left-4 tw-z-50 md:tw-hidden tw-bg-white tw-border tw-rounded-md tw-shadow p-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="tw-sr-only">Toggle sidebar</span>
        ☰
      </button>

      {/* Floating Delete Menu rendered in Portal */}
      {menuChat&&
        createPortal(
          <div
            ref={menuRef}
            className="tw-fixed tw-bg-white tw-shadow-xl tw-rounded-lg tw-border tw-border-gray-200 tw-py-4 tw-px-4 tw-min-w-[140px]"
            style={{
              top: menuPos.top,
              left: menuPos.left,
              zIndex: 99999,
            }}
          >
    <ChatUIButton
  onClick={() => {
    if (menuChat && menuChat) {
      onDeleteChat(menuChat as unknown as string, menuChat);
    }
    setMenuChat(null);
    setMenuChat(null);
  }}
  variant="destructive"
  size="sm"
>
  <CiTrash className="tw-w-4 tw-h-4" />
  <span>Delete Chat</span>
</ChatUIButton>

          </div>,
          document.body
        )}
    </>
  );
}
