export const RICH_TEXT_REGEX =
  /(?<!\$)\[([a-zA-Z0-9\W\_\s]+)\]{(([a-zA-Z-]+\:[a-zA-Z0-9#]+;)+)}/gm;

export function richTextToHtml(
  text: string,
  matcher?: (match: string, style: string, position: number) => void
) {
  return text.replace(RICH_TEXT_REGEX, (match, p1, p2, ...others) => {
    matcher?.(match, p2, others[1]);

    return `<span style="${p2}">${p1}</span>`;
  });
}
