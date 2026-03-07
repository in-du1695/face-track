import { useState, useCallback } from "react";
import { ScanFace, UserPlus, LayoutDashboard } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RegisterStudent from "@/components/RegisterStudent";
import MarkAttendance from "@/components/MarkAttendance";
import AttendanceTable from "@/components/AttendanceTable";
import { getStudents, getAttendanceRecords } from "@/lib/studentStore";

const Index = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const refresh = useCallback(() => setRefreshKey((k) => k + 1), []);

  const students = getStudents();
  const records = getAttendanceRecords();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container flex items-center gap-3 py-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <ScanFace className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">FaceTrack</h1>
            <p className="text-xs text-muted-foreground">
              Smart Attendance System
            </p>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="container py-6" key={refreshKey}>
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="dashboard" className="gap-2">
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="register" className="gap-2">
              <UserPlus className="h-4 w-4" />
              Register
            </TabsTrigger>
            <TabsTrigger value="attendance" className="gap-2">
              <ScanFace className="h-4 w-4" />
              Attend
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <AttendanceTable
              records={records}
              students={students}
              onRefresh={refresh}
            />
          </TabsContent>

          <TabsContent value="register">
            <RegisterStudent onRegistered={refresh} />
          </TabsContent>

          <TabsContent value="attendance">
            <MarkAttendance onMarked={refresh} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
