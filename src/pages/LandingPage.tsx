
import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const LandingPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  // If user is already logged in, redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen grid md:grid-cols-2 latte-pattern">
      <div className="hidden md:flex flex-col justify-center p-12 bg-coffee-800 text-cream-100">
        <div>
          <h1 className="text-4xl font-bold mb-4">Latte Art Meister</h1>
          <p className="text-lg mb-6 text-cream-200">
            Perfect your latte art skills with professional AI-powered feedback.
          </p>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-coffee-600 flex items-center justify-center mt-1">
                <span className="text-cream-100 font-bold">1</span>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-1">Upload your latte art</h3>
                <p className="text-cream-300">Take a photo of your latest creation and upload it to our platform.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-coffee-600 flex items-center justify-center mt-1">
                <span className="text-cream-100 font-bold">2</span>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-1">Get expert analysis</h3>
                <p className="text-cream-300">Our AI evaluates your latte art based on professional criteria.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-coffee-600 flex items-center justify-center mt-1">
                <span className="text-cream-100 font-bold">3</span>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-1">Improve your skills</h3>
                <p className="text-cream-300">Receive personalized feedback to perfect your technique.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">Latte Art Meister</CardTitle>
              <CardDescription>
                Elevate your barista skills with AI-powered feedback
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "login" | "register")}>
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="login">Log in</TabsTrigger>
                  <TabsTrigger value="register">Sign up</TabsTrigger>
                </TabsList>
                <TabsContent value="login">
                  <LoginForm onToggle={() => setActiveTab("register")} />
                </TabsContent>
                <TabsContent value="register">
                  <RegisterForm onToggle={() => setActiveTab("login")} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
