import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface PropertyGalleryProps {
  images: string[];
  title: string;
  open: boolean;
  onClose: () => void;
}

export function PropertyGallery({ images, title, open, onClose }: PropertyGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToImage = (index: number) => {
    setCurrentIndex(index);
  };

  if (!images || images.length === 0) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[90vh] p-0" data-testid="gallery-modal">
        <div className="relative w-full h-full">
          {/* Close button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full"
            onClick={onClose}
            data-testid="button-close-gallery"
          >
            <X className="w-6 h-6" />
          </Button>

          {/* Main image */}
          <div className="relative w-full h-[70%] bg-black">
            <img
              src={images[currentIndex]}
              alt={`${title} - Image ${currentIndex + 1}`}
              className="w-full h-full object-contain"
              data-testid={`main-image-${currentIndex}`}
            />

            {/* Navigation arrows */}
            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full"
                  onClick={prevImage}
                  data-testid="button-prev-image"
                >
                  <ChevronLeft className="w-6 h-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full"
                  onClick={nextImage}
                  data-testid="button-next-image"
                >
                  <ChevronRight className="w-6 h-6" />
                </Button>
              </>
            )}

            {/* Image counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm" data-testid="image-counter">
              {currentIndex + 1} / {images.length}
            </div>
          </div>

          {/* Thumbnail strip */}
          {images.length > 1 && (
            <div className="h-[30%] bg-background p-4 overflow-x-auto">
              <div className="flex gap-2 h-full">
                {images.map((image, index) => (
                  <button
                    key={index}
                    className={cn(
                      "relative flex-shrink-0 h-full aspect-video rounded-lg overflow-hidden border-2 transition-colors",
                      index === currentIndex
                        ? "border-primary"
                        : "border-transparent hover:border-muted-foreground"
                    )}
                    onClick={() => goToImage(index)}
                    data-testid={`thumbnail-${index}`}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    {index === currentIndex && (
                      <div className="absolute inset-0 bg-primary/20" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
