import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { FileText, Edit2, Download } from "lucide-react";
import { Link } from "wouter";
import { PresentationWithMeta } from "@/lib/types";
import { AvatarGroup } from "@/components/ui/avatar-group";

interface PresentationCardProps {
  presentation: PresentationWithMeta;
  className?: string;
  colorScheme?: "blue" | "green" | "purple";
}

export default function PresentationCard({
  presentation,
  className,
  colorScheme = "blue",
}: PresentationCardProps) {
  const colorClasses = {
    blue: "from-blue-500 to-indigo-600",
    green: "from-green-500 to-teal-600",
    purple: "from-purple-500 to-pink-600",
  };

  const formattedDate = presentation.updated_at
    ? formatDistanceToNow(new Date(presentation.updated_at), { addSuffix: true })
    : "";

  return (
    <div
      className={cn(
        "bg-white overflow-hidden shadow rounded-lg slide-transition hover:cursor-pointer",
        className
      )}
    >
      <Link href={`/presentations/${presentation.id}`}>
        <div
          className={cn(
            "h-32 bg-gradient-to-r relative",
            colorClasses[colorScheme]
          )}
        >
          <div className="absolute inset-0 flex items-center justify-center text-white">
            <FileText className="h-16 w-16 opacity-20" />
          </div>
        </div>
        <div className="px-4 py-4">
          <div className="flex justify-between items-center">
            <h3 className="text-md font-medium text-gray-900 truncate">
              {presentation.title}
            </h3>
            <span className="text-xs text-gray-500">{formattedDate}</span>
          </div>
          <p className="mt-1 text-sm text-gray-500 truncate">
            {presentation.slides_count} slides - Last edited{" "}
            {formattedDate.replace(" ago", "")}
          </p>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex -space-x-2">
              {presentation.collaborators && presentation.collaborators.length > 0 ? (
                <AvatarGroup users={presentation.collaborators} limit={3} />
              ) : (
                <div className="text-xs text-gray-400">Just you</div>
              )}
            </div>
            <div className="flex space-x-2">
              <button
                className="rounded-full p-1 text-gray-400 hover:text-gray-500 focus:outline-none"
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = `/presentations/${presentation.id}`;
                }}
              >
                <Edit2 className="h-4 w-4" />
              </button>
              <button
                className="rounded-full p-1 text-gray-400 hover:text-gray-500 focus:outline-none"
                onClick={(e) => {
                  e.preventDefault();
                  // Download functionality would be handled here
                }}
              >
                <Download className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
