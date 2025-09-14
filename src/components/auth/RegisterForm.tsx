import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterForm as RegisterFormType } from "@shared/schema";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff } from "lucide-react";

interface RegisterFormProps {
  onSuccess?: () => void;
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const { register } = useAuth();
  const { toast } = useToast();

  const form = useForm<RegisterFormType>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      role: "student",
      password: "",
      confirmPassword: "",
      phone: "",
      university: "",
    },
  });

  const onSubmit = async (data: RegisterFormType) => {
    if (!acceptedTerms) {
      toast({
        title: "Terms Required",
        description: "Please accept the terms and conditions to continue.",
        variant: "destructive",
      });
      return;
    }

    try {
      await register(data);
      toast({
        title: "Welcome to VYNESTO!",
        description: "Your account has been created successfully.",
      });
      onSuccess?.();
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" data-testid="form-register">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName" className="block text-sm font-medium text-card-foreground mb-2">
            First Name
          </Label>
          <Input
            id="firstName"
            type="text"
            placeholder="First name"
            {...form.register("firstName")}
            data-testid="input-first-name"
          />
          {form.formState.errors.firstName && (
            <p className="text-sm text-destructive mt-1" data-testid="error-first-name">
              {form.formState.errors.firstName.message}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="lastName" className="block text-sm font-medium text-card-foreground mb-2">
            Last Name
          </Label>
          <Input
            id="lastName"
            type="text"
            placeholder="Last name"
            {...form.register("lastName")}
            data-testid="input-last-name"
          />
          {form.formState.errors.lastName && (
            <p className="text-sm text-destructive mt-1" data-testid="error-last-name">
              {form.formState.errors.lastName.message}
            </p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="email" className="block text-sm font-medium text-card-foreground mb-2">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          {...form.register("email")}
          data-testid="input-email"
        />
        {form.formState.errors.email && (
          <p className="text-sm text-destructive mt-1" data-testid="error-email">
            {form.formState.errors.email.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="role" className="block text-sm font-medium text-card-foreground mb-2">
          I am a
        </Label>
        <Select onValueChange={(value) => form.setValue("role", value as any)} defaultValue="student">
          <SelectTrigger data-testid="select-role">
            <SelectValue placeholder="Select your role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="student">Student</SelectItem>
            <SelectItem value="owner">Property Owner</SelectItem>
          </SelectContent>
        </Select>
        {form.formState.errors.role && (
          <p className="text-sm text-destructive mt-1" data-testid="error-role">
            {form.formState.errors.role.message}
          </p>
        )}
      </div>

      {form.watch("role") === "student" && (
        <div>
          <Label htmlFor="university" className="block text-sm font-medium text-card-foreground mb-2">
            University (Optional)
          </Label>
          <Input
            id="university"
            type="text"
            placeholder="Your university name"
            {...form.register("university")}
            data-testid="input-university"
          />
        </div>
      )}

      <div>
        <Label htmlFor="phone" className="block text-sm font-medium text-card-foreground mb-2">
          Phone Number (Optional)
        </Label>
        <Input
          id="phone"
          type="tel"
          placeholder="Your phone number"
          {...form.register("phone")}
          data-testid="input-phone"
        />
      </div>

      <div>
        <Label htmlFor="password" className="block text-sm font-medium text-card-foreground mb-2">
          Password
        </Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Create a password"
            {...form.register("password")}
            className="pr-10"
            data-testid="input-password"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
            data-testid="button-toggle-password"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
        {form.formState.errors.password && (
          <p className="text-sm text-destructive mt-1" data-testid="error-password">
            {form.formState.errors.password.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="confirmPassword" className="block text-sm font-medium text-card-foreground mb-2">
          Confirm Password
        </Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm your password"
            {...form.register("confirmPassword")}
            className="pr-10"
            data-testid="input-confirm-password"
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            data-testid="button-toggle-confirm-password"
          >
            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
        {form.formState.errors.confirmPassword && (
          <p className="text-sm text-destructive mt-1" data-testid="error-confirm-password">
            {form.formState.errors.confirmPassword.message}
          </p>
        )}
      </div>

      <div className="flex items-start space-x-2">
        <Checkbox
          id="terms"
          checked={acceptedTerms}
          onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
          data-testid="checkbox-terms"
        />
        <Label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed">
          I agree to the{" "}
          <a href="#" className="text-primary hover:text-primary/80 underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-primary hover:text-primary/80 underline">
            Privacy Policy
          </a>
        </Label>
      </div>

      <Button
        type="submit"
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
        disabled={form.formState.isSubmitting}
        data-testid="button-register"
      >
        {form.formState.isSubmitting ? "Creating Account..." : "Create Account"}
      </Button>
    </form>
  );
}
