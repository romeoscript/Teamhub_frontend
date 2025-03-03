
import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import { ProjectCard } from "./ProjectCard";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export function ProjectGrid() {
  const [projects, setProjects] = useState<{ name: string }[]>([]);
  const [newProjectName, setNewProjectName] = useState("");

  const createProject = () => {
    if (newProjectName.trim()) {
      setProjects([...projects, { name: newProjectName }]);
      setNewProjectName("");
    }
  };

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
            {projects.map((project, i) => (
              <ProjectCard
                key={i}
                name={project.name}
                teamMembers={[
                  {
                    name: "Team Member",
                    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=" + i,
                  },
                ]}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
