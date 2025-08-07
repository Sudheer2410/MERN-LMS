import InstructorCourses from "@/components/instructor-view/courses";
import InstructorDashboard from "@/components/instructor-view/dashboard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { AuthContext } from "@/context/auth-context";
import { InstructorContext } from "@/context/instructor-context";
import { fetchInstructorCourseListService } from "@/services";
import { 
  BarChart, 
  Book, 
  LogOut, 
  GraduationCap, 
  User, 
  TrendingUp,
  Menu,
  X
} from "lucide-react";
import { useContext, useEffect, useState } from "react";

function InstructorDashboardpage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { resetCredentials, auth } = useContext(AuthContext);
  const { instructorCoursesList, setInstructorCoursesList } =
    useContext(InstructorContext);

  async function fetchAllCourses() {
    const response = await fetchInstructorCourseListService();
    if (response?.success) setInstructorCoursesList(response?.data);
  }

  useEffect(() => {
    fetchAllCourses();
  }, []);

  const menuItems = [
    {
      icon: BarChart,
      label: "Dashboard",
      value: "dashboard",
      component: <InstructorDashboard listOfCourses={instructorCoursesList} />,
    },
    {
      icon: Book,
      label: "Courses",
      value: "courses",
      component: <InstructorCourses listOfCourses={instructorCoursesList} />,
    },
    {
      icon: LogOut,
      label: "Logout",
      value: "logout",
      component: null,
    },
  ];

  function handleLogout() {
    resetCredentials();
    sessionStorage.clear();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white/80 backdrop-blur-sm border-b border-gray-200/50 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <div className="flex items-center space-x-2">
              <GraduationCap className="h-6 w-6 text-blue-600" />
              <span className="font-bold text-lg">Instructor</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <User className="h-5 w-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">
              {auth?.user?.userName}
            </span>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`
          fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white/90 backdrop-blur-sm border-r border-gray-200/50 
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="p-6">
            {/* Desktop Header */}
            <div className="hidden lg:flex items-center space-x-3 mb-8">
              <GraduationCap className="h-8 w-8 text-blue-600" />
              <div>
                <h2 className="text-xl font-bold text-gray-900">Instructor Dashboard</h2>
                <p className="text-sm text-gray-600">Manage your courses</p>
              </div>
            </div>

            {/* User Info */}
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{auth?.user?.userName}</p>
                  <p className="text-sm text-gray-600">Instructor</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="space-y-2">
              {menuItems.map((menuItem) => (
                <Button
                  className={`w-full justify-start h-12 px-4 rounded-xl transition-all duration-200 ${
                    activeTab === menuItem.value
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                      : 'bg-white/50 hover:bg-white/80 text-gray-700 hover:text-gray-900'
                  }`}
                  key={menuItem.value}
                  variant="ghost"
                  onClick={
                    menuItem.value === "logout"
                      ? handleLogout
                      : () => {
                          setActiveTab(menuItem.value);
                          setSidebarOpen(false);
                        }
                  }
                >
                  <menuItem.icon className="mr-3 h-5 w-5" />
                  {menuItem.label}
                </Button>
              ))}
            </nav>

            {/* Stats Summary */}
            <div className="mt-8 p-4 bg-white/50 rounded-xl border border-gray-200/50">
              <h3 className="font-semibold text-gray-900 mb-3">Quick Stats</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Courses</span>
                  <span className="font-semibold text-gray-900">{instructorCoursesList?.length || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Students</span>
                  <span className="font-semibold text-gray-900">
                    {instructorCoursesList?.reduce((acc, course) => acc + course.students?.length, 0) || 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
              <div className="flex items-center space-x-3 mb-2">
                {(() => {
                  const ActiveIcon = menuItems.find(item => item.value === activeTab)?.icon;
                  return ActiveIcon ? (
                    <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                      <ActiveIcon className="h-5 w-5 text-white" />
                    </div>
                  ) : null;
                })()}
                <h1 className="text-3xl font-bold text-gray-900">
                  {menuItems.find(item => item.value === activeTab)?.label || "Dashboard"}
                </h1>
              </div>
              <p className="text-gray-600">
                {activeTab === "dashboard" && "Monitor your courses and student progress"}
                {activeTab === "courses" && "Manage and create your courses"}
              </p>
            </div>

            {/* Content */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-xl">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="p-6">
                {menuItems.map((menuItem) => (
                  <TabsContent key={menuItem.value} value={menuItem.value} className="mt-0">
                    {menuItem.component !== null ? menuItem.component : null}
                  </TabsContent>
                ))}
              </Tabs>
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

export default InstructorDashboardpage;
