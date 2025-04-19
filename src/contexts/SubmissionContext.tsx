
import React, { createContext, useContext, useState, useEffect } from "react";
import { LatteSubmission, LattePattern } from "@/types";
import { useAuth } from "./AuthContext";

interface SubmissionContextType {
  submissions: LatteSubmission[];
  currentSubmission: LatteSubmission | null;
  isLoading: boolean;
  uploadImage: (file: File) => Promise<LatteSubmission>;
  setCurrentSubmission: (submission: LatteSubmission | null) => void;
  getSubmissionById: (id: string) => LatteSubmission | undefined;
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

export const SubmissionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<LatteSubmission[]>([]);
  const [currentSubmission, setCurrentSubmission] = useState<LatteSubmission | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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

  const uploadImage = async (file: File): Promise<LatteSubmission> => {
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
      
      const newSubmission: LatteSubmission = {
        id: `submission-${Date.now()}`,
        userId: user.id,
        imageUrl,
        patternType: pattern,
        score,
        feedback,
        createdAt: new Date()
      };
      
      const updatedSubmissions = [...submissions, newSubmission];
      setSubmissions(updatedSubmissions);
      saveSubmissions(updatedSubmissions);
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
        getSubmissionById
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
