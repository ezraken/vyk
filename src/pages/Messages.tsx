import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ChatWindow } from "@/components/messaging/ChatWindow";
import { Loading } from "@/components/ui/Loading";
import { Search, MessageSquare, Plus } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useIsMobile } from "@/hooks/use-mobile";
import { formatRelativeTime, getUserInitials, truncateText } from "@/utils/helpers";
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
  unreadCount?: number;
}

export default function Messages() {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showChatList, setShowChatList] = useState(true);

  const { data: chatsData, isLoading } = useQuery({
    queryKey: ["/api/chats"],
  });

  const chats: Chat[] = chatsData?.chats || [];

  // Filter chats based on search query
  const filteredChats = chats.filter(chat => {
    const otherParticipant = user?.role === "student" ? chat.owner : chat.student;
    const participantName = `${otherParticipant.firstName} ${otherParticipant.lastName}`.toLowerCase();
    const propertyTitle = chat.property.title.toLowerCase();
    const query = searchQuery.toLowerCase();
    
    return participantName.includes(query) || propertyTitle.includes(query);
  });

  const getOtherParticipant = (chat: Chat) => {
    return user?.role === "student" ? chat.owner : chat.student;
  };

  const handleChatSelect = (chatId: string) => {
    setSelectedChatId(chatId);
    if (isMobile) {
      setShowChatList(false);
    }
  };

  const handleBackToList = () => {
    if (isMobile) {
      setShowChatList(true);
      setSelectedChatId(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8" data-testid="messages-page">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2" data-testid="messages-title">
          Messages
        </h1>
        <p className="text-muted-foreground" data-testid="messages-subtitle">
          Stay connected with property owners and students
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        {/* Chat List */}
        <Card className={cn(
          "lg:col-span-1 flex flex-col",
          isMobile && !showChatList && "hidden"
        )} data-testid="chat-list-card">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle>Conversations</CardTitle>
              <Button size="icon" variant="ghost" data-testid="new-chat-button">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
                data-testid="search-conversations"
              />
            </div>
          </CardHeader>

          <CardContent className="flex-1 overflow-y-auto p-0">
            {isLoading ? (
              <div className="p-6">
                <Loading text="Loading conversations..." />
              </div>
            ) : filteredChats.length > 0 ? (
              <div className="space-y-1" data-testid="chat-list">
                {filteredChats.map((chat) => {
                  const otherParticipant = getOtherParticipant(chat);
                  const isSelected = selectedChatId === chat.id;
                  
                  return (
                    <button
                      key={chat.id}
                      onClick={() => handleChatSelect(chat.id)}
                      className={cn(
                        "w-full p-4 text-left hover:bg-muted/50 transition-colors border-b border-border last:border-b-0",
                        isSelected && "bg-primary/5 border-r-2 border-r-primary"
                      )}
                      data-testid={`chat-item-${chat.id}`}
                    >
                      <div className="flex items-start space-x-3">
                        <Avatar className="w-10 h-10 flex-shrink-0">
                          <AvatarImage src={otherParticipant.profileImage} />
                          <AvatarFallback>
                            {getUserInitials(otherParticipant.firstName, otherParticipant.lastName)}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-medium text-foreground truncate" data-testid="participant-name">
                              {otherParticipant.firstName} {otherParticipant.lastName}
                            </h3>
                            {chat.unreadCount && chat.unreadCount > 0 && (
                              <Badge className="bg-primary text-primary-foreground text-xs" data-testid="unread-count">
                                {chat.unreadCount}
                              </Badge>
                            )}
                          </div>
                          
                          <p className="text-sm text-muted-foreground truncate mb-1" data-testid="property-title">
                            {chat.property.title}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-muted-foreground truncate flex-1" data-testid="last-message">
                              {chat.lastMessage ? truncateText(chat.lastMessage, 40) : "No messages yet"}
                            </p>
                            {chat.lastMessageAt && (
                              <span className="text-xs text-muted-foreground ml-2" data-testid="last-message-time">
                                {formatRelativeTime(chat.lastMessageAt)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="p-6 text-center" data-testid="no-conversations">
                <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {searchQuery ? "No conversations found" : "No conversations yet"}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {searchQuery 
                    ? "Try adjusting your search terms"
                    : "Start a conversation by booking a property or contacting an owner"
                  }
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Chat Window */}
        <div className={cn(
          "lg:col-span-2",
          isMobile && showChatList && "hidden"
        )}>
          <ChatWindow 
            chatId={selectedChatId || undefined}
            onBack={isMobile ? handleBackToList : undefined}
            className="h-full"
          />
        </div>
      </div>
    </div>
  );
}
