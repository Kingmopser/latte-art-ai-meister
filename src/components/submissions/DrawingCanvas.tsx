
import React, { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Upload, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

interface DrawingCanvasProps {
  onImageGenerate: (imageData: string) => void;
  onReferenceImageUpload: (file: File) => void;
  width?: number;
  height?: number;
}

const DrawingCanvas: React.FC<DrawingCanvasProps> = ({
  onImageGenerate,
  onReferenceImageUpload,
  width = 300,
  height = 300,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Setup canvas when component mounts
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas background to white
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Set drawing style
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.lineWidth = 5;
    ctx.strokeStyle = "#8b4513"; // Coffee brown color
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setIsDrawing(true);
    
    // Get mouse position
    const rect = canvas.getBoundingClientRect();
    let x, y;
    
    if ('touches' in e) {
      // Touch event
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      // Mouse event
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }
    
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Get mouse position
    const rect = canvas.getBoundingClientRect();
    let x, y;
    
    if ('touches' in e) {
      // Prevent scrolling when drawing
      e.preventDefault();
      
      // Touch event
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      // Mouse event
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }
    
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const generateImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      const imageData = canvas.toDataURL("image/png");
      onImageGenerate(imageData);
      toast({
        title: "Drawing captured",
        description: "Your drawing will be used as a reference pattern"
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error generating image",
        description: "Could not capture your drawing"
      });
    }
  };

  const handleReferenceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setReferenceImage(event.target.result as string);
        onReferenceImageUpload(file);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const removeReferenceImage = () => {
    setReferenceImage(null);
  };

  return (
    <Card className="p-4 space-y-4">
      <div className="flex flex-col gap-2">
        <div className="font-medium">Draw Latte Art Pattern</div>
        <div className="text-sm text-muted-foreground">
          Sketch a pattern or upload a reference image
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="border rounded-md overflow-hidden touch-none">
          <canvas 
            ref={canvasRef} 
            width={width} 
            height={height}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            style={{ cursor: "crosshair" }}
          />
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={clearCanvas} className="flex-1">
            Clear
          </Button>
          <Button onClick={generateImage} className="flex-1">
            <Pencil className="mr-2 h-4 w-4" />
            Use as Pattern
          </Button>
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="text-sm font-medium mb-2">Reference Image</div>
        {referenceImage ? (
          <div className="relative">
            <img 
              src={referenceImage} 
              alt="Reference" 
              className="w-full h-60 object-contain border rounded-md" 
            />
            <Button 
              size="sm" 
              variant="destructive" 
              className="absolute top-2 right-2" 
              onClick={removeReferenceImage}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div 
            className="border-2 border-dashed rounded-md p-6 text-center cursor-pointer hover:border-primary/50"
            onClick={handleUploadClick}
          >
            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Click to upload a reference image
            </p>
          </div>
        )}
        <input
          type="file"
          className="hidden"
          ref={fileInputRef}
          onChange={handleReferenceUpload}
          accept="image/*"
        />
      </div>
    </Card>
  );
};

export default DrawingCanvas;
