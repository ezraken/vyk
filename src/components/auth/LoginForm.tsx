import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginForm as LoginFormType } from "@shared/schema";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff } from "lucide-react";

interface LoginFormProps {
  onSuccess?: () => void;
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();

  const form = useForm<LoginFormType>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormType) => {
    try {
      await login(data.email, data.password);
      toast({
        title: "Welcome back!",
        description: "You have been successfully logged in.",
      });
      onSuccess?.();
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid email or password.",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" data-testid="form-login">
      <div>
        <Label htmlFor="email" className="block text-sm font-medium text-card-foreground mb-2">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          {...form.register("email")}
          className="w-full"
          data-testid="input-email"
        />
        {form.formState.errors.email && (
          <p className="text-sm text-destructive mt-1" data-testid="error-email">
            {form.formState.errors.email.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="password" className="block text-sm font-medium text-card-foreground mb-2">
          Password
        </Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            {...form.register("password")}
            className="w-full pr-10"
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

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Checkbox id="remember" data-testid="checkbox-remember" />
          <Label htmlFor="remember" className="text-sm text-muted-foreground">
            Remember me
          </Label>
        </div>
        <Button
          type="button"
          variant="link"
          className="p-0 h-auto text-sm text-primary hover:text-primary/80"
          data-testid="button-forgot-password"
        >
          Forgot password?
        </Button>
      </div>

      <Button
        type="submit"
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
        disabled={form.formState.isSubmitting}
        data-testid="button-login"
      >
        {form.formState.isSubmitting ? "Signing in..." : "Sign In"}
      </Button>
    </form>
  );
}
