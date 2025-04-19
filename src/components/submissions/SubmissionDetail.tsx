
import React from "react";
import { LatteSubmission } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

interface SubmissionDetailProps {
  submission: LatteSubmission;
}

const SubmissionDetail: React.FC<SubmissionDetailProps> = ({ submission }) => {
  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-green-500";
    if (score >= 70) return "text-yellow-500";
    return "text-orange-500";
  };

  return (
    <Card className="w-full overflow-hidden">
      <div className="aspect-video w-full overflow-hidden bg-muted">
        <img
          src={submission.imageUrl}
          alt={`Latte art - ${submission.patternType}`}
          className="h-full w-full object-contain"
        />
      </div>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl flex items-center gap-2">
            <span>{submission.patternType}</span>
            <Badge variant="outline">
              {formatDistanceToNow(new Date(submission.createdAt), { addSuffix: true })}
            </Badge>
          </CardTitle>
          <div className={`text-2xl font-bold ${getScoreColor(submission.score)}`}>
            {submission.score} / 100
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-1">Feedback</h3>
            <p className="text-muted-foreground">{submission.feedback}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubmissionDetail;
