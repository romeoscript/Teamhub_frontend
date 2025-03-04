import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, UserPlus, Mail, UserX, Crown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const TeamMembersList = ({ teamId }) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  // Fetch team members
  useEffect(() => {
    const fetchTeamMembers = async () => {
      setLoading(true);
      try {
        // In a real app, replace with actual API call
        // const response = await fetch(`/api/teams/${teamId}/members`);
        // const data = await response.json();
        
        // Mock data for demonstration
        const mockData = [
          {
            id: '1',
            username: 'Sarah Johnson',
            email: 'sarah.j@example.com',
            profile_photo: null,
            role: 'admin',
            last_active: '2025-02-28T15:30:00Z',
          },
          {
            id: '2',
            username: 'Alex Chen',
            email: 'alex.c@example.com',
            profile_photo: null,
            role: 'editor',
            last_active: '2025-03-01T09:45:00Z',
          },
          {
            id: '3',
            username: 'Miguel Rodriguez',
            email: 'miguel.r@example.com',
            profile_photo: null,
            role: 'editor',
            last_active: '2025-03-03T11:20:00Z',
          },
          {
            id: '4',
            username: 'Priya Patel',
            email: 'priya.p@example.com',
            profile_photo: null,
            role: 'editor',
            last_active: '2025-02-20T16:15:00Z',
          }
        ];
        
        setMembers(mockData);
        // Set current user (in a real app, this would come from auth context)
        setCurrentUser({
          id: '1',
          role: 'admin'
        });
      } catch (error) {
        console.error('Error fetching team members:', error);
      } finally {
        setLoading(false);
      }
    };

    if (teamId) {
      fetchTeamMembers();
    }
  }, [teamId]);

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const formatLastActive = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    // Convert to milliseconds by using getTime() before subtracting
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const handleRemoveMember = (memberId) => {
    // In a real app, this would make an API call
    console.log(`Removing member with ID: ${memberId}`);
    setMembers(members.filter(member => member.id !== memberId));
  };

  const handlePromoteToAdmin = (memberId) => {
    // In a real app, this would make an API call
    console.log(`Promoting member with ID: ${memberId} to admin`);
    setMembers(members.map(member => 
      member.id === memberId ? {...member, role: 'admin'} : member
    ));
  };

  if (loading) {
    return <div className="text-center py-4">Loading team members...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Team Members</h2>
          <p className="text-sm text-muted-foreground">{members.length} members in this team</p>
        </div>
        {currentUser?.role === 'admin' && (
          <Button size="sm" className="flex items-center gap-1">
            <UserPlus className="h-4 w-4" />
            <span>Invite</span>
          </Button>
        )}
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Member</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Last Active</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <TableRow key={member.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    {member.profile_photo ? (
                      <AvatarImage src={member.profile_photo} alt={member.username} />
                    ) : (
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
                        {getInitials(member.username)}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <div className="font-medium">{member.username}</div>
                    <div className="text-xs text-muted-foreground">{member.email}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                {member.role === 'admin' ? (
                  <Badge variant="outline" className="text-xs flex items-center gap-1 py-0 h-5">
                    <Crown className="h-3 w-3" />
                    Admin
                  </Badge>
                ) : (
                  <span className="text-sm">Editor</span>
                )}
              </TableCell>
              <TableCell>
                <span className="text-sm text-muted-foreground">
                  {formatLastActive(member.last_active)}
                </span>
              </TableCell>
              <TableCell className="text-right">
                {(currentUser?.role === 'admin' && currentUser?.id !== member.id) && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">More options</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        <span>Send Email</span>
                      </DropdownMenuItem>
                      
                      {member.role !== 'admin' && (
                        <DropdownMenuItem 
                          className="flex items-center gap-2"
                          onClick={() => handlePromoteToAdmin(member.id)}
                        >
                          <Crown className="h-4 w-4" />
                          <span>Make Admin</span>
                        </DropdownMenuItem>
                      )}
                      
                      <DropdownMenuSeparator />
                      
                      <DropdownMenuItem 
                        className="flex items-center gap-2 text-destructive"
                        onClick={() => handleRemoveMember(member.id)}
                      >
                        <UserX className="h-4 w-4" />
                        <span>Remove Member</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};