import { useState, KeyboardEvent } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Mail, X } from "lucide-react";
import { toast } from "sonner";



export function InviteTeamForm() {
  const [emails, setEmails] = useState<string[]>([]);
  const [currentEmail, setCurrentEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Add email to the list
  const addEmail = () => {
    if (!currentEmail.trim()) return;
    
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(currentEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Check for duplicates
    if (emails.includes(currentEmail)) {
      toast.error("This email is already in the list");
      return;
    }

    setEmails([...emails, currentEmail]);
    setCurrentEmail("");
  };

  // Remove email from the list
  const removeEmail = (email: string) => {
    setEmails(emails.filter(e => e !== email));
  };

  // Handle key press (add email on Enter or comma)
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addEmail();
    } else if (e.key === ",") {
      e.preventDefault();
      addEmail();
    }
  };

  // Handle paste event to add multiple emails at once
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text");
    
    // Split by commas, semicolons, or whitespace
    const pastedEmails = pastedText
      .split(/[,;\s]+/)
      .map(email => email.trim())
      .filter(email => email.length > 0);
    
    if (pastedEmails.length > 0) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const validEmails = pastedEmails.filter(email => emailRegex.test(email));
      const uniqueEmails = validEmails.filter(email => !emails.includes(email));
      
      if (uniqueEmails.length > 0) {
        setEmails([...emails, ...uniqueEmails]);
      }
      
      setCurrentEmail("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Add current email if there is one
    if (currentEmail.trim()) {
      addEmail();
    }
    
    if (emails.length === 0) {
      toast.error("Please enter at least one email address");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Get current user from localStorage
      const userString = localStorage.getItem("user");
      if (!userString) {
        toast.error("User information not found");
        return;
      }
      
      const user = JSON.parse(userString);
      
      const response = await fetch("https://black-kohl.vercel.app/api/auth/send-invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          userId: user.uid,
          recipientEmails: emails,
          customMessage: ""
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to send invitations");
      }

      const successCount = data.successCount || emails.length;
      toast.success(`Successfully sent ${successCount} invitation${successCount !== 1 ? 's' : ''}`);
      
      // Clear emails and input after successful send
      setEmails([]);
      setCurrentEmail("");
      
      // If there were any failures, show them
      if (data.failureCount && data.failureCount > 0) {
        toast.warning(`Failed to send ${data.failureCount} invitation${data.failureCount !== 1 ? 's' : ''}`);
      }
      
    } catch (error) {
      console.error("Invitation error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to send invitations");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="invite-form" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-4">
        <label className="text-sm font-medium">Invite team members</label>
        
        {/* Email chips display */}
        {emails.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {emails.map((email, index) => (
              <div 
                key={index} 
                className="flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm"
              >
                <span>{email}</span>
                <button
                  type="button"
                  onClick={() => removeEmail(email)}
                  className="text-blue-600 hover:text-blue-800"
                  disabled={isLoading}
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
        
        <div className="flex gap-2">
          <Input
            type="email"
            placeholder="Enter email address"
            className="flex-1"
            value={currentEmail}
            onChange={(e) => setCurrentEmail(e.target.value)}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading}>
            <Mail className="mr-2 h-4 w-4" />
            {isLoading ? "Sending..." : "Send Invite"}
          </Button>
        </div>
        
        {emails.length === 0 && (
          <p className="text-xs text-gray-500">
            Press Enter after each email to add multiple recipients
          </p>
        )}
      </div>
    </form>
  );
}