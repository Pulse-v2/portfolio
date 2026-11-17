import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

interface TagListProps {
  items: string[];
  label: string;
  /** Show at most this many tags and summarise the rest as "+N". */
  limit?: number;
  size?: "sm" | "md";
  className?: string;
}

export function TagList({ items, label, limit, size = "sm", className }: TagListProps) {
  const visible = limit ? items.slice(0, limit) : items;
  const hidden = items.length - visible.length;

  return (
    <ul aria-label={label} className={cn("flex flex-wrap gap-1.5", className)}>
      {visible.map((item) => (
        <li key={item}>
          <Badge size={size}>{item}</Badge>
        </li>
      ))}
      {hidden > 0 && (
        <li>
          <Badge size={size} title={items.slice(visible.length).join(", ")}>
            +{hidden}
            <span className="sr-only"> more: {items.slice(visible.length).join(", ")}</span>
          </Badge>
        </li>
      )}
    </ul>
  );
}
