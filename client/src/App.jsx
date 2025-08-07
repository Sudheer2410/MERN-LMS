import { Route, Routes } from "react-router-dom";
import { Suspense, lazy, useContext } from "react";
import { AuthContext } from "./context/auth-context";
import RouteGuard from "./components/route-guard";
import AuthPage from "./pages/auth";

// Lazy load components for better performance
const InstructorDashboardpage = lazy(() => import("./pages/instructor"));
const StudentViewCommonLayout = lazy(() => import("./components/student-view/common-layout"));
const StudentHomePage = lazy(() => import("./pages/student/home"));
const NotFoundPage = lazy(() => import("./pages/not-found"));
const AddNewCoursePage = lazy(() => import("./pages/instructor/add-new-course"));
const StudentViewCoursesPage = lazy(() => import("./pages/student/courses"));
const StudentViewCourseDetailsPage = lazy(() => import("./pages/student/course-details"));
const PaypalPaymentReturnPage = lazy(() => import("./pages/student/payment-return"));
const StudentCoursesPage = lazy(() => import("./pages/student/student-courses"));
const StudentViewCourseProgressPage = lazy(() => import("./pages/student/course-progress"));

// Simple loading component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
);

function App() {
  const { auth } = useContext(AuthContext);

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route
          path="/auth"
          element={
            <RouteGuard
              element={<AuthPage />}
              authenticated={auth?.authenticate}
              user={auth?.user}
            />
          }
        />
        <Route
          path="/instructor"
          element={
            <RouteGuard
              element={<InstructorDashboardpage />}
              authenticated={auth?.authenticate}
              user={auth?.user}
            />
          }
        />
        <Route
          path="/instructor/create-new-course"
          element={
            <RouteGuard
              element={<AddNewCoursePage />}
              authenticated={auth?.authenticate}
              user={auth?.user}
            />
          }
        />
        <Route
          path="/instructor/edit-course/:courseId"
          element={
            <RouteGuard
              element={<AddNewCoursePage />}
              authenticated={auth?.authenticate}
              user={auth?.user}
            />
          }
        />
        <Route
          path="/"
          element={
            <RouteGuard
              element={<StudentViewCommonLayout />}
              authenticated={auth?.authenticate}
              user={auth?.user}
            />
          }
        >
          <Route path="" element={<StudentHomePage />} />
          <Route path="home" element={<StudentHomePage />} />
          <Route path="courses" element={<StudentViewCoursesPage />} />
          <Route
            path="course/details/:id"
            element={<StudentViewCourseDetailsPage />}
          />
          <Route path="payment-return" element={<PaypalPaymentReturnPage />} />
          <Route path="student-courses" element={<StudentCoursesPage />} />
          <Route
            path="course-progress/:id"
            element={<StudentViewCourseProgressPage />}
          />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}

export default App;
