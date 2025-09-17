import { useState } from "react";
import { getTextStyle } from "../utils/textStyles";
import { StatusIndicator } from "./chats/tool-display";
import { IoChevronDown } from "react-icons/io5";
import { ToolStatuses } from "../types/chats";
import { getToolExecutionTime } from "../utils/chats/tool-excution-time";

export function Accordion({
  toolName,
  startTime,
  endTime,
  status,
  children,
  isToolParent = false,
  isNested = false
}: {
  toolName: string;
  startTime?:string;
  endTime?:string;
  status?: ToolStatuses;
  children: React.ReactNode;
  isToolParent?:boolean;
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
     {isToolParent && (
            <div className="tw-flex tw-items-center tw-gap-2 tw-text-sm tw-text-gray-600 tw-bg-gray-50 tw-px-3 tw-py-2 tw-rounded-lg tw-border tw-border-gray-200">
                          <svg className="tw-w-4 tw-h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>
                            Executed in <span className="tw-font-semibold tw-text-gray-900">
                              {getToolExecutionTime(startTime as string,endTime as string)}
                            </span>
                          </span>
                        </div>
     )}
          {status && <StatusIndicator status={status} />}
          <IoChevronDown
            className={`tw-w-4 tw-h-4 tw-text-gray-500 tw-transition-transform tw-duration-200 ${
              isOpen ? 'tw-rotate-180' : ''
            }`}
          />
        </div>
      </button>

   <div
  className={`tw-transition-all tw-duration-200 ${
    isOpen
      ? "tw-max-h-[500px] tw-opacity-100 tw-overflow-y-auto"
      : "tw-max-h-0 tw-opacity-0 tw-overflow-hidden"
  }`}
>
  <div
    className={`
      tw-px-3 tw-py-2.5 tw-border-t tw-border-gray-200
    `}
  >
    <div className={`${getTextStyle("small")} tw-text-gray-700`}>
      {children}
    </div>
  </div>
</div>

    </div>
  );
}