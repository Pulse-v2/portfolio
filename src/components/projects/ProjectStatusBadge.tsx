import { Badge } from "@/components/ui/Badge";
import { projectStatusLabels } from "@/lib/projects";
import type { ProjectStatus } from "@/types/project";

export function ProjectStatusBadge({ status }: { status?: ProjectStatus }) {
  if (!status) return null;

  return (
    <Badge variant={status === "completed" ? "success" : "warning"} dot>
      {projectStatusLabels[status]}
    </Badge>
  );
}
