// ToolDisplay Component - Light Mode Only
import { IoAlert } from "react-icons/io5";
import { RiCheckboxCircleFill, RiPassPendingFill } from "react-icons/ri";
import { CiLock } from "react-icons/ci";
import { HiOutlineClipboard, HiOutlineCheck } from "react-icons/hi";
import { useState } from "react";
import { Accordion } from "../accordian";
import { ToolCall, ToolStatuses } from "../../types/chats";
import { getToolExecutionTime } from "../../utils/chats/tool-excution-time";

interface ToolDisplayProps {
  toolCalls?: ToolCall[] | undefined;
}

// Copy Button Component
function CopyButton({ content, label }: { content: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="tw-inline-flex tw-items-center tw-gap-1.5 tw-px-2.5 tw-py-1.5 tw-text-xs tw-font-medium tw-text-gray-600 tw-bg-white tw-border tw-border-gray-200 tw-rounded-md hover:tw-bg-gray-50 hover:tw-text-gray-900 tw-transition-all tw-duration-200 tw-shadow-sm hover:tw-shadow-md"
      title={`Copy ${label}`}
    >
      {copied ? (
        <>
          <HiOutlineCheck className="tw-w-3.5 tw-h-3.5 tw-text-green-500" />
          <span className="tw-text-green-600">Copied!</span>
        </>
      ) : (
        <>
          <HiOutlineClipboard className="tw-w-3.5 tw-h-3.5" />
          <span>Copy {label}</span>
        </>
      )}
    </button>
  );
}

// Status component with icons
export function StatusIndicator({ status }: { status: ToolStatuses }) {
  const statusConfig = {
    complete: {
      icon: RiCheckboxCircleFill,
      text: 'Complete',
      className: 'tw-text-green-700 tw-bg-green-100 tw-border-green-200'
    },
    fail: {
      icon: IoAlert,
      text: 'Failed',
      className: 'tw-text-red-700 tw-bg-red-100 tw-border-red-200'
    },
    start: {
      icon: CiLock,
      text: 'Running',
      className: 'tw-text-amber-700 tw-bg-amber-100 tw-border-amber-200'
    },
    pending: {
      icon: RiPassPendingFill,
      text: "Pending",
      className: "tw-text-blue-700 tw-bg-blue-100 tw-border-blue-200",
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className={`tw-inline-flex tw-items-center tw-gap-2 tw-px-3 tw-py-1.5 tw-rounded-full tw-text-sm tw-font-medium tw-border ${config.className} tw-shadow-sm`}>
      <Icon className="tw-w-4 tw-h-4" />
      {config.text}
    </div>
  );
}

// Content Display Component
function ContentDisplay({ content, type, status }: { content: string; type: 'arguments' | 'results'; status?: ToolStatuses }) {
  const isError = status === 'fail' && type === 'results';
  
  return (
    <div className="tw-relative tw-group tw-w-full">
      <div className="tw-absolute tw-top-2 tw-right-2 tw-opacity-0 group-hover:tw-opacity-100 tw-transition-opacity tw-duration-200 tw-z-20">
        <CopyButton content={content} label={type} />
      </div>
      <div className="tw-bg-gray-50 tw-border tw-border-gray-200 tw-rounded-lg tw-p-4 tw-w-full">
        <div className="tw-w-full tw-overflow-x-auto">
          <pre className={`tw-text-sm tw-whitespace-pre-wrap tw-break-words tw-font-mono tw-leading-relaxed tw-w-full tw-min-w-0 tw-pr-12 ${
            isError 
              ? 'tw-text-red-600' 
              : 'tw-text-gray-800'
          }`}>
            {content}
          </pre>
        </div>
      </div>
    </div>
  );
}

export function ToolDisplay({ toolCalls }: ToolDisplayProps) {
  if (toolCalls?.length === 0) {
    return null;
  }
  
  return (
    <div className="tw-space-y-4 tw-mb-4">
      {toolCalls?.map((tool) => (
        <div
          key={tool.id}
          className="tw-bg-white tw-border tw-border-gray-200 tw-rounded-xl tw-shadow-sm hover:tw-shadow-md tw-transition-shadow tw-duration-200 tw-w-full"
        >
          <Accordion
            toolName={tool.name}
            startTime={tool.meta.startTime}
            endTime={tool.meta.endTime}
            status={tool.status}
            isToolParent={true}
          >
            <div className="tw-space-y-4">
              
              {/* Arguments Section */}
              <div className="tw-space-y-3 tw-w-full">
                <Accordion
                  key={`${tool.id}-args`}
                  toolName="Arguments"
                  isNested={true}
                >
                  <div className="tw-pt-3 tw-w-full">
                    <ContentDisplay 
                      content={JSON.stringify(tool.args, null, 2)} 
                      type="arguments"
                    />
                  </div>
                </Accordion>
              </div>
              
              {/* Results Section */}
              <div className="tw-space-y-3 tw-w-full">
                <Accordion
                  key={`${tool.id}-results`}
                  toolName="Results"
                  isNested={true}
                >
                  <div className="tw-pt-3 tw-w-full">
                    <ContentDisplay 
                      content={tool?.result || ''} 
                      type="results"
                      status={tool.status}
                    />
                  </div>
                </Accordion>
              </div>
            </div>
          </Accordion>
        </div>
      ))}
    </div>
  );
}

