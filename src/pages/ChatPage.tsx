
import React from "react";
import Layout from "@/components/Layout";
import ChatInterface from "@/components/chat/ChatInterface";
import SubmissionDetail from "@/components/submissions/SubmissionDetail";
import { useSubmissions } from "@/contexts/SubmissionContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Upload } from "lucide-react";

const ChatPage: React.FC = () => {
  const { currentSubmission } = useSubmissions();
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Latte Art Assistant</h1>
          <p className="text-muted-foreground mt-1">
            Get expert advice and feedback to improve your skills
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            {currentSubmission ? (
              <SubmissionDetail submission={currentSubmission} />
            ) : (
              <div className="h-[75vh] flex flex-col items-center justify-center border rounded-lg bg-muted/40">
                <div className="text-center p-6">
                  <h3 className="text-lg font-medium mb-2">No latte art selected</h3>
                  <p className="text-muted-foreground mb-6">
                    Upload or select a latte art submission to get feedback
                  </p>
                  <Button 
                    onClick={() => navigate("/submissions")}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Latte Art
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          <div>
            <ChatInterface />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ChatPage;
