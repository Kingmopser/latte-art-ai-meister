
import React from "react";
import { useSubmissions } from "@/contexts/SubmissionContext";
import { Card, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

const SubmissionList: React.FC = () => {
  const { submissions, setCurrentSubmission } = useSubmissions();
  const navigate = useNavigate();

  // Sort submissions by date (newest first)
  const sortedSubmissions = [...submissions].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const handleSubmissionClick = (submission: any) => {
    setCurrentSubmission(submission);
    navigate("/chat");
  };

  if (submissions.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        No submissions yet. Upload your first latte art!
      </div>
    );
  }

  return (
    <ScrollArea className="h-[70vh]">
      <div className="space-y-4 pr-4">
        {sortedSubmissions.map((submission) => (
          <Card 
            key={submission.id}
            className="cursor-pointer hover:bg-accent/50 transition-colors"
            onClick={() => handleSubmissionClick(submission)}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 shrink-0 rounded-md overflow-hidden border bg-muted">
                  <img
                    src={submission.imageUrl}
                    alt={`Latte art - ${submission.patternType}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{submission.patternType}</Badge>
                    <span className="text-sm font-medium">
                      Score: {submission.score}
                    </span>
                  </div>
                  <p className="text-sm mt-1 text-muted-foreground line-clamp-2">
                    {submission.feedback}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {formatDistanceToNow(new Date(submission.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
};

export default SubmissionList;
