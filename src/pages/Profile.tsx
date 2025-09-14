import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { getUserInitials, getUserRoleLabel } from "@/utils/helpers";
import { User, Settings, Shield, Bell } from "lucide-react";

const updateProfileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  university: z.string().optional(),
});

type UpdateProfileData = z.infer<typeof updateProfileSchema>;

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ChangePasswordData = z.infer<typeof changePasswordSchema>;

export default function Profile() {
  const { user, refetchUser } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("profile");

  const profileForm = useForm<UpdateProfileData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phone: user?.phone || "",
      university: user?.university || "",
    },
  });

  const passwordForm = useForm<ChangePasswordData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: UpdateProfileData) => {
      const response = await apiRequest("PUT", `/api/users/${user?.id}`, data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
      refetchUser();
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: async (data: ChangePasswordData) => {
      const response = await apiRequest("POST", "/api/auth/change-password", {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Password Changed",
        description: "Your password has been updated successfully.",
      });
      passwordForm.reset();
    },
    onError: (error: any) => {
      toast({
        title: "Password Change Failed",
        description: error.message || "Failed to change password",
        variant: "destructive",
      });
    },
  });

  const onUpdateProfile = (data: UpdateProfileData) => {
    updateProfileMutation.mutate(data);
  };

  const onChangePassword = (data: ChangePasswordData) => {
    changePasswordMutation.mutate(data);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8" data-testid="profile-page">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2" data-testid="profile-title">
          Profile Settings
        </h1>
        <p className="text-muted-foreground" data-testid="profile-subtitle">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Profile Overview */}
      <Card className="mb-8" data-testid="profile-overview">
        <CardContent className="p-6">
          <div className="flex items-center space-x-6">
            <Avatar className="w-20 h-20" data-testid="profile-avatar">
              <AvatarImage src={user.profileImage} alt={`${user.firstName} ${user.lastName}`} />
              <AvatarFallback className="text-2xl">
                {getUserInitials(user.firstName, user.lastName)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <h2 className="text-2xl font-semibold text-foreground" data-testid="profile-name">
                {user.firstName} {user.lastName}
              </h2>
              <p className="text-muted-foreground" data-testid="profile-email">
                {user.email}
              </p>
              <div className="flex items-center space-x-3 mt-2">
                <Badge variant="secondary" data-testid="profile-role">
                  {getUserRoleLabel(user.role)}
                </Badge>
                <Badge 
                  className={user.isVerified ? "bg-chart-3/10 text-chart-3" : "bg-accent/10 text-accent"}
                  data-testid="profile-verification"
                >
                  {user.isVerified ? "Verified" : "Unverified"}
                </Badge>
              </div>
            </div>
            
            <Button variant="outline" data-testid="change-avatar">
              Change Photo
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Settings Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile" className="flex items-center space-x-2" data-testid="tab-profile">
            <User className="w-4 h-4" />
            <span>Profile</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center space-x-2" data-testid="tab-security">
            <Shield className="w-4 h-4" />
            <span>Security</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center space-x-2" data-testid="tab-notifications">
            <Bell className="w-4 h-4" />
            <span>Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center space-x-2" data-testid="tab-preferences">
            <Settings className="w-4 h-4" />
            <span>Preferences</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card data-testid="profile-form-card">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={profileForm.handleSubmit(onUpdateProfile)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="firstName" className="text-sm font-medium">
                      First Name *
                    </Label>
                    <Input
                      id="firstName"
                      {...profileForm.register("firstName")}
                      data-testid="input-first-name"
                    />
                    {profileForm.formState.errors.firstName && (
                      <p className="text-sm text-destructive mt-1" data-testid="error-first-name">
                        {profileForm.formState.errors.firstName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="lastName" className="text-sm font-medium">
                      Last Name *
                    </Label>
                    <Input
                      id="lastName"
                      {...profileForm.register("lastName")}
                      data-testid="input-last-name"
                    />
                    {profileForm.formState.errors.lastName && (
                      <p className="text-sm text-destructive mt-1" data-testid="error-last-name">
                        {profileForm.formState.errors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    {...profileForm.register("email")}
                    data-testid="input-email"
                  />
                  {profileForm.formState.errors.email && (
                    <p className="text-sm text-destructive mt-1" data-testid="error-email">
                      {profileForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="phone" className="text-sm font-medium">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    {...profileForm.register("phone")}
                    data-testid="input-phone"
                  />
                </div>

                {user.role === "student" && (
                  <div>
                    <Label htmlFor="university" className="text-sm font-medium">
                      University
                    </Label>
                    <Input
                      id="university"
                      {...profileForm.register("university")}
                      data-testid="input-university"
                    />
                  </div>
                )}

                <Separator />

                <Button
                  type="submit"
                  disabled={updateProfileMutation.isPending}
                  data-testid="save-profile"
                >
                  {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card data-testid="security-card">
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Change Password Form */}
              <form onSubmit={passwordForm.handleSubmit(onChangePassword)} className="space-y-4">
                <h3 className="text-lg font-semibold">Change Password</h3>
                
                <div>
                  <Label htmlFor="currentPassword" className="text-sm font-medium">
                    Current Password *
                  </Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    {...passwordForm.register("currentPassword")}
                    data-testid="input-current-password"
                  />
                  {passwordForm.formState.errors.currentPassword && (
                    <p className="text-sm text-destructive mt-1" data-testid="error-current-password">
                      {passwordForm.formState.errors.currentPassword.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="newPassword" className="text-sm font-medium">
                    New Password *
                  </Label>
                  <Input
                    id="newPassword"
                    type="password"
                    {...passwordForm.register("newPassword")}
                    data-testid="input-new-password"
                  />
                  {passwordForm.formState.errors.newPassword && (
                    <p className="text-sm text-destructive mt-1" data-testid="error-new-password">
                      {passwordForm.formState.errors.newPassword.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="confirmPassword" className="text-sm font-medium">
                    Confirm New Password *
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    {...passwordForm.register("confirmPassword")}
                    data-testid="input-confirm-password"
                  />
                  {passwordForm.formState.errors.confirmPassword && (
                    <p className="text-sm text-destructive mt-1" data-testid="error-confirm-password">
                      {passwordForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  variant="outline"
                  disabled={changePasswordMutation.isPending}
                  data-testid="change-password"
                >
                  {changePasswordMutation.isPending ? "Changing..." : "Change Password"}
                </Button>
              </form>

              <Separator />

              {/* Two-Factor Authentication */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Two-Factor Authentication</h3>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">
                    Two-factor authentication adds an extra layer of security to your account.
                  </p>
                  <Button variant="outline" className="mt-3" data-testid="setup-2fa" disabled>
                    Set up 2FA (Coming Soon)
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Account Verification */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Account Verification</h3>
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">Email Verification</p>
                    <p className="text-sm text-muted-foreground">
                      {user.isVerified ? "Your email is verified" : "Verify your email address"}
                    </p>
                  </div>
                  <Badge 
                    className={user.isVerified ? "bg-chart-3/10 text-chart-3" : "bg-accent/10 text-accent"}
                    data-testid="verification-status"
                  >
                    {user.isVerified ? "Verified" : "Pending"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card data-testid="notifications-card">
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <p className="text-muted-foreground">
                  Notification settings will be available in a future update.
                </p>
                <div className="bg-muted/50 rounded-lg p-8 text-center">
                  <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">Coming Soon</h3>
                  <p className="text-muted-foreground">
                    Customize your email and push notification preferences
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences">
          <Card data-testid="preferences-card">
            <CardHeader>
              <CardTitle>Account Preferences</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <p className="text-muted-foreground">
                  Account preferences and settings will be available in a future update.
                </p>
                <div className="bg-muted/50 rounded-lg p-8 text-center">
                  <Settings className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">Coming Soon</h3>
                  <p className="text-muted-foreground">
                    Manage your language, currency, and other preferences
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
