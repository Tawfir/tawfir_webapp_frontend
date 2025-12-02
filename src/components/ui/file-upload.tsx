import * as React from "react";
import { cn } from "@/lib/utils";
import { Image as ImageIcon, X, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileUploadProps {
  value?: string | File | null;
  onChange?: (file: File | null) => void;
  onRemove?: () => void;
  accept?: string;
  className?: string;
  label?: string;
  previewClassName?: string;
}

export function FileUpload({
  value,
  onChange,
  onRemove,
  accept = "image/*",
  className,
  label,
  previewClassName,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [preview, setPreview] = React.useState<string | null>(
    typeof value === "string" ? value : null
  );

  React.useEffect(() => {
    if (typeof value === "string" && value.trim() !== "" && !value.includes('via.placeholder.com')) {
      // Only set preview if it's a valid non-empty string URL (not a placeholder)
      setPreview(value);
    } else if (value instanceof File) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(value);
    } else {
      setPreview(null);
    }
  }, [value]);

  const handleFileSelect = (file: File | null) => {
    if (file && file.type.startsWith("image/")) {
      onChange?.(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleFileSelect(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    // If onRemove is provided, call it first and check if it prevents removal
    if (onRemove) {
      const result = onRemove();
      // If onRemove returns a promise, wait for it
      // If it returns false, don't remove
      if (result instanceof Promise) {
        const shouldRemove = await result;
        if (shouldRemove === false) {
          return; // Don't remove if callback returns false
        }
      } else if (result === false) {
        return; // Don't remove if callback returns false
      }
    }
    
    // Remove the preview and call onChange
    setPreview(null);
    onChange?.(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <label className="text-sm font-medium text-foreground">{label}</label>
      )}
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50 hover:bg-muted/30",
          preview && "p-0 border-solid"
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleInputChange}
          className="hidden"
        />

        {preview ? (
          <div className="relative group">
            <img
              src={preview}
              alt="Preview"
              className={cn(
                "w-full h-full object-cover rounded-lg",
                previewClassName || "h-48"
              )}
              onError={(e) => {
                // Hide image if it fails to load
                e.currentTarget.style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors rounded-lg flex items-center justify-center">
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleRemove}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4 mr-2" />
                Remove
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex justify-center">
              {isDragging ? (
                <Upload className="h-12 w-12 text-primary" />
              ) : (
                <ImageIcon className="h-12 w-12 text-muted-foreground" />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                {isDragging ? "Drop image here" : "Drag & Drop your files or"}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                <span className="text-primary font-medium cursor-pointer">Browse</span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

