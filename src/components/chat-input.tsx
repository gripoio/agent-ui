import React, { useRef, useState, useCallback, useEffect } from "react";
import { getHighlightedText } from "../utils";

// Mock icons since we don't have react-icons
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
  children?: MentionItem[]; // Optional nested categories
  pinnable: boolean;
};

type PinnedItem = {
  label: string;
  value: string;
  pinnable: boolean;
};
interface ChatInputProps {
  onSend: (text: string) => void;
  placeholder?: string;
  showAttachmentButton?: boolean;
  showMicButton?: boolean;
  disabled?: boolean;
  mentions?: MentionItem[]; // List of mentionable names
  onMentionSelect?: (type: string, value: string, label: string) => void;
  pinnedItems?: PinnedItem[];
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


  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const cursorPos = e.target.selectionStart || 0;

    setText(value);
    setCursorPosition(cursorPos);

    // Check for mention trigger
    checkForMentions(value, cursorPos);
  };



  // Check for @ mentions
  const checkForMentions = (text: string, cursorPos: number) => {
    // Find the last @ before cursor position
    let mentionIndex = -1;
    for (let i = cursorPos - 1; i >= 0; i--) {
      if (text[i] === "@") {
        // Check if this @ is at start or after a space
        if (i === 0 || text[i - 1] === " ") {
          mentionIndex = i;
          break;
        }
      } else if (text[i] === " ") {
        break; // Stop if we hit a space before finding @
      }
    }

    if (mentionIndex !== -1) {
      const query = text.substring(mentionIndex + 1, cursorPos);

      // Only show suggestions if query doesn't contain spaces
      if (!query.includes(" ")) {
        const filtered = mentions.filter((name) =>
          name?.value?.toLowerCase().startsWith(query.toLowerCase())
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

  // Insert mention
const insertMention = useCallback(
  (mentionValue: string) => {
    if (mentionStart === null) return;
    console.log("suggestion", suggestions)
    console.log("mentionValue", mentionValue)
    const mentionItem = suggestions.find((s) => s.value === mentionValue);
    if (!mentionItem) return;
    console.log("mentionItem", mentionItem);
    // 🔒 Handle pinnable mentions
if (mentionItem.pinnable) {
  const beforeMention = text.substring(0, mentionStart);
  const afterCursor = text.substring(cursorPosition);

  // Find the mention query between @ and cursor
  const typedMention = text.substring(mentionStart + 1, cursorPosition);

  // Replace `@typedMention` with nothing
  const cleanedText = beforeMention + afterCursor;

  setText(cleanedText); // ⬅️ This ensures @mention disappears from the div too
  setShowSuggestions(false);
  setMentionStart(null);

  if (onMentionSelect) {
    onMentionSelect("cluster", mentionItem.value, mentionItem.label);
  }

  setTimeout(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(mentionStart, mentionStart);
    }
  }, 0);

  return;
}


    // ✏️ Insert mention normally
    const beforeMention = text.substring(0, mentionStart);
    const afterCursor = text.substring(cursorPosition);
    const newText = `${beforeMention}@${mentionItem.label} ${afterCursor}`;
    const newCursorPos = beforeMention.length + mentionItem.label.length + 2; // `@` + label + space

    setText(newText);
    setShowSuggestions(false);
    setMentionStart(null);

    // 🔔 Callback for non-pinnable mentions
    if (onMentionSelect) {
      onMentionSelect("cluster", mentionItem.value, mentionItem.label);
    }

    // ⌨️ Reset cursor
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);
  },
  [text, cursorPosition, mentionStart, suggestions, onMentionSelect]
);


  // Handle keyboard events
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (showSuggestions && suggestions.length > 0) {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setActiveSuggestionIndex((prev) =>
            prev < suggestions.length - 1 ? prev + 1 : 0
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setActiveSuggestionIndex((prev) =>
            prev > 0 ? prev - 1 : suggestions.length - 1
          );
          break;
        case "Enter":
        case "Tab":
          e.preventDefault();
          insertMention(suggestions[activeSuggestionIndex].value);
          break;
        case "Escape":
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
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 120) + "px";
    }
  }, [text]);

  console.log("pinnedItems", pinnedItems);
  return (
    <div className="tw-w-full tw-max-w-2xl tw-mx-auto tw-p-4">
      <div className="tw-relative">
        {/* Main input container */}
        <div className="tw-border tw-border-gray-300 tw-rounded-lg tw-bg-white tw-shadow-sm ">
          {/* Text input area */}
          <div className="tw-relative">
          <div
        className="tw-whitespace-pre-wrap tw-break-words tw-text-sm  tw-font-normal tw-p-3  tw-text-gray-900
        tw-absolute tw-inset-0 tw-pointer-events-none tw-overflow-hidden"
        dangerouslySetInnerHTML={{ __html: getHighlightedText(text) }}
      />
            <textarea
              ref={textareaRef}
              value={text}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={disabled}
            className=" ghost-textarea  tw-w-full tw-p-3    tw-resize-none tw-outline-none 
               tw-text-sm  tw-max-h-32 tw-min-h-10
               tw-text-transparent tw-bg-transparent tw-caret-black
               placeholder:tw-text-gray-500 disabled:tw-bg-gray-100 
               disabled:tw-text-gray-500 tw-selection:bg-blue-200"
              rows={1}
            />

            {/* Send button inside textarea */}
            <button
              onClick={handleSend}
              disabled={disabled || !text.trim()}
              className="tw-absolute tw-right-2 tw-bottom-2 tw-h-10 tw-w-10 tw-rounded-full tw-bg-blue-500 tw-text-white hover:tw-bg-blue-600 disabled:tw-bg-gray-300 disabled:tw-cursor-not-allowed tw-transition-colors tw-border-none tw-flex tw-items-center tw-justify-center"
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
            <div className="tw-text-xs tw-text-gray-500 tw-flex tw-justify-between tw-w-full">
              {pinnedItems &&
                Object.entries(pinnedItems).map(([key, item]) => {
                  if (!item.pinnable) return null; // 👈 Skip non-pinnable tags

                  return (
                    <span
                      key={key}
                      className="tw-group tw-bg-blue-100 tw-text-blue-800 tw-text-xs tw-font-medium tw-me-2 tw-px-2.5 tw-py-0.5 tw-rounded-sm tw-relative tw-inline-flex tw-items-center tw-gap-1 tw-transition-all tw-duration-200 hover:tw-bg-blue-200"
                    >
                      @{item.label}
                      <button
                        onClick={() => onRemovePin?.(key)}
                        className="tw-opacity-0 tw-h-4 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-text-blue-600 tw-text-xs tw-font-bold tw-transition-all tw-duration-200 tw-bg-blue-200/50 hover:tw-bg-red-100 hover:tw-text-red-600 group-hover:tw-opacity-100 tw-cursor-pointer tw-border-none"
                        aria-label={`Remove ${item.label} tag`}
                        title="Remove tag"
                      >
                        ×
                      </button>
                    </span>
                  );
                })}
            </div>
          </div>
        </div>

        {/* Suggestions dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="tw-absolute tw-bottom-full tw-left-0 tw-mb-1 tw-w-64 tw-max-h-48 tw-overflow-auto tw-bg-white tw-border tw-border-gray-300 tw-rounded-lg tw-shadow-lg tw-z-50">
            {suggestions.map((item, index) => (
              <div
                key={item.value}
                onMouseDown={(e) => {
                  e.preventDefault(); // ✅ Prevent input blur
                  insertMention(item.value); // ✅ Insert mention
                }}
                className={`tw-px-3 tw-py-2 tw-cursor-pointer tw-flex tw-items-center ${
                  index === activeSuggestionIndex
                    ? "tw-bg-blue-100 tw-text-blue-800"
                    : "tw-text-gray-700 hover:tw-bg-gray-100"
                }`}
              >
                <span className="tw-w-8 tw-h-8 tw-bg-gray-300 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-text-xs tw-font-semibold tw-mr-3">
                  {item.label.charAt(0).toUpperCase()}
                </span>
                <span className="tw-font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Help text */}
      <div className="tw-text-xs tw-text-gray-500 tw-mt-2 tw-text-center">
        Type @ to mention someone • Enter to send • Shift+Enter for new line
      </div>
    </div>
  );
}
