import { useState } from "react";
import { IoCopyOutline } from "react-icons/io5";

interface CodeBlockProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
  node?: any; // 👈 avoid type error when passNode: true
}

export function CodeBlock({ children, className = "", ...props }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const text = children?.toString() || "";

    try {
      if (navigator.clipboard && window.isSecureContext) {
        // ✅ Modern API (only works on HTTPS or localhost)
        await navigator.clipboard.writeText(text);
      } else {
        // ⚡ Fallback for HTTP or unsupported browsers
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed"; // avoid scroll jump
        textArea.style.left = "-9999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }

      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  return (
    <div className="tw-relative tw-my-4">
      <pre
        className={`tw-overflow-x-auto tw-rounded-lg tw-p-4 tw-text-sm tw-font-mono 
          tw-bg-gray-200 tw-text-gray-900 tw-border tw-border-gray-200 
          ${className}`}
        {...props}
      >
        <code>{children}</code>
      </pre>

      <button
        onClick={handleCopy}
        className="tw-absolute tw-top-2 tw-right-2 tw-flex tw-items-center tw-gap-1 
                   tw-rounded-md tw-border 
                   tw-border-gray-300 tw-bg-white tw-text-gray-700
                   tw-px-2 tw-py-1 tw-text-xs 
                   hover:tw-bg-gray-100
                   focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500 focus:tw-ring-offset-1
                   tw-transition-colors tw-duration-200 tw-shadow-sm"
      >
        <IoCopyOutline className="tw-h-4 tw-w-4" />
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
  );
}
