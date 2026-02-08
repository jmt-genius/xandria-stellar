/**
 * Serialize a DOM text node's path relative to a container element.
 * Produces a string like "p:nth-of-type(2)/text()[1]".
 */
function getNodePath(node: Node, container: Element): string {
  const parts: string[] = [];
  let current: Node | null = node;

  while (current && current !== container) {
    const parent: Node | null = current.parentNode;
    if (!parent) break;

    if (current.nodeType === Node.TEXT_NODE) {
      // Count text node index among siblings
      let textIdx = 0;
      for (const child of Array.from(parent.childNodes)) {
        if (child === current) break;
        if (child.nodeType === Node.TEXT_NODE) textIdx++;
      }
      parts.unshift(`text()[${textIdx}]`);
    } else if (current.nodeType === Node.ELEMENT_NODE) {
      const el = current as Element;
      const tag = el.tagName.toLowerCase();
      // Count nth-of-type among siblings
      let nth = 1;
      if (parent instanceof Element) {
        for (const sibling of Array.from(parent.children)) {
          if (sibling === el) break;
          if (sibling.tagName.toLowerCase() === tag) nth++;
        }
      }
      parts.unshift(`${tag}:nth-of-type(${nth})`);
    }

    current = parent;
  }

  return parts.join("/");
}

/**
 * Resolve a serialized path back to a DOM node relative to a container.
 */
function resolveNodePath(path: string, container: Element): Node | null {
  const parts = path.split("/");
  let current: Node = container;

  for (const part of parts) {
    const textMatch = part.match(/^text\(\)\[(\d+)]$/);
    if (textMatch) {
      const targetIdx = parseInt(textMatch[1], 10);
      let textIdx = 0;
      for (const child of Array.from(current.childNodes)) {
        if (child.nodeType === Node.TEXT_NODE) {
          if (textIdx === targetIdx) return child;
          textIdx++;
        }
      }
      return null;
    }

    const elMatch = part.match(/^(.+):nth-of-type\((\d+)\)$/);
    if (elMatch) {
      const tag = elMatch[1];
      const nth = parseInt(elMatch[2], 10);
      let count = 0;
      for (const child of Array.from((current as Element).children)) {
        if (child.tagName.toLowerCase() === tag) {
          count++;
          if (count === nth) {
            current = child;
            break;
          }
        }
      }
      if (count < nth) return null;
    }
  }

  return current === container ? null : current;
}

export function serializeRange(
  range: Range,
  container: Element
): { startPath: string; endPath: string; startOffset: number; endOffset: number } {
  return {
    startPath: getNodePath(range.startContainer, container),
    endPath: getNodePath(range.endContainer, container),
    startOffset: range.startOffset,
    endOffset: range.endOffset,
  };
}

export function deserializeRange(
  highlight: { startPath: string; endPath: string; startOffset: number; endOffset: number },
  container: Element
): Range | null {
  const startNode = resolveNodePath(highlight.startPath, container);
  const endNode = resolveNodePath(highlight.endPath, container);
  if (!startNode || !endNode) return null;

  try {
    const range = document.createRange();
    range.setStart(startNode, highlight.startOffset);
    range.setEnd(endNode, highlight.endOffset);
    return range;
  } catch {
    return null;
  }
}

/**
 * Apply a highlight mark to a range. Handles same-element selections
 * and gracefully falls back for cross-element selections.
 */
export function applyHighlightMark(range: Range, color: string, highlightId: string): boolean {
  try {
    // Same container — simple wrap
    if (range.startContainer === range.endContainer) {
      const mark = document.createElement("mark");
      mark.style.backgroundColor = color;
      mark.style.color = "inherit";
      mark.style.borderRadius = "2px";
      mark.style.padding = "0 1px";
      mark.dataset.highlightId = highlightId;
      range.surroundContents(mark);
      return true;
    }

    // Cross-element selection — wrap each text node individually
    const nodes = getTextNodesInRange(range);
    for (const { node, start, end } of nodes) {
      const text = node.textContent || "";
      if (start >= text.length) continue;

      const mark = document.createElement("mark");
      mark.style.backgroundColor = color;
      mark.style.color = "inherit";
      mark.style.borderRadius = "2px";
      mark.style.padding = "0 1px";
      mark.dataset.highlightId = highlightId;

      const subRange = document.createRange();
      subRange.setStart(node, start);
      subRange.setEnd(node, Math.min(end, text.length));
      subRange.surroundContents(mark);
    }
    return true;
  } catch {
    return false;
  }
}

function getTextNodesInRange(range: Range): { node: Text; start: number; end: number }[] {
  const results: { node: Text; start: number; end: number }[] = [];
  const walker = document.createTreeWalker(
    range.commonAncestorContainer,
    NodeFilter.SHOW_TEXT,
  );

  let node: Text | null;
  while ((node = walker.nextNode() as Text | null)) {
    if (!range.intersectsNode(node)) continue;
    const start = node === range.startContainer ? range.startOffset : 0;
    const end = node === range.endContainer ? range.endOffset : (node.textContent?.length || 0);
    if (start < end) results.push({ node, start, end });
  }
  return results;
}
