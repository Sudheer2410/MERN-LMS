import MediaProgressbar from "@/components/media-progress-bar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InstructorContext } from "@/context/instructor-context";
import { mediaUploadService } from "@/services";
import { useContext } from "react";

function CourseSettings() {
  const {
    courseLandingFormData,
    setCourseLandingFormData,
    mediaUploadProgress,
    setMediaUploadProgress,
    mediaUploadProgressPercentage,
    setMediaUploadProgressPercentage,
  } = useContext(InstructorContext);

  async function handleImageUploadChange(event) {
    const selectedImage = event.target.files[0];

    if (selectedImage) {
      const imageFormData = new FormData();
      imageFormData.append("file", selectedImage);

      try {
        setMediaUploadProgress(true);
        const response = await mediaUploadService(
          imageFormData,
          setMediaUploadProgressPercentage
        );
        if (response.success) {
          setCourseLandingFormData({
            ...courseLandingFormData,
            image: response.data.url,
          });
          setMediaUploadProgress(false);
        }
      } catch (e) {
        setMediaUploadProgress(false);
        
        const errorMessage = e.response?.data?.message || "Failed to upload image. Please try again.";
        alert(`Upload Error: ${errorMessage}`);
      }
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Settings</CardTitle>
      </CardHeader>
      <div className="p-4">
        {mediaUploadProgress ? (
          <MediaProgressbar
            isMediaUploading={mediaUploadProgress}
            progress={mediaUploadProgressPercentage}
          />
        ) : null}
      </div>
      <CardContent>
        {courseLandingFormData?.image ? (
          <img src={courseLandingFormData.image} />
        ) : (
          <div className="flex flex-col gap-3">
            <Label>Upload Course Image</Label>
            <Input
              onChange={handleImageUploadChange}
              type="file"
              accept="image/*"
            />
            <div className="mt-2 p-2 bg-blue-50 rounded">
              <p className="text-xs text-blue-600 mb-2">💡 Having trouble uploading? Try:</p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setCourseLandingFormData({
                    ...courseLandingFormData,
                    image: "https://via.placeholder.com/400x200/3B82F6/FFFFFF?text=Course+Thumbnail"
                  });
                }}
                className="text-xs"
              >
                Use Placeholder Image
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default CourseSettings;
