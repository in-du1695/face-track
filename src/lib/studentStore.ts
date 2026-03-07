export interface Student {
  id: string;
  name: string;
  rollNo: string;
  photoDataUrl: string | null;
  registeredAt: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  rollNo: string;
  timestamp: string;
  date: string;
}

const STUDENTS_KEY = "face_attendance_students";
const ATTENDANCE_KEY = "face_attendance_records";

export function getStudents(): Student[] {
  const data = localStorage.getItem(STUDENTS_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveStudent(student: Student) {
  const students = getStudents();
  students.push(student);
  localStorage.setItem(STUDENTS_KEY, JSON.stringify(students));
}

export function deleteStudent(id: string) {
  const students = getStudents().filter((s) => s.id !== id);
  localStorage.setItem(STUDENTS_KEY, JSON.stringify(students));
}

export function getAttendanceRecords(): AttendanceRecord[] {
  const data = localStorage.getItem(ATTENDANCE_KEY);
  return data ? JSON.parse(data) : [];
}

export function markAttendance(student: Student) {
  const records = getAttendanceRecords();
  const today = new Date().toISOString().split("T")[0];
  const alreadyMarked = records.some(
    (r) => r.studentId === student.id && r.date === today
  );
  if (alreadyMarked) return false;

  records.push({
    id: crypto.randomUUID(),
    studentId: student.id,
    studentName: student.name,
    rollNo: student.rollNo,
    timestamp: new Date().toISOString(),
    date: today,
  });
  localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(records));
  return true;
}
