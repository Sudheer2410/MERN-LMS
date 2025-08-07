import CommonForm from "@/components/common-form/CommonForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { signInFormControls, signUpFormControls } from "@/config";
import { AuthContext } from "@/context/auth-context";
import { GraduationCap, BookOpen, Users, Award, Sparkles } from "lucide-react";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";

function AuthPage() {
  const [activeTab, setActiveTab] = useState("signin");
  const {
    signInFormData,
    setSignInFormData,
    signUpFormData,
    setSignUpFormData,
    handleRegisterUser,
    handleLoginUser,
    authError,
    setAuthError,
  } = useContext(AuthContext);

  function handleTabChange(value) {
    setActiveTab(value);
    setAuthError(""); // Clear error when switching tabs
  }

  function checkIfSignInFormIsValid() {
    return (
      signInFormData &&
      signInFormData.userEmail !== "" &&
      signInFormData.password !== ""
    );
  }

  function checkIfSignUpFormIsValid() {
    return (
      signUpFormData &&
      signUpFormData.userName !== "" &&
      signUpFormData.userEmail !== "" &&
      signUpFormData.password !== "" &&
      signUpFormData.role !== ""
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="px-6 py-4 bg-white/80 backdrop-blur-sm border-b border-gray-200/50">
        <Link to={"/"} className="flex items-center justify-center group">
          <div className="relative">
            <GraduationCap className="h-8 w-8 mr-3 text-blue-600 group-hover:scale-110 transition-transform duration-200" />
            <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-yellow-500 animate-pulse" />
          </div>
          <span className="font-extrabold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            LMS LEARN
          </span>
        </Link>
      </header>

      {/* Main Content */}
      <div className="flex min-h-[calc(100vh-80px)]">
        {/* Left Side - Hero Section */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 p-8 items-center justify-center">
          <div className="text-center text-white space-y-6 max-w-md">
            <div className="space-y-4">
              <div className="flex justify-center space-x-4">
                <BookOpen className="h-12 w-12 text-blue-200" />
                <Users className="h-12 w-12 text-purple-200" />
                <Award className="h-12 w-12 text-indigo-200" />
              </div>
              <h1 className="text-4xl font-bold leading-tight">
                Welcome to Your Learning Journey
              </h1>
              <p className="text-lg text-blue-100 leading-relaxed">
                Join thousands of learners and instructors. Create, learn, and grow together in our comprehensive learning management system.
              </p>
            </div>
            
            {/* <div className="grid grid-cols-3 gap-4 pt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">1000+</div>
                <div className="text-sm text-blue-200">Active Learners</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">500+</div>
                <div className="text-sm text-blue-200">Courses</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">50+</div>
                <div className="text-sm text-blue-200">Instructors</div>
              </div>
            </div> */}
          </div>
        </div>

        {/* Right Side - Auth Forms */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {activeTab === "signin" ? "Welcome Back" : "Join Our Community"}
              </h2>
              <p className="text-gray-600">
                {activeTab === "signin" 
                  ? "Sign in to continue your learning journey" 
                  : "Create your account and start learning today"
                }
              </p>
            </div>

        <Tabs
          value={activeTab}
          defaultValue="signin"
          onValueChange={handleTabChange}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 bg-gray-100 p-1 rounded-xl">
                <TabsTrigger 
                  value="signin" 
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg transition-all duration-200"
                >
                  Sign In
                </TabsTrigger>
                <TabsTrigger 
                  value="signup"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg transition-all duration-200"
                >
                  Sign Up
                </TabsTrigger>
          </TabsList>

              <TabsContent value="signin" className="mt-6">
                <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-8">
                {authError && (
                      <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="text-red-600 text-center font-medium">
                    {authError}
                        </div>
                  </div>
                )}
                <CommonForm
                  formControls={signInFormControls}
                  buttonText={"Sign In"}
                  formData={signInFormData}
                  setFormData={setSignInFormData}
                  isButtonDisabled={!checkIfSignInFormIsValid()}
                  handleSubmit={handleLoginUser}
                />
              </CardContent>
            </Card>
          </TabsContent>

              <TabsContent value="signup" className="mt-6">
                <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-8">
                {authError && (
                      <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="text-red-600 text-center font-medium">
                    {authError}
                        </div>
                  </div>
                )}
                <CommonForm
                  formControls={signUpFormControls}
                      buttonText={"Create Account"}
                  formData={signUpFormData}
                  setFormData={setSignUpFormData}
                  isButtonDisabled={!checkIfSignUpFormIsValid()}
                  handleSubmit={handleRegisterUser}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

            {/* Footer */}
            <div className="text-center mt-8 text-sm text-gray-500">
              <p>By continuing, you agree to our Terms of Service and Privacy Policy</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
