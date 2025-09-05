import React, { useEffect, useState } from "react";
import {
  RiSearchLine,
  RiCodeLine,
  RiBrainLine,
  RiRouterLine,
  RiToolsLine,
  RiLoader4Line,
  RiCheckLine,
  RiCloseLine,
} from "react-icons/ri";

export type StageStatus = "pending" | "inProgress" | "done" | "failed";

const LIFECYCLE_STAGES = {
  toolDetection: {
    key: "toolDetection",
    name: "Tool Detection",
    icon: RiSearchLine,
    description: "Analyzing your query and detecting required tools...",
  },
  promptBuilder: {
    key: "promptBuilder",
    name: "Prompt Building",
    icon: RiCodeLine,
    description: "Crafting an optimized prompt to get better results...",
  },
  reasoning: {
    key: "reasoning",
    name: "Reasoning",
    icon: RiBrainLine,
    description: "Thinking through the steps to fulfill your request...",
  },
  toolRouter: {
    key: "toolRouter",
    name: "Tool Routing",
    icon: RiRouterLine,
    description: "Routing to the right tool or service for execution...",
  },
  tools: {
    key: "tools",
    name: "Executing Tools",
    icon: RiToolsLine,
    description: "Running tools and collecting the results...",
  },
} as const;

interface LifecycleIndicatorProps {
  stages: Record<string, StageStatus>;
  isProcessing: boolean;
  stageDisplayMs?: number;
}


export const LifecycleIndicator: React.FC<LifecycleIndicatorProps> = ({
  stages,
  isProcessing,
  stageDisplayMs = 4200,
}) => {
  const stageKeys = Object.keys(LIFECYCLE_STAGES);
  const activeQueue = stageKeys.filter((k) => stages[k] && stages[k] !== "done");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!isProcessing) return;
    if (activeQueue.length === 0) return;

    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % activeQueue.length);
    }, stageDisplayMs);

    return () => clearInterval(timer);
  }, [isProcessing, JSON.stringify(stages), stageDisplayMs]);

  useEffect(() => {
    if (!isProcessing) {
      const inProgressIndex = stageKeys.findIndex((k) => stages[k] === "inProgress");
      if (inProgressIndex !== -1) setIndex(Math.max(0, activeQueue.indexOf(stageKeys[inProgressIndex])));
      else setIndex(0);
    }
  }, [isProcessing, JSON.stringify(stages)]);

  if (!isProcessing && Object.values(stages).every((s) => s === "pending")) return null;
  if (Object.values(stages).every((s) => s === "done" || s === "failed") && !isProcessing) return null;
  if (activeQueue.length === 0) return null;

  const activeKey = activeQueue[index % activeQueue.length];
  const stageConfig = (LIFECYCLE_STAGES as any)[activeKey];
  const Icon = stageConfig.icon as React.ComponentType<any>;
  const status = stages[activeKey] as StageStatus;

  const statusLabel = status === "inProgress" ? "Processing" : status === "pending" ? "Queued" : status === "failed" ? "Failed" : "Completed";

  return (
    <div className="tw-w-full tw-max-w-4xl tw-mx-auto tw-my-6">
      <div
        className="tw-flex tw-items-center tw-gap-4 tw-px-4 tw-py-3 tw-rounded-2xl tw-border tw-border-gray-200 tw-bg-gradient-to-r tw-from-white tw-to-gray-50 tw-shadow-lg"
        role="status"
        aria-live="polite"
      >
        <div className="tw-flex tw-items-center tw-gap-3 tw-min-w-0">
          <div
            className={`tw-w-10 tw-h-10 tw-flex tw-items-center tw-justify-center tw-rounded-md tw-shadow-sm tw-ring-1 tw-ring-inset tw-ring-gray-100 ${
              status === "inProgress" ? "tw-bg-blue-50" : status === "failed" ? "tw-bg-red-50" : "tw-bg-green-50"
            }`}
          >
            {status === "inProgress" ? (
              <RiLoader4Line className="tw-w-5 tw-h-5 tw-animate-spin tw-text-blue-600" />
            ) : status === "failed" ? (
              <RiCloseLine className="tw-w-5 tw-h-5 tw-text-red-600" />
            ) : (
              <Icon className="tw-w-5 tw-h-5 tw-text-gray-700" />
            )}
          </div>
        </div>

        <div className="tw-flex-1 tw-min-w-0">
          <div className="tw-flex tw-flex-col tw-transition-all tw-duration-500">
            <div className="tw-flex tw-items-center tw-gap-3 tw-leading-tight">
              <h4 className="tw-text-sm tw-font-semibold tw-truncate tw-text-gray-900">{stageConfig.name}</h4>

              <span
                className={`tw-text-xs tw-font-medium tw-px-2 tw-py-0.5 tw-rounded-full tw-whitespace-nowrap tw-ml-2 ${
                  status === "inProgress" ? "tw-bg-blue-100 tw-text-blue-800" : status === "failed" ? "tw-bg-red-100 tw-text-red-800" : "tw-bg-green-100 tw-text-green-800"
                }`}
              >
                {statusLabel}
              </span>
            </div>

            <p className="tw-text-xs tw-text-gray-600 tw-truncate">
              {status === "inProgress"
                ? stageConfig.description
                : status === "failed"
                ? "An error happened while processing this stage."
                : "Stage completed successfully."}
            </p>
          </div>

          <div className="tw-relative tw-mt-2 tw-h-1 tw-bg-gray-100 tw-rounded-full tw-overflow-hidden">
            <div
              className={`tw-absolute tw-top-0 tw-left-0 tw-h-full tw-rounded-full tw-transition-all tw-duration-700 ${
                status === "inProgress" ? "tw-bg-blue-500 tw-w-3/4 tw-animate-pulse" : status === "failed" ? "tw-bg-red-500 tw-w-full" : "tw-bg-green-500 tw-w-full"
              }`}
              style={{ width: status === "pending" ? "18%" : undefined }}
            />
          </div>
        </div>

        <div className="tw-flex tw-flex-col tw-items-end tw-justify-center tw-gap-1">
          <span className="tw-text-xs tw-text-gray-500">{new Date().toLocaleTimeString()}</span>

          <div className="tw-flex tw-items-center tw-gap-2">
            {status === "done" ? <RiCheckLine className="tw-w-4 tw-h-4 tw-text-green-600" /> : null}
            {status === "failed" ? <RiCloseLine className="tw-w-4 tw-h-4 tw-text-red-600" /> : null}
          </div>
        </div>
      </div>

      <div className="tw-mt-2 tw-overflow-hidden tw-rounded-full tw-bg-transparent">
        <div className="tw-whitespace-nowrap tw-text-xs tw-text-gray-500 tw-px-4 tw-py-1 tw-animate-marquee">
          {stageKeys
            .map((k) => `${(LIFECYCLE_STAGES as any)[k].name} — ${(stages as any)[k] || "pending"}`)
            .join("  •  ")}
        </div>
      </div>
    </div>
  );
};