import { getTextStyle } from "../../utils/textStyles";
import { IoAlert } from "react-icons/io5";
import { RiCheckboxCircleFill } from "react-icons/ri";
import { CiLock } from "react-icons/ci";
import { Accordion } from "../accordian";

// Status component with icons
export function StatusIndicator({ status }: { status: 'success' | 'error' | 'pending' }) {
  const statusConfig = {
    success: {
      icon: RiCheckboxCircleFill,
      text: 'Complete',
      className: 'tw-text-green-600 dark:tw-text-green-400 tw-bg-green-50 dark:tw-bg-green-900/20'
    },
    error: {
      icon: IoAlert,
      text: 'Failed',
      className: 'tw-text-red-600 dark:tw-text-red-400 tw-bg-red-50 dark:tw-bg-red-900/20'
    },
    pending: {
      icon: CiLock,
      text: 'Running',
      className: 'tw-text-amber-600 dark:tw-text-amber-400 tw-bg-amber-50 dark:tw-bg-amber-900/20'
    }
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

export function ToolDisplay() {
  // Mock data - replace with your actual data
  const tools = [
{
      id: 1,
      name: "Web Search Tool",
      status: 'success' as const,
      content: "Successfully searched for 'React best practices' and found 15 relevant results. The search included documentation from official React website, community articles, and recent blog posts about modern React development patterns."
    },
  ];

  return (

      <div  className="">
        
        {/* Tools Section */}
        <section className="tw-space-y-4">
      
  {
    tools.length > 0 && (
                 <div className="tw-flex tw-items-center tw-justify-between tw-mb-6">
            <h2 className={`${getTextStyle("heading3")}`}>
              Active Tools
            </h2>
            <div className={`${getTextStyle("caption")} tw-text-blue-600 dark:tw-text-blue-400`}>
              {tools.length} tools running
            </div>
          </div>
    )
  }
          <div className="tw-space-y-3">
            {tools.map((tool) => (
              <Accordion
                key={tool.id}
                toolName={tool.name}
                status={tool.status}
              >
                {tool.content}
                <Accordion 
                key={tool.id}
                toolName={"Arguments"}
                >
                    nested content
                </Accordion>
                       <Accordion 
                key={tool.id}
                toolName={"Results"}
                >
                    nested content
                </Accordion>
              </Accordion>
            ))}
          </div>
        </section>

        {/* Empty State (show when no tools) */}
        {tools.length === 0 && (
     
            <h3 className={`${getTextStyle("paragraph")} `}>
              No tools found
            </h3>
        )}
      </div>
    
  );
}