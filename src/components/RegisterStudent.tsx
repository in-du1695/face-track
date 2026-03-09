import { useState } from "react";
import { UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import WebcamCapture from "./WebcamCapture";
import { saveStudent } from "@/lib/studentStore";
import { toast } from "sonner";

interface RegisterStudentProps {
  onRegistered: () => void;
}

const RegisterStudent = ({ onRegistered }: RegisterStudentProps) => {
  const [name, setName] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [branch, setBranch] = useState("");
  const [section, setSection] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  

  const handleCapture = (dataUrl: string) => {
    setPhoto(dataUrl);
    toast.success("Photo captured!");
  };

  const handleSubmit = () => {
    if (!name.trim() || !rollNo.trim() || !branch || !section) {
      toast.error("Please fill in all fields");
      return;
    }
    if (!photo) {
      toast.error("Please capture a photo");
      return;
    }
    saveStudent({
     id: crypto.randomUUID(),
     name: name.trim(),
     rollNo: rollNo.trim(),
     branch,
     section,
     photoDataUrl: photo,
     registeredAt: new Date().toISOString(),
     });
    toast.success(`${name} registered successfully!`);
    setName("");
     setRollNo("");
     setBranch("");
     setSection("");
     setPhoto(null);
    onRegistered();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <UserPlus className="h-5 w-5 text-primary" />
          Register New Student
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="rollNo">Roll Number</Label>
            <Input
              id="rollNo"
              placeholder="234G1AXXXX"
              value={rollNo}
              onChange={(e) => setRollNo(e.target.value)}
            />
          </div>
          <div className="space-y-2">
  <Label htmlFor="branch">Branch</Label>
  <Input
    id="branch"
    placeholder="CSE / CSM / ECE / EEE"
    value={branch}
    onChange={(e) => setBranch(e.target.value)}
  />
</div>

<div className="space-y-2">
  <Label htmlFor="section">Section</Label>
  <Input
    id="section"
    placeholder="A / B / C"
    value={section}
    onChange={(e) => setSection(e.target.value)}
  />
</div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <WebcamCapture onCapture={handleCapture} />
          {photo && (
            <div className="space-y-2">
              <Label>Captured Photo</Label>
              <div className="overflow-hidden rounded-lg border-2 border-success">
                <img src={photo} alt="Captured" className="w-full" />
              </div>
            </div>
          )}
        </div>

        <Button onClick={handleSubmit} className="w-full gap-2" size="lg">
          <UserPlus className="h-4 w-4" />
          Register Student
        </Button>
      </CardContent>
    </Card>
  );
};

export default RegisterStudent;
