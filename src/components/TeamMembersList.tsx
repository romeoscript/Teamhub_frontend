import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, UserPlus, Mail, UserX, Crown, Clock, X } from "lucide-react";
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

export const TeamMembersList = ({ teamId = 'current' }) => {
  const [members, setMembers] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  // Get current user from localStorage
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
  }, []);

  // Fetch team members and invitations
  useEffect(() => {
    const fetchTeamData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Authentication token not found');
        }
        
        const response = await fetch(`http://localhost:5001/api/members/${teamId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch team data');
        }
        
        const data = await response.json();
        setMembers(data.members);
        setInvitations(data.invitations || []);
        setTeam(data.team);
      } catch (error) {
        console.error('Error fetching team data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (teamId) {
      fetchTeamData();
    }
  }, [teamId]);

  // Update user's last active status periodically
  useEffect(() => {
    const updateLastActive = async () => {
      try {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));
        
        if (token && user?.uid) {
          await fetch(`/api/teams/members/${user.uid}/last-active`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
        }
      } catch (error) {
        console.error('Error updating last active status:', error);
      }
    };
    
    // Update on component mount
    updateLastActive();
    
    // Set up interval to update every 5 minutes when tab is active
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        updateLastActive();
      }
    }, 5 * 60 * 1000); // 5 minutes
    
    return () => clearInterval(interval);
  }, []);

  const getInitials = (name) => {
    if (!name) return '??';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const formatLastActive = (dateString) => {
    if (!dateString) return 'Never';
    
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

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const handleRemoveMember = async (memberId) => {
    // This would be implemented in a real app
    console.log(`Removing member with ID: ${memberId}`);
    // For now, we'll just update the UI optimistically
    setMembers(members.filter(member => member.id !== memberId));
  };

  const handlePromoteToAdmin = async (memberId) => {
    // This would be implemented in a real app
    console.log(`Promoting member with ID: ${memberId} to admin`);
    // For now, we'll just update the UI optimistically
    setMembers(members.map(member => 
      member.id === memberId ? {...member, role: 'admin', isAdmin: true} : member
    ));
  };

  const handleCancelInvitation = async (invitationId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      const response = await fetch(`/api/teams/invitations/${invitationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to cancel invitation');
      }
      
      // Update UI by removing the canceled invitation
      setInvitations(invitations.filter(invite => invite.id !== invitationId));
      
    } catch (error) {
      console.error('Error canceling invitation:', error);
      // You could set an error state here to display to the user
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading team data...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-destructive">Error: {error}</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Team Members</h2>
          <p className="text-sm text-muted-foreground">
            {members.length} members in {team?.name || 'your team'}
            {invitations.length > 0 && ` • ${invitations.length} pending invitation${invitations.length > 1 ? 's' : ''}`}
          </p>
        </div>
        {currentUser?.role === 'admin' && (
          <Button size="sm" className="flex items-center gap-1">
            <UserPlus className="h-4 w-4" />
            <span>Invite</span>
          </Button>
        )}
      </div>
      
      <Tabs defaultValue="members" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="invitations">
            Pending Invitations
            {invitations.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {invitations.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="members">
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
              {members.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                    No team members found
                  </TableCell>
                </TableRow>
              ) : (
                members.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          {member.profilePhoto ? (
                            <AvatarImage src={member.profilePhoto} alt={member.username} />
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
                      {member.role === 'admin' || member.isAdmin ? (
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
                        {formatLastActive(member.lastActive)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      {(currentUser?.role === 'admin' && currentUser?.uid !== member.id) && (
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
                            
                            {member.role !== 'admin' && !member.isAdmin && (
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
                ))
              )}
            </TableBody>
          </Table>
        </TabsContent>
        
        <TabsContent value="invitations">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Invited</TableHead>
                <TableHead>Invited By</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invitations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                    No pending invitations
                  </TableCell>
                </TableRow>
              ) : (
                invitations.map((invitation) => (
                  <TableRow key={invitation.id}>
                    <TableCell>
                      <div className="font-medium">{invitation.email}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs flex items-center gap-1 py-0 h-5">
                        <Clock className="h-3 w-3" />
                        {invitation.status || 'Pending'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {formatDate(invitation.createdAt)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{invitation.inviterName}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      {currentUser?.role === 'admin' && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => handleCancelInvitation(invitation.id)}
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">Cancel invitation</span>
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </div>
  );
};