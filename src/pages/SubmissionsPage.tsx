
import React from "react";
import Layout from "@/components/Layout";
import ImageUploader from "@/components/submissions/ImageUploader";
import SubmissionList from "@/components/submissions/SubmissionList";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SubmissionsPage: React.FC = () => {
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Latte Art Submissions</h1>
          <p className="text-muted-foreground mt-1">
            Upload your latte art and get professional AI feedback
          </p>
        </div>

        <Tabs defaultValue="upload">
          <TabsList>
            <TabsTrigger value="upload">Upload New</TabsTrigger>
            <TabsTrigger value="history">Submission History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Upload Latte Art</CardTitle>
                <CardDescription>
                  Take a photo of your latte art from directly above for best results
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ImageUploader />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="history" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Submission History</CardTitle>
                <CardDescription>
                  Review your past submissions and scores
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SubmissionList />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default SubmissionsPage;
