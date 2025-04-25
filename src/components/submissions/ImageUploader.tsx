
import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useSubmissions } from "@/contexts/SubmissionContext";
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";

const ImageUploader: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadImage, isLoading, currentDrawingUrl, currentReferenceUrl } = useSubmissions();
  const { toast } = useToast();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if the file is an image
    if (!file.type.startsWith("image/")) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please upload an image file.",
      });
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      // Simulate progress
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          const newProgress = prev + 10;
          if (newProgress >= 90) {
            clearInterval(interval);
            return 90;
          }
          return newProgress;
        });
      }, 200);

      const submission = await uploadImage(selectedFile, currentDrawingUrl || undefined, currentReferenceUrl || undefined);
      
      clearInterval(interval);
      setUploadProgress(100);

      const hasComparison = currentDrawingUrl || currentReferenceUrl;
      
      toast({
        title: "Upload successful",
        description: `Your ${submission.patternType} latte art has been analyzed${hasComparison ? " and compared!" : "!"}`
      });

      // Reset form after successful upload
      setTimeout(() => {
        setSelectedFile(null);
        setPreviewUrl(null);
        setUploadProgress(0);
      }, 1000);
      
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Could not upload image",
      });
      setUploadProgress(0);
    }
  };

  return (
    <div className="space-y-4">
      <div 
        className={`
          border-2 border-dashed rounded-lg p-6 text-center transition-all
          ${previewUrl ? "border-primary bg-primary/5" : "border-muted-foreground/20 hover:border-muted-foreground/50"}
          ${isLoading ? "opacity-70 pointer-events-none" : "cursor-pointer"}
        `}
        onClick={() => fileInputRef.current?.click()}
      >
        {previewUrl ? (
          <div className="flex flex-col items-center space-y-4">
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="max-w-full max-h-64 rounded-md object-contain"
            />
            <p className="text-sm text-muted-foreground">Click to change image</p>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-4 py-6">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Upload className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="font-medium">Click to upload your latte art</p>
              <p className="text-sm text-muted-foreground">
                JPG, PNG or GIF (max. 5MB)
              </p>
            </div>
          </div>
        )}
        <input
          type="file"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
        />
      </div>

      {uploadProgress > 0 && (
        <Progress value={uploadProgress} className="h-2" />
      )}

      <div className="flex justify-end">
        <Button 
          onClick={handleUpload} 
          disabled={!selectedFile || isLoading}
        >
          {isLoading ? "Analyzing..." : "Analyze Latte Art"}
        </Button>
      </div>
    </div>
  );
};

export default ImageUploader;
