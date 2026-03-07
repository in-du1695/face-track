import { useState, useCallback } from "react";
import { ScanFace, CheckCircle2, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import WebcamCapture from "./WebcamCapture";
import { getStudents, markAttendance, type Student } from "@/lib/studentStore";
import { toast } from "sonner";

interface MarkAttendanceProps {
  onMarked: () => void;
}

const MarkAttendance = ({ onMarked }: MarkAttendanceProps) => {
  const [isScanning, setIsScanning] = useState(false);
  const [matchedStudent, setMatchedStudent] = useState<Student | null>(null);
  const [status, setStatus] = useState<"idle" | "found" | "not_found">("idle");

  const handleCapture = useCallback(() => {
    setIsScanning(true);
    setStatus("idle");
    setMatchedStudent(null);

    // Simulate face recognition with a delay
    setTimeout(() => {
      const students = getStudents();
      if (students.length === 0) {
        setStatus("not_found");
        setIsScanning(false);
        toast.error("No students registered yet!");
        return;
      }

      // Simulate matching — pick a random registered student
      const matched = students[Math.floor(Math.random() * students.length)];
      setMatchedStudent(matched);
      setStatus("found");
      setIsScanning(false);

      const result = markAttendance(matched);
      if (result) {
        toast.success(`Attendance marked for ${matched.name}!`);
        onMarked();
      } else {
        toast.info(`${matched.name} already marked present today.`);
      }
    }, 2000);
  }, [onMarked]);

  const selectStudent = (student: Student) => {
    const result = markAttendance(student);
    if (result) {
      toast.success(`Attendance marked for ${student.name}!`);
      onMarked();
    } else {
      toast.info(`${student.name} already marked present today.`);
    }
    setMatchedStudent(student);
    setStatus("found");
  };

  const students = getStudents();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <ScanFace className="h-5 w-5 text-primary" />
          Mark Attendance
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <WebcamCapture onCapture={handleCapture} isScanning={isScanning} />

        {status === "found" && matchedStudent && (
          <div className="flex items-center gap-3 rounded-lg border-2 border-success bg-success/10 p-4">
            <CheckCircle2 className="h-8 w-8 text-success" />
            <div>
              <p className="font-semibold">{matchedStudent.name}</p>
              <p className="text-sm text-muted-foreground font-mono">
                Roll: {matchedStudent.rollNo}
              </p>
            </div>
            {matchedStudent.photoDataUrl && (
              <img
                src={matchedStudent.photoDataUrl}
                alt={matchedStudent.name}
                className="ml-auto h-14 w-14 rounded-full object-cover border-2 border-success"
              />
            )}
          </div>
        )}

        {status === "not_found" && (
          <div className="flex items-center gap-3 rounded-lg border-2 border-destructive bg-destructive/10 p-4">
            <XCircle className="h-8 w-8 text-destructive" />
            <p className="font-semibold">No match found</p>
          </div>
        )}

        {/* Manual selection fallback */}
        {students.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Or select student manually:
            </p>
            <div className="grid gap-2 max-h-48 overflow-y-auto">
              {students.map((s) => (
                <Button
                  key={s.id}
                  variant="outline"
                  className="justify-start gap-3 h-auto py-2"
                  onClick={() => selectStudent(s)}
                >
                  {s.photoDataUrl && (
                    <img
                      src={s.photoDataUrl}
                      alt={s.name}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  )}
                  <span className="font-medium">{s.name}</span>
                  <span className="text-muted-foreground font-mono text-xs ml-auto">
                    {s.rollNo}
                  </span>
                </Button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MarkAttendance;
