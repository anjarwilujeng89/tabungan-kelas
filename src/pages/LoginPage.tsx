import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormData } from "@/utils/validationSchemas";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Alert } from "@/components/ui/Alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, error, isLoading, clearError } = useAuth();
  const { success: showSuccess, error: showError } = useToast();
  const [loginError, setLoginError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "admin",
      password: "admin123",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoginError(null);
      clearError();
      await login(data.username, data.password);
      showSuccess("Login successful!");
      navigate("/dashboard");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed";
      setLoginError(message);
      showError(message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-2xl">TK</span>
            </div>
          </div>
          <CardTitle className="text-2xl">Tabungan Kelas</CardTitle>
          <CardDescription>
            Masuk ke aplikasi manajemen tabungan kelas Anda
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {(loginError || error) && (
              <Alert
                variant="destructive"
                title="Login Failed"
                description={loginError || error}
              />
            )}

            <Input
              label="Username"
              placeholder="Masukkan username"
              error={errors.username?.message}
              {...register("username")}
            />

            <Input
              label="Password"
              type="password"
              placeholder="Masukkan password"
              error={errors.password?.message}
              {...register("password")}
            />

            <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 p-3 text-sm text-blue-800 dark:text-blue-300">
              <p className="font-medium mb-1">Demo Credentials:</p>
              <p>
                Username: <code className="font-mono">admin</code>
              </p>
              <p>
                Password: <code className="font-mono">admin123</code>
              </p>
            </div>

            <Button
              type="submit"
              isLoading={isLoading}
              className="w-full"
              size="lg"
            >
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
