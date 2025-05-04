import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PatientCard } from "./PatientCard";

import { Search, UserPlus } from "lucide-react";
import { useGetPatientsDataQuery } from "@/app/slices/dentistApiSlice";

export default function DentistPatients() {
  const [searchQuery, setSearchQuery] = useState("");

  // const [patients, setPatients] = useState(mockPatients);
  const { data: realPatients, isLoading } = useGetPatientsDataQuery();
  const patients = Array.isArray(realPatients?.data) ? realPatients.data : [];
  // const 

  const filteredPatients = patients?.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.phone.toLowerCase().includes(searchQuery.toLowerCase())
  );
  if (isLoading) {
    return <>Loading....</>;
  }
  return (
    <div className="flex-1 p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Patients</h1>
          <p className="text-muted-foreground">
            Manage and view your patient records
          </p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search patients by name, email, or phone..."
          className="pl-10 max-w-md"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {filteredPatients?.map((patient) => (
          <PatientCard key={patient._id} patient={patient} />
        ))}
      </div>

      {filteredPatients?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No patients found matching your search criteria.
          </p>
        </div>
      )}
    </div>
  );
}
