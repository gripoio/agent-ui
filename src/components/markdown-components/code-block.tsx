import { useState } from "react";
import { IoCopyOutline } from "react-icons/io5";

interface CodeBlockProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
  node?: any; // 👈 added to avoid type error when passNode: true
}

export function CodeBlock({ children, className = "", ...props }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(children?.toString() || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="tw-relative tw-my-4">
      <pre
        className={`tw-overflow-x-auto tw-rounded-lg tw-p-4 tw-text-sm tw-font-mono 
          tw-bg-gray-100 tw-text-gray-800 dark:tw-bg-gray-800 dark:tw-text-gray-100 
          ${className}`}
        {...props}
      >
        <code>{children}</code>
      </pre>

      <button
        onClick={handleCopy}
        className="tw-absolute tw-top-2 tw-right-2 tw-flex tw-items-center tw-gap-1 
                   tw-rounded-md tw-border tw-border-gray-300 dark:tw-border-gray-600 
                   tw-bg-white dark:tw-bg-gray-700 
                   tw-px-2 tw-py-1 tw-text-xs tw-text-gray-700 dark:tw-text-gray-200 
                   hover:tw-bg-gray-200 dark:hover:tw-bg-gray-600 tw-transition"
      >
        <IoCopyOutline className="tw-h-4 tw-w-4" />
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
  );
}
