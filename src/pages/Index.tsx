import { Navbar } from "@/components/Navbar";
import { InviteTeamForm } from "@/components/InviteTeamForm";
import { ProjectGrid } from "@/components/ProjectGrid";
import { TeamMembersList } from "@/components/TeamMembersList";
import { useAuth } from "@/context/AuthContext";

const Index = () => {
  const { currentUser, isAdmin } = useAuth();

  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container pt-16 pb-8">
        <h1 className="text-3xl font-bold mb-6">Team Dashboard</h1>

        <div className="space-y-8">
          {isAdmin && <InviteTeamForm  />}
          <TeamMembersList teamId={currentUser?.teamId || 'current'} />
          <ProjectGrid />
        </div>
      </main>
    </div>
  );
};

export default Index;