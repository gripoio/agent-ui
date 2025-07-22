export const getHighlightedText = (text: string) => {
  const escaped = text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const withMentions = escaped.replace(
    /(@\w+)/g,
    '<span class="tw-bg-blue-100 tw-text-blue-800 tw-rounded">$1</span>'
  );
  return withMentions.replace(/\n/g, "<br />");
};
