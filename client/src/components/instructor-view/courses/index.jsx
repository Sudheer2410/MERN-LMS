import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  courseCurriculumInitialFormData,
  courseLandingInitialFormData,
} from "@/config";
import { InstructorContext } from "@/context/instructor-context";
import { Delete, Edit, Plus, BookOpen, Users, DollarSign } from "lucide-react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

function InstructorCourses({ listOfCourses }) {
  const navigate = useNavigate();
  const {
    setCurrentEditedCourseId,
    setCourseLandingFormData,
    setCourseCurriculumFormData,
  } = useContext(InstructorContext);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">All Courses</h2>
          <p className="text-gray-600 mt-1">Manage and create your courses</p>
        </div>
        <Button
          onClick={() => {
            setCurrentEditedCourseId(null);
            setCourseLandingFormData(courseLandingInitialFormData);
            setCourseCurriculumFormData(courseCurriculumInitialFormData);
            navigate("/instructor/create-new-course");
          }}
          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <Plus className="mr-2 h-5 w-5" />
          Create New Course
        </Button>
      </div>

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listOfCourses && listOfCourses.length > 0 ? (
          listOfCourses.map((course) => (
            <Card key={course._id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {course?.title}
                    </CardTitle>
                    <p className="text-sm text-gray-600 mt-1">Course</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => {
                        navigate(`/instructor/edit-course/${course?._id}`);
                      }}
                      variant="ghost"
                      size="sm"
                      className="p-2 hover:bg-blue-50 hover:text-blue-600"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="p-2 hover:bg-red-50 hover:text-red-600"
                    >
                      <Delete className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Course Image Placeholder */}
                <div className="w-full h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="h-8 w-8 text-blue-600" />
                </div>
                
                {/* Stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full mx-auto mb-1">
                      <Users className="h-4 w-4 text-blue-600" />
                    </div>
                    <p className="text-lg font-bold text-gray-900">{course?.students?.length}</p>
                    <p className="text-xs text-gray-500">Students</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full mx-auto mb-1">
                      <DollarSign className="h-4 w-4 text-green-600" />
                    </div>
                    <p className="text-lg font-bold text-gray-900">${course?.pricing}</p>
                    <p className="text-xs text-gray-500">Price</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Enrollment Rate</span>
                    <span className="font-medium text-gray-900">
                      {course?.students?.length > 0 ? Math.round((course?.students?.length / 100) * 100) : 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${course?.students?.length > 0 ? Math.min((course?.students?.length / 100) * 100, 100) : 0}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full">
            <Card className="border-0 shadow-lg">
              <CardContent className="py-12">
                <div className="text-center">
                  <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Courses Yet</h3>
                  <p className="text-gray-600 mb-6">Create your first course to get started</p>
                  <Button
                    onClick={() => {
                      setCurrentEditedCourseId(null);
                      setCourseLandingFormData(courseLandingInitialFormData);
                      setCourseCurriculumFormData(courseCurriculumInitialFormData);
                      navigate("/instructor/create-new-course");
                    }}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                  >
                    <Plus className="mr-2 h-5 w-5" />
                    Create Your First Course
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}

InstructorCourses.propTypes = {
  listOfCourses: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      pricing: PropTypes.number.isRequired,
      students: PropTypes.array.isRequired,
    })
  ),
};

InstructorCourses.defaultProps = {
  listOfCourses: [],
};

export default InstructorCourses;
