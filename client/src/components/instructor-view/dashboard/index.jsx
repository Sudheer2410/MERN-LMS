import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DollarSign, Users, TrendingUp, BookOpen, Award } from "lucide-react";
import PropTypes from "prop-types";

function InstructorDashboard({ listOfCourses }) {
  function calculateTotalStudentsAndProfit() {
    const { totalStudents, totalProfit, studentList } = listOfCourses.reduce(
      (acc, course) => {
        const studentCount = course.students.length;
        acc.totalStudents += studentCount;
        acc.totalProfit += course.pricing * studentCount;

        course.students.forEach((student) => {
          acc.studentList.push({
            courseTitle: course.title,
            studentName: student.studentName,
            studentEmail: student.studentEmail,
          });
        });

        return acc;
      },
      {
        totalStudents: 0,
        totalProfit: 0,
        studentList: [],
      }
    );

    return {
      totalProfit,
      totalStudents,
      studentList,
    };
  }

  const stats = calculateTotalStudentsAndProfit();
  const totalCourses = listOfCourses.length;
  const averageRevenue = totalCourses > 0 ? stats.totalProfit / totalCourses : 0;

  const config = [
    {
      icon: BookOpen,
      label: "Total Courses",
      value: totalCourses,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      icon: Users,
      label: "Total Students",
      value: stats.totalStudents,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      icon: DollarSign,
      label: "Total Revenue",
      value: `$${stats.totalProfit.toLocaleString()}`,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      icon: TrendingUp,
      label: "Avg. Revenue/Course",
      value: `$${averageRevenue.toLocaleString()}`,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {config.map((item, index) => (
          <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {item.label}
              </CardTitle>
              <div className={`p-2 rounded-lg ${item.bgColor}`}>
                <item.icon className={`h-5 w-5 ${item.iconColor}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{item.value}</div>
              <div className="flex items-center space-x-1 mt-1">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-600 font-medium">+12%</span>
                <span className="text-sm text-gray-500">from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity & Students List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-blue-600" />
              <span>Recent Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {listOfCourses.slice(0, 3).map((course, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <BookOpen className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{course.title}</p>
                    <p className="text-sm text-gray-600">{course.students.length} students enrolled</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">${course.pricing * course.students.length}</p>
                    <p className="text-xs text-gray-500">revenue</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Students List */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-green-600" />
              <span>Recent Students</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.studentList.slice(0, 5).map((student, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                    <Users className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{student.studentName}</p>
                    <p className="text-sm text-gray-600">{student.courseTitle}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Enrolled</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Full Students Table */}
      {stats.studentList.length > 0 && (
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-600" />
              <span>All Students ({stats.studentList.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table className="w-full">
                <TableHeader>
                  <TableRow className="border-gray-200">
                    <TableHead className="font-semibold text-gray-900">Course Name</TableHead>
                    <TableHead className="font-semibold text-gray-900">Student Name</TableHead>
                    <TableHead className="font-semibold text-gray-900">Student Email</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {stats.studentList.map((studentItem, index) => (
                    <TableRow key={index} className="hover:bg-gray-50 transition-colors">
                      <TableCell className="font-medium text-gray-900">
                        {studentItem.courseTitle}
                      </TableCell>
                      <TableCell className="text-gray-700">{studentItem.studentName}</TableCell>
                      <TableCell className="text-gray-600">{studentItem.studentEmail}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

InstructorDashboard.propTypes = {
  listOfCourses: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      pricing: PropTypes.number.isRequired,
      students: PropTypes.arrayOf(
        PropTypes.shape({
          studentName: PropTypes.string.isRequired,
          studentEmail: PropTypes.string.isRequired,
        })
      ).isRequired,
    })
  ).isRequired,
};

export default InstructorDashboard;
