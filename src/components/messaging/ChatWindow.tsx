import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Loading } from "@/components/ui/Loading";
import { Send, Phone, Video, MoreHorizontal, ArrowLeft } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { formatDateTime, getUserInitials } from "@/utils/helpers";
import { cn } from "@/lib/utils";

interface Chat {
  id: string;
  property: {
    id: string;
    title: string;
    images: string[];
  };
  student: {
    id: string;
    firstName: string;
    lastName: string;
    profileImage?: string;
  };
  owner: {
    id: string;
    firstName: string;
    lastName: string;
    profileImage?: string;
  };
  lastMessage?: string;
  lastMessageAt?: string;
}

interface Message {
  id: string;
  content: string;
  senderId: string;
  createdAt: string;
  isRead: boolean;
  sender: {
    id: string;
    firstName: string;
    lastName: string;
    profileImage?: string;
  };
}

interface ChatWindowProps {
  chatId?: string;
  onBack?: () => void;
  className?: string;
}

export function ChatWindow({ chatId, onBack, className }: ChatWindowProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: chatData, isLoading: chatLoading } = useQuery({
    queryKey: ["/api/chats", chatId],
    enabled: !!chatId,
  });

  const { data: messagesData, isLoading: messagesLoading } = useQuery({
    queryKey: ["/api/chats", chatId, "messages"],
    enabled: !!chatId,
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      const response = await apiRequest("POST", `/api/chats/${chatId}/messages`, {
        content,
      });
      return response.json();
    },
    onSuccess: () => {
      setNewMessage("");
      queryClient.invalidateQueries({ queryKey: ["/api/chats", chatId, "messages"] });
      queryClient.invalidateQueries({ queryKey: ["/api/chats"] });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to send message",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    },
  });

  const chat: Chat | null = chatData?.chat || null;
  const messages: Message[] = messagesData?.messages || [];

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !chatId) return;
    sendMessageMutation.mutate(newMessage.trim());
  };

  const getOtherParticipant = () => {
    if (!chat || !user) return null;
    return user.role === "student" ? chat.owner : chat.student;
  };

  if (!chatId) {
    return (
      <div className={cn("flex items-center justify-center h-full", className)} data-testid="no-chat-selected">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-foreground mb-2">Select a conversation</h3>
          <p className="text-muted-foreground">Choose a chat from the sidebar to start messaging</p>
        </div>
      </div>
    );
  }

  if (chatLoading || messagesLoading) {
    return (
      <div className={cn("flex items-center justify-center h-full", className)} data-testid="chat-loading">
        <Loading text="Loading conversation..." />
      </div>
    );
  }

  if (!chat) {
    return (
      <div className={cn("flex items-center justify-center h-full", className)} data-testid="chat-not-found">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-foreground mb-2">Chat not found</h3>
          <p className="text-muted-foreground">This conversation may have been deleted or doesn't exist</p>
        </div>
      </div>
    );
  }

  const otherParticipant = getOtherParticipant();

  return (
    <Card className={cn("flex flex-col h-full", className)} data-testid="chat-window">
      {/* Chat Header */}
      <CardHeader className="pb-3 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {onBack && (
              <Button variant="ghost" size="icon" onClick={onBack} data-testid="back-button">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            )}
            
            <Avatar className="w-10 h-10" data-testid="participant-avatar">
              <AvatarImage src={otherParticipant?.profileImage} />
              <AvatarFallback>
                {otherParticipant ? getUserInitials(otherParticipant.firstName, otherParticipant.lastName) : "U"}
              </AvatarFallback>
            </Avatar>
            
            <div>
              <CardTitle className="text-lg" data-testid="participant-name">
                {otherParticipant ? `${otherParticipant.firstName} ${otherParticipant.lastName}` : "Unknown User"}
              </CardTitle>
              <p className="text-sm text-muted-foreground line-clamp-1" data-testid="property-title">
                {chat.property.title}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" data-testid="call-button">
              <Phone className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" data-testid="video-button">
              <Video className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" data-testid="more-options-button">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      {/* Messages */}
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4" data-testid="messages-container">
        {messages.length === 0 ? (
          <div className="text-center py-8" data-testid="no-messages">
            <p className="text-muted-foreground">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex",
                message.senderId === user?.id ? "justify-end" : "justify-start"
              )}
              data-testid={`message-${message.id}`}
            >
              <div
                className={cn(
                  "max-w-[70%] px-4 py-2 rounded-2xl",
                  message.senderId === user?.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                <p className="text-sm" data-testid="message-content">
                  {message.content}
                </p>
                <p 
                  className={cn(
                    "text-xs mt-1",
                    message.senderId === user?.id 
                      ? "text-primary-foreground/70" 
                      : "text-muted-foreground/70"
                  )}
                  data-testid="message-time"
                >
                  {formatDateTime(message.createdAt)}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </CardContent>

      {/* Message Input */}
      <div className="p-4 border-t" data-testid="message-input-container">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1"
            disabled={sendMessageMutation.isPending}
            data-testid="message-input"
          />
          <Button 
            type="submit" 
            size="icon"
            disabled={!newMessage.trim() || sendMessageMutation.isPending}
            data-testid="send-message-button"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </Card>
  );
}
