import { ArrowRight, Users, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface TeamMember {
  avatar: string;
  name: string;
}

interface ProjectCardProps {
  name: string;
  description?: string;
  status?: 'active' | 'completed' | 'archived';
  createdAt?: string;
  teamMembers?: TeamMember[];
}

export function ProjectCard({ 
  name, 
  description, 
  status = 'active',
  createdAt,
  teamMembers = [] 
}: ProjectCardProps) {
  
  // Get status badge
  const getStatusBadge = () => {
    switch (status) {
      case 'active':
        return (
          <Badge variant="outline" className="text-xs flex items-center gap-1 py-0 h-5 bg-blue-50 text-blue-700 border-blue-200">
            <Clock className="h-3 w-3" />
            Active
          </Badge>
        );
      case 'completed':
        return (
          <Badge variant="outline" className="text-xs flex items-center gap-1 py-0 h-5 bg-green-50 text-green-700 border-green-200">
            <CheckCircle2 className="h-3 w-3" />
            Completed
          </Badge>
        );
      case 'archived':
        return (
          <Badge variant="outline" className="text-xs flex items-center gap-1 py-0 h-5 bg-gray-50 text-gray-700 border-gray-200">
            <AlertCircle className="h-3 w-3" />
            Archived
          </Badge>
        );
      default:
        return null;
    }
  };
  
  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="project-card group border rounded-lg p-4 hover:border-primary hover:shadow-sm transition-all">
      <div className="flex h-full flex-col justify-between">
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <h3 className="text-lg font-semibold">{name}</h3>
            {getStatusBadge()}
          </div>
          
          {description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {description}
            </p>
          )}
        </div>
        
        <div className="mt-4 pt-2 flex items-center justify-between">
          <div className="avatar-stack flex items-center -space-x-2">
            {teamMembers.map((member, i) => (
              <img
                key={i}
                src={member.avatar}
                alt={member.name}
                className="h-8 w-8 rounded-full border-2 border-background transition-transform hover:scale-110"
              />
            ))}
            <Button
              size="icon"
              variant="outline"
              className="h-8 w-8 rounded-full ml-1"
            >
              <Users className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            {createdAt && (
              <span className="text-xs text-muted-foreground">
                {formatDate(createdAt)}
              </span>
            )}
            <Button size="icon" className="opacity-0 transition-opacity group-hover:opacity-100">
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}