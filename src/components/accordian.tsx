import { useState } from "react";
import { getTextStyle } from "../utils/textStyles";
import { StatusIndicator } from "./chats/tool-display";
import { IoChevronDown } from "react-icons/io5";

export function Accordion({ 
  toolName, 
  status, 
  children 
}: { 
  toolName: string; 
  status?: 'success' | 'error' | 'pending';
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="tw-border tw-border-gray-200 dark:tw-border-gray-700 tw-rounded-lg tw-overflow-hidden tw-bg-white dark:tw-bg-gray-800 tw-shadow-sm">
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="tw-flex tw-w-full tw-items-center tw-justify-between tw-p-4 tw-text-left tw-bg-gray-50 dark:tw-bg-gray-800 hover:tw-bg-gray-100 dark:hover:tw-bg-gray-700 tw-transition-colors tw-duration-200 tw-border-none focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500 dark:focus:tw-ring-blue-400 focus:tw-ring-inset"
        aria-expanded={isOpen}
      >
        <div className="tw-flex tw-items-center tw-gap-3 tw-flex-1 tw-min-w-0">
          <h3 className={`${getTextStyle("heading3")} tw-truncate`}>
            {toolName}
          </h3>
        </div>
        
        <div className="tw-flex tw-items-center tw-gap-3">
         {status && (
            <StatusIndicator status={status} />
            )}
          <IoChevronDown 
            className={`tw-w-5 tw-h-5 tw-text-gray-500 dark:tw-text-gray-400 tw-transition-transform tw-duration-300 ${
              isOpen ? 'tw-rotate-180' : ''
            }`}
          />
        </div>
      </button>

      {/* Content */}
      <div
        className={`tw-overflow-hidden tw-transition-all tw-duration-300 tw-ease-in-out ${
          isOpen ? 'tw-max-h-96 tw-opacity-100' : 'tw-max-h-0 tw-opacity-0'
        }`}
      >
        <div className="tw-p-4 tw-border-t tw-border-gray-100 dark:tw-border-gray-700 tw-bg-white dark:tw-bg-gray-800">
          <div className={`${getTextStyle("small")} tw-leading-relaxed`}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}