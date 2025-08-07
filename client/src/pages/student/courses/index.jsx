import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { filterOptions, sortOptions } from "@/config";
import { AuthContext } from "@/context/auth-context";
import { StudentContext } from "@/context/student-context";
import {
  checkCoursePurchaseInfoService,
  fetchStudentViewCourseListService,
} from "@/services";
import { 
  ArrowUpDownIcon, 
  Filter, 
  Search, 
  BookOpen, 
  Users, 
  Clock, 
  Star,
  GraduationCap,
  X,
  SlidersHorizontal
} from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function createSearchParamsHelper(filterParams) {
  const queryParams = [];

  for (const [key, value] of Object.entries(filterParams)) {
    if (Array.isArray(value) && value.length > 0) {
      const paramValue = value.join(",");

      queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
    }
  }

  return queryParams.join("&");
}

function StudentViewCoursesPage() {
  const [sort, setSort] = useState("price-lowtohigh");
  const [filters, setFilters] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const {
    studentViewCoursesList,
    setStudentViewCoursesList,
    loadingState,
    setLoadingState,
  } = useContext(StudentContext);
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);

  function handleFilterOnChange(getSectionId, getCurrentOption) {
    let cpyFilters = { ...filters };
    const indexOfCurrentSeection =
      Object.keys(cpyFilters).indexOf(getSectionId);

    if (indexOfCurrentSeection === -1) {
      cpyFilters = {
        ...cpyFilters,
        [getSectionId]: [getCurrentOption.id],
      };
    } else {
      const indexOfCurrentOption = cpyFilters[getSectionId].indexOf(
        getCurrentOption.id
      );

      if (indexOfCurrentOption === -1)
        cpyFilters[getSectionId].push(getCurrentOption.id);
      else cpyFilters[getSectionId].splice(indexOfCurrentOption, 1);
    }

    setFilters(cpyFilters);
    sessionStorage.setItem("filters", JSON.stringify(cpyFilters));
  }

  async function fetchAllStudentViewCourses(filters, sort) {
    try {
      const query = new URLSearchParams({
        ...filters,
        sortBy: sort,
      });
      
      const response = await fetchStudentViewCourseListService(query);
      
      if (response?.success) {
        setStudentViewCoursesList(response?.data);
        setLoadingState(false);
      } else {
        setStudentViewCoursesList([]);
        setLoadingState(false);
      }
    } catch (error) {
      setStudentViewCoursesList([]);
      setLoadingState(false);
    }
  }

  async function handleCourseNavigate(getCurrentCourseId) {
    const response = await checkCoursePurchaseInfoService(
      getCurrentCourseId,
      auth?.user?._id
    );

    if (response?.success) {
      if (response?.data) {
        navigate(`/course-progress/${getCurrentCourseId}`);
      } else {
        navigate(`/course/details/${getCurrentCourseId}`);
      }
    }
  }

  const filteredCourses = studentViewCoursesList?.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.instructorName.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const activeFiltersCount = Object.values(filters).flat().length;

  useEffect(() => {
    const buildQueryStringForFilters = createSearchParamsHelper(filters);
    sessionStorage.setItem("queryString", buildQueryStringForFilters);
  }, [filters]);

  useEffect(() => {
    setSort("price-lowtohigh");
    setFilters(JSON.parse(sessionStorage.getItem("filters")) || {});
  }, []);

  useEffect(() => {
    if (filters !== null && sort !== null)
      fetchAllStudentViewCourses(filters, sort);
  }, [filters, sort]);

  useEffect(() => {
    return () => {
      sessionStorage.removeItem("filters");
      sessionStorage.removeItem("queryString");
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white/80 backdrop-blur-sm border-b border-gray-200/50 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <GraduationCap className="h-6 w-6 text-blue-600" />
            <span className="font-bold text-lg">Courses</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <SlidersHorizontal className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`
          fixed lg:static inset-y-0 left-0 z-50 w-80 bg-white/90 backdrop-blur-sm border-r border-gray-200/50 
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="p-6">
            {/* Desktop Header */}
            <div className="hidden lg:block mb-6">
              <h2 className="text-xl font-bold text-gray-900">Course Filters</h2>
              <p className="text-sm text-gray-600">Find your perfect course</p>
            </div>

            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="space-y-6">
            {Object.keys(filterOptions).map((keyItem) => (
                <div key={keyItem} className="space-y-3">
                  <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">
                    {keyItem}
                  </h3>
                  <div className="space-y-2">
                  {filterOptions[keyItem].map((option) => (
                    <Label 
                      key={option.id} 
                        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <Checkbox
                        checked={
                          filters &&
                          Object.keys(filters).length > 0 &&
                          filters[keyItem] &&
                          filters[keyItem].indexOf(option.id) > -1
                        }
                        onCheckedChange={() =>
                          handleFilterOnChange(keyItem, option)
                        }
                      />
                        <span className="text-sm text-gray-700">{option.label}</span>
                    </Label>
                  ))}
                </div>
              </div>
            ))}
            </div>

            {/* Active Filters */}
            {activeFiltersCount > 0 && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Active Filters</h4>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(filters).map(([key, values]) =>
                    values.map((value) => (
                      <span
                        key={`${key}-${value}`}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {value}
                      </span>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">All Courses</h1>
              </div>
              <p className="text-gray-600">Discover courses that match your interests</p>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                      className="flex items-center space-x-2"
                >
                  <ArrowUpDownIcon className="h-4 w-4" />
                      <span>Sort By</span>
                </Button>
              </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-[200px]">
                <DropdownMenuRadioGroup
                  value={sort}
                  onValueChange={(value) => setSort(value)}
                >
                  {sortOptions.map((sortItem) => (
                    <DropdownMenuRadioItem
                      value={sortItem.id}
                      key={sortItem.id}
                    >
                      {sortItem.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
                <span className="text-sm text-gray-600">
                  {filteredCourses.length} courses found
            </span>
          </div>
            </div>

            {/* Course Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loadingState ? (
                // Loading skeletons
                Array.from({ length: 6 }).map((_, index) => (
                  <Card key={index} className="border-0 shadow-lg">
                    <CardContent className="p-6">
                      <Skeleton className="w-full h-48 mb-4" />
                      <Skeleton className="w-3/4 h-6 mb-2" />
                      <Skeleton className="w-1/2 h-4 mb-4" />
                      <Skeleton className="w-1/4 h-6" />
                    </CardContent>
                  </Card>
                ))
              ) : filteredCourses.length > 0 ? (
                filteredCourses.map((courseItem) => (
                <Card
                    key={courseItem?._id}
                  onClick={() => handleCourseNavigate(courseItem?._id)}
                    className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
                  >
                    <CardContent className="p-0">
                      {/* Course Image */}
                      <div className="relative h-48 overflow-hidden rounded-t-lg">
                        {courseItem?.image ? (
                      <img
                        src={courseItem?.image}
                        alt={courseItem?.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div 
                          className={`w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl ${courseItem?.image ? 'hidden' : 'flex'}`}
                          style={{ display: courseItem?.image ? 'none' : 'flex' }}
                        >
                          {courseItem?.title?.charAt(0) || 'C'}
                        </div>
                        <div className="absolute top-3 right-3">
                          <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-semibold text-gray-900">
                            ${courseItem?.pricing}
                          </div>
                        </div>
                    </div>

                      {/* Course Info */}
                      <div className="p-6">
                        <CardTitle className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {courseItem?.title}
                      </CardTitle>
                        
                        <p className="text-sm text-gray-600 mb-3">
                          By <span className="font-semibold text-gray-900">{courseItem?.instructorName}</span>
                        </p>

                        {/* Course Stats */}
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                          <div className="flex items-center space-x-1">
                            <BookOpen className="h-4 w-4" />
                            <span>{courseItem?.curriculum?.length} lectures</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="h-4 w-4" />
                            <span>{courseItem?.students?.length || 0} students</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{courseItem?.level}</span>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-gray-900">
                        ${courseItem?.pricing}
                          </span>
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                          >
                            View Course
                          </Button>
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
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Courses Found</h3>
                        <p className="text-gray-600">Try adjusting your filters or search terms</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

export default StudentViewCoursesPage;
