
import { Navbar } from "@/components/Navbar";
import { InviteTeamForm } from "@/components/InviteTeamForm";
import { ProjectGrid } from "@/components/ProjectGrid";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container pt-24">
        <InviteTeamForm />
        <ProjectGrid />
      </main>
    </div>
  );
};

export default Index;
