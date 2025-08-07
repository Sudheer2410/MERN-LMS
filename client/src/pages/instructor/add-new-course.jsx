import CourseCurriculum from "@/components/instructor-view/courses/add-new-course/course-curriculum";
import CourseLanding from "@/components/instructor-view/courses/add-new-course/course-landing";
import CourseSettings from "@/components/instructor-view/courses/add-new-course/course-settings";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  courseLandingPageFormControls,
  courseCurriculumInitialFormData,
  courseLandingInitialFormData,
} from "@/config";
import { AuthContext } from "@/context/auth-context";
import { InstructorContext } from "@/context/instructor-context";
import {
  addNewCourseService,
  fetchInstructorCourseDetailsService,
  updateCourseByIdService,
} from "@/services";
import { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

function AddNewCoursePage() {
  const {
    courseLandingFormData,
    courseCurriculumFormData,
    setCourseLandingFormData,
    setCourseCurriculumFormData,
    currentEditedCourseId,
    setCurrentEditedCourseId,
  } = useContext(InstructorContext);

  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const params = useParams();



  function isEmpty(value) {
    if (Array.isArray(value)) {
      return value.length === 0;
    }

    return value === "" || value === null || value === undefined;
  }

  function validateFormData() {
    // Check required course landing page fields (excluding image which is in settings)
    const requiredLandingFields = [
      'title', 'category', 'level', 'primaryLanguage', 
      'subtitle', 'description', 'pricing', 'objectives', 'welcomeMessage'
    ];
    
    // Also check if primaryLanguage is not just the label text
    if (courseLandingFormData.primaryLanguage === 'Primary Language') {
      return false;
    }
    
    for (const field of requiredLandingFields) {
      if (isEmpty(courseLandingFormData[field])) {
        return false;
      }
    }

    // Check if at least one curriculum item exists
    if (courseCurriculumFormData.length === 0) {
      return false;
    }

    let hasFreePreview = false;

    for (const item of courseCurriculumFormData) {
      if (
        isEmpty(item.title) ||
        isEmpty(item.videoUrl)
      ) {
        return false;
      }

      if (item.freePreview) {
        hasFreePreview = true; //found at least one free preview
      }
    }

    if (!hasFreePreview) {
      return false;
    }

    return true;
  }

  async function handleCreateCourse() {
    // Process curriculum to handle YouTube URLs properly
    const processedCurriculum = courseCurriculumFormData.map(item => ({
      ...item,
      // For YouTube URLs, we don't need public_id
      public_id: item.public_id || (item.videoUrl.includes('youtube') ? 'youtube' : '')
    }));

    const courseFinalFormData = {
      instructorId: auth?.user?._id,
      instructorName: auth?.user?.userName,
      date: new Date(),
      ...courseLandingFormData,
      students: [],
      curriculum: processedCurriculum,
      isPublised: true,
    };

    const response =
      currentEditedCourseId !== null
        ? await updateCourseByIdService(
            currentEditedCourseId,
            courseFinalFormData
          )
        : await addNewCourseService(courseFinalFormData);

    if (response?.success) {
      setCourseLandingFormData(courseLandingInitialFormData);
      setCourseCurriculumFormData(courseCurriculumInitialFormData);
      navigate(-1);
      setCurrentEditedCourseId(null);
    }


  }

  async function fetchCurrentCourseDetails() {
    const response = await fetchInstructorCourseDetailsService(
      currentEditedCourseId
    );

    if (response?.success) {
      const setCourseFormData = Object.keys(
        courseLandingInitialFormData
      ).reduce((acc, key) => {
        acc[key] = response?.data[key] || courseLandingInitialFormData[key];

        return acc;
      }, {});

      setCourseLandingFormData(setCourseFormData);
      setCourseCurriculumFormData(response?.data?.curriculum);
    }
  }

  useEffect(() => {
    if (currentEditedCourseId !== null) fetchCurrentCourseDetails();
  }, [currentEditedCourseId]);

  useEffect(() => {
    if (params?.courseId) setCurrentEditedCourseId(params?.courseId);
  }, [params?.courseId]);



  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-extrabold mb-5">Create a new course</h1>
        <div className="flex items-center gap-4">
          {!validateFormData() && (
            <div className="text-sm text-orange-600 bg-orange-100 px-3 py-1 rounded">
              ⚠️ Complete all required fields to enable submission
            </div>
          )}
          <Button
            disabled={!validateFormData()}
            className="text-sm tracking-wider font-bold px-8"
            onClick={handleCreateCourse}
          >
            {currentEditedCourseId ? "UPDATE COURSE" : "PUBLISH COURSE"}
          </Button>
        </div>

      </div>
      <Card>
        <CardContent>
          <div className="container mx-auto p-4">
            <Tabs defaultValue="curriculum" className="space-y-4">
              <TabsList>
                <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                <TabsTrigger value="course-landing-page">
                  Course Landing Page
                </TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              <TabsContent value="curriculum">
                <CourseCurriculum />
              </TabsContent>
              <TabsContent value="course-landing-page">
                <CourseLanding />
              </TabsContent>
              <TabsContent value="settings">
                <CourseSettings />
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default AddNewCoursePage;
