
import React, { createContext, useContext, useState, useEffect } from "react";
import { LatteSubmission, LattePattern } from "@/types";
import { useAuth } from "./AuthContext";

interface SubmissionContextType {
  submissions: LatteSubmission[];
  currentSubmission: LatteSubmission | null;
  isLoading: boolean;
  uploadImage: (file: File, drawingImageUrl?: string, referenceImageUrl?: string) => Promise<LatteSubmission>;
  setCurrentSubmission: (submission: LatteSubmission | null) => void;
  getSubmissionById: (id: string) => LatteSubmission | undefined;
  setDrawingImage: (drawingUrl: string) => void;
  setReferenceImage: (file: File) => void;
  currentDrawingUrl: string | null;
  currentReferenceUrl: string | null;
}

const SubmissionContext = createContext<SubmissionContextType | undefined>(undefined);

// Mock patterns and feedback for demonstration
const mockPatterns = [LattePattern.HEART, LattePattern.ROSETTA, LattePattern.TULIP, LattePattern.SWAN];
const mockFeedback = [
  "The contrast between the crema and milk could be improved for better definition.",
  "The symmetry is slightly off, consider pouring more slowly at the beginning.",
  "The pattern is well-defined but could be centered better in the cup.",
  "Good milk texture, but the pattern edges are a bit blurry. Try working on your wrist control.",
  "Excellent definition and symmetry! The positioning in the cup is perfect."
];

// Mock comparison feedback
const mockComparisonFeedback = [
  "Your latte art matches the reference pattern quite well. Try to improve symmetry in the pattern.",
  "The proportions are different from your reference. Try to maintain the same width-to-height ratio.",
  "Great attempt! The lines of your pattern are more defined than the reference, which is excellent.",
  "Your pattern has good symmetry compared to the reference, but work on the flow to create smoother curves.",
  "The overall shape is similar, but try working on the fine details at the edges of the pattern."
];

export const SubmissionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<LatteSubmission[]>([]);
  const [currentSubmission, setCurrentSubmission] = useState<LatteSubmission | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentDrawingUrl, setCurrentDrawingUrl] = useState<string | null>(null);
  const [currentReferenceUrl, setCurrentReferenceUrl] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      // Load submissions from localStorage
      const savedSubmissions = localStorage.getItem(`latteSubmissions-${user.id}`);
      if (savedSubmissions) {
        setSubmissions(JSON.parse(savedSubmissions));
      }
    } else {
      setSubmissions([]);
      setCurrentSubmission(null);
    }
  }, [user]);

  const saveSubmissions = (newSubmissions: LatteSubmission[]) => {
    if (user) {
      localStorage.setItem(`latteSubmissions-${user.id}`, JSON.stringify(newSubmissions));
    }
  };

  const setDrawingImage = (drawingUrl: string) => {
    setCurrentDrawingUrl(drawingUrl);
  };

  const setReferenceImage = (file: File) => {
    const imageUrl = URL.createObjectURL(file);
    setCurrentReferenceUrl(imageUrl);
  };

  const uploadImage = async (file: File, drawingImageUrl?: string, referenceImageUrl?: string): Promise<LatteSubmission> => {
    if (!user) throw new Error("User must be logged in to upload");
    
    setIsLoading(true);
    try {
      // Simulate image processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create object URL for displaying the image
      const imageUrl = URL.createObjectURL(file);
      
      // Simulate AI analysis
      const pattern = mockPatterns[Math.floor(Math.random() * mockPatterns.length)];
      const score = Math.floor(Math.random() * 41) + 60; // Score between 60-100
      const feedback = mockFeedback[Math.floor(Math.random() * mockFeedback.length)];
      
      // Add comparison feedback if reference exists
      let comparisonFeedback;
      if (drawingImageUrl || referenceImageUrl) {
        comparisonFeedback = mockComparisonFeedback[Math.floor(Math.random() * mockComparisonFeedback.length)];
      }
      
      const newSubmission: LatteSubmission = {
        id: `submission-${Date.now()}`,
        userId: user.id,
        imageUrl,
        patternType: pattern,
        score,
        feedback,
        createdAt: new Date(),
        drawingImageUrl,
        referenceImageUrl,
        comparisonFeedback
      };
      
      const updatedSubmissions = [...submissions, newSubmission];
      setSubmissions(updatedSubmissions);
      saveSubmissions(updatedSubmissions);

      // Reset the current drawing and reference
      setCurrentDrawingUrl(null);
      setCurrentReferenceUrl(null);
      
      return newSubmission;
    } finally {
      setIsLoading(false);
    }
  };

  const getSubmissionById = (id: string) => {
    return submissions.find(sub => sub.id === id);
  };

  return (
    <SubmissionContext.Provider 
      value={{ 
        submissions, 
        currentSubmission, 
        isLoading, 
        uploadImage, 
        setCurrentSubmission,
        getSubmissionById,
        setDrawingImage,
        setReferenceImage,
        currentDrawingUrl,
        currentReferenceUrl
      }}
    >
      {children}
    </SubmissionContext.Provider>
  );
};

export const useSubmissions = () => {
  const context = useContext(SubmissionContext);
  if (context === undefined) {
    throw new Error("useSubmissions must be used within a SubmissionProvider");
  }
  return context;
};
