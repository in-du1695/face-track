import { FileSpreadsheet, Download, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getAttendanceRecords,
  getStudents,
  deleteStudent,
  type AttendanceRecord,
  type Student,
} from "@/lib/studentStore";
import { toast } from "sonner";
import * as XLSX from "xlsx";

interface AttendanceTableProps {
  records: AttendanceRecord[];
  students: Student[];
  onRefresh: () => void;
}

const AttendanceTable = ({ records, students, onRefresh }: AttendanceTableProps) => {
  const [branchFilter, setBranchFilter] = useState("");
const [sectionFilter, setSectionFilter] = useState("");
  const exportToExcel = () => {
    if (records.length === 0) {
      toast.error("No attendance records to export");
      return;
    }

    const data = records.map((r, i) => {
  const student = students.find((s) => s.rollNo === r.rollNo);

  return {
    "S.No": i + 1,
    "Student Name": r.studentName,
    "Roll Number": r.rollNo,
    Branch: student?.branch || "",
    Section: student?.section || "",
    Date: r.date,
    Time: new Date(r.timestamp).toLocaleTimeString(),
  };
});

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Attendance");

    // Also export student list
    const studentData = students.map((s, i) => ({
      "S.No": i + 1,
      Name: s.name,
      "Roll Number": s.rollNo,
      "Registered On": new Date(s.registeredAt).toLocaleDateString(),
    }));
    const ws2 = XLSX.utils.json_to_sheet(studentData);
    XLSX.utils.book_append_sheet(wb, ws2, "Students");

    XLSX.writeFile(wb, `attendance_${new Date().toISOString().split("T")[0]}.xlsx`);
    toast.success("Excel file downloaded!");
  };

  const handleDeleteStudent = (id: string, name: string) => {
    deleteStudent(id);
    toast.success(`${name} removed`);
    onRefresh();
  };

  const today = new Date().toISOString().split("T")[0];
const todayRecords = records.filter((r) => {
  const student = students.find((s) => s.rollNo === r.rollNo);


  return (
    r.date === today &&
    (!branchFilter || student?.branch === branchFilter) &&
    (!sectionFilter || student?.section === sectionFilter)
  );
});
const filteredStudents = students.filter(
  (s) =>
    (!branchFilter || s.branch === branchFilter) &&
    (!sectionFilter || s.section === sectionFilter)
);
  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Total Students", value: filteredStudents.length },
{ label: "Present Today", value: todayRecords.length },
{ label: "Absent Today", value: filteredStudents.length - todayRecords.length },
{ label: "Total Records", value: records.length },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-primary font-mono">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Today's Attendance */}
      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <CardTitle className="flex items-center gap-2 text-lg">
            <FileSpreadsheet className="h-5 w-5 text-primary" />
            Today's Attendance
          </CardTitle>
          <Button onClick={exportToExcel} variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Export Excel
          </Button>
        </CardHeader>
        
        <CardContent>
          <div className="flex gap-4 mb-4">
  <select
    className="border rounded p-2"
    value={branchFilter}
    onChange={(e) => setBranchFilter(e.target.value)}
  >
    <option value="">All Branches</option>
    <option value="CSM">CSM</option>
    <option value="CSE">CSE</option>
    <option value="ECE">ECE</option>
    <option value="EEE">EEE</option>
  </select>

  <select
    className="border rounded p-2"
    value={sectionFilter}
    onChange={(e) => setSectionFilter(e.target.value)}
  >
    <option value="">All Sections</option>
    <option value="A">A</option>
    <option value="B">B</option>
    <option value="C">C</option>
  </select>
</div>
          {todayRecords.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No attendance recorded today
            </p>
            
          ) : (
            
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Roll No</TableHead>
                  <TableHead>Branch</TableHead>
                  <TableHead>Section</TableHead>
                  <TableHead>Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
               {todayRecords.map((r, i) => {
  const student = students.find((s) => s.rollNo === r.rollNo);

  return (
    <TableRow key={r.id}>
      <TableCell className="font-mono text-muted-foreground">{i + 1}</TableCell>
      <TableCell className="font-medium">{r.studentName}</TableCell>
      <TableCell className="font-mono">{r.rollNo}</TableCell>
      <TableCell>{student?.branch}</TableCell>
      <TableCell>{student?.section}</TableCell>
      <TableCell className="text-muted-foreground">
        {new Date(r.timestamp).toLocaleTimeString()}
      </TableCell>
    </TableRow>
  );
})}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Registered Students */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Registered Students</CardTitle>
        </CardHeader>
        <CardContent>
          {students.length === 0 ? (
           <p className="text-center text-muted-foreground py-8">
  No students registered yet
</p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {students.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center gap-3 rounded-lg border p-3 group"
                >
                  {s.photoDataUrl ? (
                    <img
                      src={s.photoDataUrl}
                      alt={s.name}
                      className="h-10 w-10 rounded-full object-cover border"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-sm font-bold">
                      {s.name[0]}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{s.name}</p>
<p className="text-xs text-muted-foreground font-mono">
  {s.rollNo} • {s.branch} - {s.section}
</p>                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 text-destructive"
                    onClick={() => handleDeleteStudent(s.id, s.name)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendanceTable;
