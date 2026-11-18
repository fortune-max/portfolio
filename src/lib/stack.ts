/** "Built with A, B and C" for a project's stack; empty string when there is nothing to list. */
export function builtWith(stack: string[]): string {
  if (stack.length === 0) return '';
  const list = stack.length === 1 ? stack[0] : `${stack.slice(0, -1).join(', ')} and ${stack[stack.length - 1]}`;
  return `Built with ${list}`;
}
