
import { ArrowRight, Users } from "lucide-react";
import { Button } from "./ui/button";

interface ProjectCardProps {
  name: string;
  teamMembers?: { avatar: string; name: string }[];
}

export function ProjectCard({ name, teamMembers = [] }: ProjectCardProps) {
  return (
    <div className="project-card group">
      <div className="flex h-full items-center justify-between">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">{name}</h3>
          <div className="avatar-stack">
            {teamMembers.map((member, i) => (
              <img
                key={i}
                src={member.avatar}
                alt={member.name}
                className="transition-transform hover:scale-110"
              />
            ))}
            <Button
              size="icon"
              variant="outline"
              className="h-8 w-8 rounded-full"
            >
              <Users className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <Button size="icon" className="opacity-0 transition-opacity group-hover:opacity-100">
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
