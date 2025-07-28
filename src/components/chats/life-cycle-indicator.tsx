import React from "react";
import {
  RiSearchLine,
  RiCodeLine,
  RiBrainLine,
  RiRouterLine,
  RiToolsLine,
  RiLoader4Line,
  RiCheckLine
} from "react-icons/ri";

const LIFECYCLE_STAGES = {
  toolDetection: {
    name: "Tool Detection",
    icon: RiSearchLine,
    description: "Analyzing your query and detecting required tools...",
    color: "tw-text-blue-500"
  },
  promptBuilder: {
    name: "Prompt Building", 
    icon: RiCodeLine,
    description: "Building optimized prompts for better responses...",
    color: "tw-text-green-500"
  },
  reasoning: {
    name: "Reasoning",
    icon: RiBrainLine, 
    description: "Processing your request and planning actions...",
    color: "tw-text-purple-500"
  },
  toolRouter: {
    name: "Tool Routing",
    icon: RiRouterLine,
    description: "Routing to appropriate tools and services...",
    color: "tw-text-orange-500"
  },
  tools: {
    name: "Executing Tools",
    icon: RiToolsLine,
    description: "Executing tools and gathering information...",
    color: "tw-text-red-500"
  }
};

interface LifecycleIndicatorProps {
  stages: Record<string, string>;
  currentStage?: string;
  isProcessing: boolean;
}

export const LifecycleIndicator: React.FC<LifecycleIndicatorProps> = ({
  stages,
  currentStage,
  isProcessing
}) => {
  if (!isProcessing && !Object.values(stages).some(stage => stage)) {
    return null;
  }

  return (
    <div className="tw-w-full tw-max-w-2xl tw-p-4 tw-bg-gray-100 tw-rounded-lg tw-mb-4">
      <div className="tw-flex tw-items-center tw-gap-2 tw-mb-3">
        <RiBrainLine className="tw-w-5 tw-h-5 tw-text-gray-600" />
        <span className="tw-text-sm tw-font-medium tw-text-gray-700">
          AI Processing Pipeline
        </span>
      </div>
      
      <div className="tw-space-y-3">
        {Object.entries(LIFECYCLE_STAGES).map(([key, config]) => {
          const Icon = config.icon;
          const status = stages[key];
          const isActive = currentStage === key;
          const isCompleted = status === "✅ Done" || (status && status !== "");
          const isInProgress = isActive && isProcessing;

          return (
            <div key={key} className="tw-flex tw-items-center tw-gap-3">
              <div className={`tw-flex tw-items-center tw-justify-center tw-w-8 tw-h-8 tw-rounded-full tw-transition-all tw-duration-300 ${
                isCompleted 
                  ? "tw-bg-green-100 tw-text-green-600" 
                  : isInProgress
                  ? `tw-bg-blue-100 ${config.color}`
                  : "tw-bg-gray-200 tw-text-gray-400"
              }`}>
                {isCompleted ? (
                  <RiCheckLine className="tw-w-4 tw-h-4" />
                ) : isInProgress ? (
                  <RiLoader4Line className="tw-w-4 tw-h-4 tw-animate-spin" />
                ) : (
                  <Icon className="tw-w-4 tw-h-4" />
                )}
              </div>
              
              <div className="tw-flex-1">
                <div className={`tw-text-sm tw-font-medium tw-transition-colors tw-duration-300 ${
                  isCompleted 
                    ? "tw-text-green-700" 
                    : isInProgress
                    ? "tw-text-gray-800"
                    : "tw-text-gray-500"
                }`}>
                  {config.name}
                </div>
                
                {isInProgress && (
                  <div className="tw-text-xs tw-text-gray-600 tw-mt-1">
                    {config.description}
                  </div>
                )}
              </div>
              
              {isCompleted && (
                <div className="tw-text-xs tw-text-green-600 tw-font-medium">
                  Complete
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {isProcessing && (
        <div className="tw-mt-3 tw-pt-3 tw-border-t tw-border-gray-200">
          <div className="tw-flex tw-items-center tw-gap-2 tw-text-xs tw-text-gray-600">
            <RiLoader4Line className="tw-w-3 tw-h-3 tw-animate-spin" />
            <span>Processing your request...</span>
          </div>
        </div>
      )}
    </div>
  );
};
