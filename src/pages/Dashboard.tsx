
import React from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useSubmissions } from "@/contexts/SubmissionContext";
import { Button } from "@/components/ui/button";
import { Upload, MessageCircle, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { LattePattern } from "@/types";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { submissions } = useSubmissions();
  const navigate = useNavigate();

  const recentSubmissions = [...submissions]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  // Calculate stats
  const totalSubmissions = submissions.length;
  const averageScore = submissions.length > 0
    ? submissions.reduce((sum, sub) => sum + sub.score, 0) / submissions.length
    : 0;
  
  // Count patterns
  const patternCounts = submissions.reduce((acc, sub) => {
    acc[sub.patternType] = (acc[sub.patternType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const mostCommonPattern = Object.entries(patternCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "None";

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user?.name}!</h1>
          <p className="text-muted-foreground mt-1">
            Track your progress and perfect your latte art with professional feedback.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalSubmissions}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{averageScore.toFixed(1)}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Most Common Pattern</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{mostCommonPattern}</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="md:col-span-4">
            <CardHeader>
              <CardTitle>Recent Submissions</CardTitle>
              <CardDescription>
                Your latest latte art uploads
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentSubmissions.length > 0 ? (
                <div className="space-y-4">
                  {recentSubmissions.map((submission) => (
                    <div 
                      key={submission.id}
                      className="flex items-center space-x-4 rounded-md border p-4 cursor-pointer hover:bg-accent/50 transition-colors"
                      onClick={() => navigate(`/chat`)}
                    >
                      <div className="w-12 h-12 rounded-md overflow-hidden bg-muted">
                        <img 
                          src={submission.imageUrl} 
                          alt={submission.patternType}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="font-medium">{submission.patternType}</p>
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          Score: {submission.score}/100
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-muted-foreground">No submissions yet</p>
                  <Button 
                    variant="link" 
                    className="mt-2"
                    onClick={() => navigate("/submissions")}
                  >
                    Upload your first latte art
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Navigate to key features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-left font-normal h-auto py-3"
                  onClick={() => navigate("/submissions")}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  <div className="flex flex-col">
                    <span>Upload New Latte Art</span>
                    <span className="text-xs text-muted-foreground">
                      Get professional feedback on your latest creation
                    </span>
                  </div>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-left font-normal h-auto py-3"
                  onClick={() => navigate("/chat")}
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  <div className="flex flex-col">
                    <span>Get Expert Advice</span>
                    <span className="text-xs text-muted-foreground">
                      Chat with our AI assistant about improving your skills
                    </span>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
