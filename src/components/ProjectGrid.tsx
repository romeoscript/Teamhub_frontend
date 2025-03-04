import { Plus, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { ProjectCard } from "./ProjectCard";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";

// Define project type
interface Project {
  id: string;
  name: string;
  description?: string;
  status?: 'active' | 'completed' | 'archived';
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  creatorName?: string;
  creatorPhoto?: string | null;
}

interface TeamMember {
  avatar: string;
  name: string;
}

// Define props interface with teamId
interface ProjectGridProps {
  teamId?: string;
}

export function ProjectGrid({ teamId: propTeamId }: ProjectGridProps) {
  const { currentUser } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newProjectName, setNewProjectName] = useState("");
  
  // Use teamId from props or fall back to currentUser.teamId
  const teamId = propTeamId || currentUser?.teamId || 'current';

  // Fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Authentication token not found');
        }
        
        const response = await fetch(`http://localhost:5001/api/projects/${teamId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch projects');
        }
        
        const data = await response.json();
        setProjects(data.projects || []);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setError(error instanceof Error ? error.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (teamId) {
      fetchProjects();
    }
  }, [teamId]);

  // Create new project
  const createProject = async () => {
    if (!newProjectName.trim()) {
      toast.error("Project name is required");
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      const response = await fetch('http://localhost:5001/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: newProjectName,
          description: ""
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create project');
      }
      
      const data = await response.json();
      
      // Add new project to the list
      setProjects(prev => [data.project, ...prev]);
      
      // Reset form
      setNewProjectName("");
      
      toast.success('Project created successfully');
    } catch (error) {
      console.error('Error creating project:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create project');
    }
  };

  // Generate team members for display
  const getTeamMembers = (projectId: string): { avatar: string; name: string }[] => {
    return [
      {
        name: currentUser?.username || "Team Member",
        avatar: currentUser?.profilePhoto || `https://api.dicebear.com/7.x/avataaars/svg?seed=${projectId}`,
      },
    ];
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center items-center h-32">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="space-y-6">
        <div className="p-4 border border-destructive/20 bg-destructive/10 rounded-lg text-destructive text-center">
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {projects.length === 0 ? (
        <Dialog>
          <DialogTrigger asChild>
            <Button size="lg" className="mx-auto">
              <Plus className="mr-2 h-4 w-4" />
              Create your first project
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a new project</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="name">Project name</Label>
                <Input
                  id="name"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  placeholder="Enter project name"
                />
              </div>
              <Button onClick={createProject} className="w-full">
                Create Project
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between">
            <h2 className="text-lg font-semibold">Your Projects</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create new project
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create a new project</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Project name</Label>
                    <Input
                      id="name"
                      value={newProjectName}
                      onChange={(e) => setNewProjectName(e.target.value)}
                      placeholder="Enter project name"
                    />
                  </div>
                  <Button onClick={createProject} className="w-full">
                    Create Project
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="grid gap-4">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                name={project.name}
                teamMembers={getTeamMembers(project.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}