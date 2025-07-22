import { RiRobotFill} from "react-icons/ri";
export const ChatTypingIndicator: React.FC = () => (
  <div className="tw-flex tw-items-center tw-gap-2 tw-px-6 tw-py-3 tw-bg-gray-50">
    <RiRobotFill className="tw-w-4 tw-h-4 tw-text-blue-600" />
    <div className="tw-flex tw-gap-1">
      <div className="tw-w-2 tw-h-2 tw-rounded-full tw-bg-blue-600 tw-animate-bounce" />
      <div className="tw-w-2 tw-h-2 tw-rounded-full tw-bg-blue-600 tw-animate-bounce tw-delay-100" />
      <div className="tw-w-2 tw-h-2 tw-rounded-full tw-bg-blue-600 tw-animate-bounce tw-delay-200" />
    </div>
    <span className="tw-text-sm tw-text-gray-500">AI is typing...</span>
  </div>
);