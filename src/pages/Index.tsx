import { Navbar } from "@/components/Navbar";
import { InviteTeamForm } from "@/components/InviteTeamForm";
import { ProjectGrid } from "@/components/ProjectGrid";
import { TeamMembersList } from "@/components/TeamMembersList";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container pt-16 pb-8">
        <h1 className="text-3xl font-bold mb-6">Team Dashboard</h1>

        <div className="space-y-8">
          <InviteTeamForm />
          <TeamMembersList teamId="current-team-id" />
          <ProjectGrid />
        </div>
      </main>
    </div>
  );
};

export default Index;