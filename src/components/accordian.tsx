import { useState } from "react";
import { getTextStyle } from "../utils/textStyles";
import { StatusIndicator } from "./chats/tool-display";
import { IoChevronDown } from "react-icons/io5";
import { ToolStatuses } from "../types/chats";

export function Accordion({
  toolName,
  status,
  children,
  isNested = false
}: {
  toolName: string;
  status?: ToolStatuses;
  children: React.ReactNode;
  isNested?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`
      tw-rounded-lg tw-overflow-hidden tw-transition-all tw-duration-200
      ${isNested
        ? 'tw-bg-gray-100 tw-border tw-border-gray-200'
        : 'tw-bg-white tw-border tw-border-gray-300 tw-shadow-sm hover:tw-shadow-md'
      }
    `}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          tw-flex tw-w-full tw-items-center tw-justify-between tw-px-3 tw-py-2.5
          tw-text-left tw-transition-colors tw-duration-200 tw-border-none
          focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500/50 focus:tw-ring-inset tw-bg-gray-200
          ${isNested
            ? 'hover:tw-bg-gray-300'
            : 'hover:tw-bg-gray-50'
          }
        `}
        aria-expanded={isOpen}
      >
        <div className="tw-flex tw-items-center tw-gap-2 tw-flex-1 tw-min-w-0">
          <h3 className={`${getTextStyle("paragraph")} tw-text-gray-800 tw-truncate`}>
            {toolName}
          </h3>
        </div>
        
        <div className="tw-flex tw-items-center tw-gap-2">
          {status && <StatusIndicator status={status} />}
          <IoChevronDown
            className={`tw-w-4 tw-h-4 tw-text-gray-500 tw-transition-transform tw-duration-200 ${
              isOpen ? 'tw-rotate-180' : ''
            }`}
          />
        </div>
      </button>

      <div
        className={`tw-overflow-hidden tw-transition-all tw-duration-200 ${
          isOpen ? 'tw-max-h-[500px] tw-opacity-100' : 'tw-max-h-0 tw-opacity-0'
        }`}
      >
        <div className={`
          tw-px-3 tw-py-2.5 tw-border-t tw-border-gray-200
        `}>
          <div className={`${getTextStyle("small")} tw-text-gray-700`}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}