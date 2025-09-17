import React, { useRef, useState, useCallback, useEffect } from "react";
import { getHighlightedText } from "../../utils";

// Mock icons
const IoIosSend = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
  </svg>
);

const FaPaperclip = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M21.586 10.461l-10.05 10.075c-1.846 1.846-4.842 1.846-6.688 0-1.846-1.846-1.846-4.842 0-6.688l10.05-10.075c1.23-1.23 3.224-1.23 4.454 0 1.23 1.23 1.23 3.224 0 4.454l-9.093 9.093c-.615.615-1.611.615-2.226 0-.615-.615-.615-1.611 0-2.226l8.133-8.133" />
  </svg>
);

const FaMicrophone = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
    <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
  </svg>
);

type MentionItem = {
  label: string;
  value: string;
  children?: MentionItem[];
  pinnable: boolean;
};

type Pinned = {
  label: string;
  value: string;
  pinnable: boolean;
};

type PinnedItem = Record<string, Pinned>;

interface ChatInputProps {
  onSend: (text: string) => void;
  placeholder?: string;
  showAttachmentButton?: boolean;
  showMicButton?: boolean;
  disabled?: boolean;
  mentions?: MentionItem[];
  onMentionSelect?: (type: string, value: string, label: string) => void;
  pinnedItems?: PinnedItem;
  onRemovePin?: (type: string) => void;
}

export function ChatInput({
  onSend,
  mentions = [],
  onMentionSelect,
  pinnedItems,
  onRemovePin,
  placeholder = "Type a message...",
  showAttachmentButton = true,
  showMicButton = true,
  disabled = false,
}: ChatInputProps) {
  const [text, setText] = useState("");
  const [suggestions, setSuggestions] = useState<MentionItem[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
  const [mentionStart, setMentionStart] = useState<number | null>(null);
  const [cursorPosition, setCursorPosition] = useState(0);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const suggestionRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Auto-resize textarea
  const adjustTextareaHeight = useCallback(() => {
    const textarea = textareaRef.current;
    const overlay = overlayRef.current;

    if (textarea && overlay) {
      textarea.style.height = "auto";
      const scrollHeight = Math.min(textarea.scrollHeight, 128); // max-height equivalent
      textarea.style.height = `${scrollHeight}px`;
      overlay.style.height = `${scrollHeight}px`;
    }
  }, []);

  // Sync scroll between textarea and overlay
  const syncScroll = useCallback(() => {
    const textarea = textareaRef.current;
    const overlay = overlayRef.current;

    if (textarea && overlay) {
      overlay.scrollTop = textarea.scrollTop;
      overlay.scrollLeft = textarea.scrollLeft;
    }
  }, []);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const cursorPos = e.target.selectionStart || 0;

    setText(value);
    setCursorPosition(cursorPos);

    // Adjust height and sync scroll
    setTimeout(() => {
      adjustTextareaHeight();
      syncScroll();
    }, 0);

    checkForMentions(value, cursorPos);
  };

  // Handle scroll sync
  const handleScroll = () => {
    syncScroll();
  };

  // Check for @ mentions
  const checkForMentions = (text: string, cursorPos: number) => {
    let mentionIndex = -1;

    for (let i = cursorPos - 1; i >= 0; i--) {
      if (text[i] === "@") {
        if (i === 0 || text[i - 1] === " " || text[i - 1] === "\n") {
          mentionIndex = i;
          break;
        }
      } else if (text[i] === " " || text[i] === "\n") {
        break;
      }
    }

    if (mentionIndex !== -1) {
      const query = text.substring(mentionIndex + 1, cursorPos);

      if (!query.includes(" ") && !query.includes("\n")) {
        const filtered = mentions.filter((item) =>
          item?.label?.toLowerCase().includes(query.toLowerCase())
        );

        if (filtered.length > 0) {
          setMentionStart(mentionIndex);
          setSuggestions(filtered);
          setShowSuggestions(true);
          setActiveSuggestionIndex(0);
          return;
        }
      }
    }

    setShowSuggestions(false);
    setMentionStart(null);
  };

  // Scroll suggestion into view
  const scrollSuggestionIntoView = (index: number) => {
    const suggestionElement = suggestionRefs.current[index];
    if (suggestionElement) {
      suggestionElement.scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    }
  };

  // Insert mention
  const insertMention = useCallback(
    (mentionValue: string) => {
      if (mentionStart === null) return;

      const mentionItem = suggestions.find((s) => s.value === mentionValue);
      if (!mentionItem) return;

      // Handle pinnable mentions
      if (mentionItem.pinnable) {
        const beforeMention = text.substring(0, mentionStart);
        const afterCursor = text.substring(cursorPosition);
        const cleanedText = beforeMention + afterCursor;

        setText(cleanedText);
        setShowSuggestions(false);
        setMentionStart(null);

        if (onMentionSelect) {
          onMentionSelect("cluster", mentionItem.value, mentionItem.label);
        }

        setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.focus();
            textareaRef.current.setSelectionRange(mentionStart, mentionStart);
            adjustTextareaHeight();
          }
        }, 0);

        return;
      }

      // Insert mention normally
      const beforeMention = text.substring(0, mentionStart);
      const afterCursor = text.substring(cursorPosition);
      const newText = `${beforeMention}@${mentionItem.label} ${afterCursor}`;
      const newCursorPos = beforeMention.length + mentionItem.label.length + 2;

      setText(newText);
      setShowSuggestions(false);
      setMentionStart(null);

      if (onMentionSelect) {
        onMentionSelect("cluster", mentionItem.value, mentionItem.label);
      }

      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
          adjustTextareaHeight();
        }
      }, 0);
    },
    [
      text,
      cursorPosition,
      mentionStart,
      suggestions,
      onMentionSelect,
      adjustTextareaHeight,
    ]
  );

  // Handle keyboard events
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (showSuggestions && suggestions.length > 0) {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          const nextIndex =
            activeSuggestionIndex < suggestions.length - 1
              ? activeSuggestionIndex + 1
              : 0;
          setActiveSuggestionIndex(nextIndex);
          scrollSuggestionIntoView(nextIndex);
          break;

        case "ArrowUp":
          e.preventDefault();
          const prevIndex =
            activeSuggestionIndex > 0
              ? activeSuggestionIndex - 1
              : suggestions.length - 1;
          setActiveSuggestionIndex(prevIndex);
          scrollSuggestionIntoView(prevIndex);
          break;

        case "Enter":
        case "Tab":
          e.preventDefault();
          insertMention(suggestions[activeSuggestionIndex].value);
          break;

        case "Escape":
          e.preventDefault();
          setShowSuggestions(false);
          break;
      }
      return;
    }

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Handle send
  const handleSend = () => {
    const trimmedText = text.trim();
    if (trimmedText && !disabled) {
      onSend(trimmedText);
      setText("");
      setShowSuggestions(false);
      setMentionStart(null);
      setTimeout(adjustTextareaHeight, 0);
    }
  };

  // Initialize refs for suggestions
  useEffect(() => {
    suggestionRefs.current = suggestionRefs.current.slice(
      0,
      suggestions.length
    );
  }, [suggestions.length]);

  // Adjust height on mount
  useEffect(() => {
    adjustTextareaHeight();
  }, [adjustTextareaHeight]);

  return (
    <div className="tw-w-full tw-max-w-2xl tw-mx-auto tw-p-4">
      <div className="tw-relative">
        {/* Pinned Items */}
        {pinnedItems && Object.keys(pinnedItems).length > 0 && (
          <div className="tw-text-xs tw-text-gray-500 tw-flex tw-flex-wrap tw-gap-2 tw-mb-2">
            {Object.entries(pinnedItems).map(([key, item]) => {
              if (!item.pinnable) return null;

              return (
                <span
                  key={key}
                  className="tw-group tw-relative tw-bg-blue-100 tw-text-blue-800 tw-text-xs tw-font-medium tw-px-2 tw-py-1 tw-rounded-md tw-inline-flex tw-items-center tw-transition-all tw-duration-200 hover:tw-bg-blue-200"
                >
                  <span className="tw-mr-1">@{item.label}</span>
                  <button
                    onClick={() => onRemovePin?.(key)}
                    className="tw-opacity-0 group-hover:tw-opacity-100 tw-bg-red-100 hover:tw-bg-red-200 tw-text-red-600 tw-text-xs tw-rounded-full tw-w-4 tw-h-4 tw-flex tw-items-center tw-justify-center tw-transition-all tw-duration-200"
                    aria-label={`Remove ${item.label} tag`}
                    title="Remove tag"
                  >
                    ×
                  </button>
                </span>
              );
            })}
          </div>
        )}

        {/* Main input container */}
        <div className="tw-border tw-border-gray-300 tw-rounded-lg tw-bg-white tw-shadow-sm focus-within:tw-border-blue-500 focus-within:tw-ring-1 focus-within:tw-ring-blue-500">
          {/* Text input area */}
          <div className="tw-relative">
            {/* Overlay for styled text */}
            <div
              ref={overlayRef}
              className="  tw-absolute tw-inset-0 tw-p-3 tw-text-sm tw-font-normal tw-text-gray-900 tw-whitespace-pre-wrap tw-break-words tw-pointer-events-none tw-overflow-auto tw-resize-none"
              style={{
                minHeight: "44px",
                maxHeight: "128px",
                lineHeight: "1.5",
                wordWrap: "break-word",
                overflowWrap: "break-word",
              }}
              dangerouslySetInnerHTML={{ __html: getHighlightedText(text) }}
            />

            {/* Hidden textarea */}
            <textarea
              ref={textareaRef}
              value={text}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onScroll={handleScroll}
              placeholder={placeholder}
              disabled={disabled}
              className=" ghost-textarea tw-w-full tw-p-3 tw-resize-none tw-outline-none tw-text-sm tw-bg-transparent invisible-textarea"
              style={{
                color: "transparent",
                caretColor: "black",
                minHeight: "44px",
                maxHeight: "128px",
                lineHeight: "1.5",
                fontFamily: "inherit",
              }}
              rows={1}
            />

            {/* Send button */}
            <button
              onClick={handleSend}
              disabled={disabled || !text.trim()}
              className="tw-absolute tw-right-2 tw-bottom-2 tw-h-8 tw-w-8 tw-rounded-full tw-bg-blue-500 tw-text-white hover:tw-bg-blue-600 disabled:tw-bg-gray-300 disabled:tw-cursor-not-allowed tw-transition-colors tw-border-none tw-flex tw-items-center tw-justify-center"
            >
              <IoIosSend />
            </button>
          </div>

          {/* Bottom button row */}
          <div className="tw-flex tw-items-center tw-justify-start tw-gap-2 tw-px-3 tw-py-2 tw-border-t tw-border-gray-200 tw-bg-gray-50">
            {showAttachmentButton && (
              <button
                className="tw-p-2 tw-rounded-full tw-text-gray-600 hover:tw-bg-gray-200 tw-transition-colors"
                title="Attach file"
              >
                <FaPaperclip />
              </button>
            )}
            {showMicButton && (
              <button
                className="tw-p-2 tw-rounded-full tw-text-gray-600 hover:tw-bg-gray-200 tw-transition-colors"
                title="Voice message"
              >
                <FaMicrophone />
              </button>
            )}
          </div>
        </div>

        {/* Suggestions dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="tw-absolute tw-bottom-full tw-left-0 tw-mb-1 tw-w-64 tw-max-h-48 tw-overflow-auto tw-bg-white tw-border tw-border-gray-300 tw-rounded-lg tw-shadow-lg tw-z-50">
            {suggestions.map((item, index) => (
              <div
                key={`${item.value}-${index}`}
                ref={(el) => {
                  suggestionRefs.current[index] = el;
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  insertMention(item.value);
                }}
                onMouseEnter={() => setActiveSuggestionIndex(index)}
                className={`tw-px-3 tw-py-2 tw-cursor-pointer tw-flex tw-items-center tw-transition-colors ${
                  index === activeSuggestionIndex
                    ? "tw-bg-blue-100 tw-text-blue-800"
                    : "tw-text-gray-700 hover:tw-bg-gray-100"
                }`}
              >
                <span className="tw-w-8 tw-h-8 tw-bg-gray-300 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-text-xs tw-font-semibold tw-mr-3">
                  {item.label.charAt(0).toUpperCase()}
                </span>
                <span className="tw-font-medium">{item.label}</span>
                {item.pinnable && (
                  <span className="tw-ml-auto tw-text-xs tw-text-blue-600 tw-bg-blue-100 tw-px-1 tw-py-0.5 tw-rounded">
                    Pin
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Help text */}
      <div className="tw-text-xs tw-text-gray-500 tw-mt-2 tw-text-center">
        Type @ to mention • Enter to send • Shift+Enter for new line
      </div>
    </div>
  );
}
