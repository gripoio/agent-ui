
export type ToolCall = {
  id: string;
  type: "tool_call";
  name: string;
  status: ToolStatuses;
  result: string;
  agentResposne: string;
  args: Record<string, any>;
  meta: {
    startTime: string;
    endTime: string;
  };
};

export type ToolStatuses = "complete" | "fail" | "pending" | "start";

type ToolCallMessage = {
  id: string;
  type: "toolCallMessage";
  content: string | null;
  toolCalls: ToolCall[];
};

type TextMessage = {
  id: string;
  type: "textMessage";
  content: string;
  toolCalls: [];
};

type Message = ToolCallMessage | TextMessage;

type State = {
  messages: Message[];
  profiles: {
    toolActions: number;
    toolDetection: number;
    promptBuilder: number;
    reasoning: number;
    toolResponses: number;
  };
  detectedTools: string[];
};

export type DynamicMessagePayload = {
  name: string; // dynamic/unknown value
  state: State;
};
