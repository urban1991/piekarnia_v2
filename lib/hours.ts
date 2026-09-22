/** Parses the free-text `hours` field into rows for display. */
export function parseHours(hours: string): { day: string; time: string }[] {
  return hours
    .split(/\s*(?:·|\n|;)\s*/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) => {
      const spaceIndex = line.search(/\s/);
      if (spaceIndex === -1) return { day: line, time: '' };
      return { day: line.slice(0, spaceIndex), time: line.slice(spaceIndex + 1).trim() };
    });
}
