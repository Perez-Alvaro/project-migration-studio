/** Renders plain text written in the admin panel: blank lines split paragraphs, "## " starts a subtitle, "- " a list item. */
export function RichText({ text }: { text: string }) {
  const blocks = text.split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);
  return (
    <div className="space-y-5 text-lg leading-relaxed text-foreground">
      {blocks.map((block, i) => {
        if (block.startsWith("## ")) {
          return <h2 key={i} className="text-2xl font-bold pt-4">{block.slice(3)}</h2>;
        }
        const lines = block.split("\n");
        if (lines.every((l) => l.trim().startsWith("- "))) {
          return (
            <ul key={i} className="list-disc pl-6 space-y-1">
              {lines.map((l, j) => <li key={j}>{l.trim().slice(2)}</li>)}
            </ul>
          );
        }
        return <p key={i} className="whitespace-pre-line">{block}</p>;
      })}
    </div>
  );
}
