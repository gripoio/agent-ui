import { IoAlert } from "react-icons/io5";
import { RiCheckboxCircleFill , RiPassPendingFill } from "react-icons/ri";
import { CiLock } from "react-icons/ci";
import { Accordion } from "../accordian";
import { ToolCall, ToolStatuses } from "../../types/chats";
import { Markdown } from "../../utils/markdownToReact";
import { getToolExecutionTime } from "../../utils/chats/tool-excution-time";

interface ToolDisplayProps {
  toolCalls?: ToolCall[] | undefined;
}
// Status component with icons
export function StatusIndicator({ status }: { status: ToolStatuses }) {
  const statusConfig = {
    complete: {
      icon: RiCheckboxCircleFill,
      text: 'Complete',
      className: 'tw-text-green-600 dark:tw-text-green-400 tw-bg-green-50 dark:tw-bg-green-900/20'
    },
    fail: {
      icon: IoAlert,
      text: 'Failed',
      className: 'tw-text-red-600 dark:tw-text-red-400 tw-bg-red-50 dark:tw-bg-red-900/20'
    },
    start: {
      icon: CiLock,
      text: 'Running',
      className: 'tw-text-amber-600 dark:tw-text-amber-400 tw-bg-amber-50 dark:tw-bg-amber-900/20'
    },
        pending: {
      icon: RiPassPendingFill,
      text: "Pending",
      className:
        "tw-text-blue-600 dark:tw-text-blue-400 tw-bg-blue-50 dark:tw-bg-blue-900/20",
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className={`tw-inline-flex tw-items-center tw-gap-1.5 tw-px-2.5 tw-py-1 tw-rounded-full tw-text-xs tw-font-medium ${config.className}`}>
      <Icon className="tw-w-3.5 tw-h-3.5" />
      {config.text}
    </div>
  );
}

export function ToolDisplay({toolCalls}:ToolDisplayProps) {

  if(toolCalls?.length === 0){
    return;
  }

  return (

       <div className="tw-w-full tw-max-w-xl tw">
      <section className="tw-space-y-2">
        {toolCalls?.map((tool) => (
          <Accordion
            key={tool.id}
            toolName={tool.name}
            status={tool.status}
          >
            <div className="tw-space-y-2">
              {/* Execution Time */}
              <div className="tw-text-xs tw-text-gray-600 dark:tw-text-gray-400 tw-mb-2">
                Executed in <span className="tw-font-semibold">{getToolExecutionTime(tool.meta.startTime, tool.meta.endTime)}</span>
              </div>
              
              {/* Arguments Accordion */}
              <Accordion
                key={`${tool.id}-args`}
                toolName="Arguments"
                isNested={true}
              >
                <Markdown>
                  {JSON.stringify(tool.args, null, 2)}
                </Markdown>
              </Accordion>
              
              {/* Results Accordion */}
              <Accordion
                key={`${tool.id}-results`}
                toolName="Results"
                isNested={true}
              >
                <Markdown>
                  {typeof tool.result === 'string' 
                    ? tool.result 
                    : JSON.stringify(tool.result, null, 2)
                  }
                </Markdown>
              </Accordion>
            </div>
          </Accordion>
        ))}
      </section>
    </div>
    
  );
}