import React from "react";
import { BarChart3 } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <div className="bg-purple-500 p-6 rounded-full">
        <BarChart3 className="h-12 w-12 text-white" />
      </div>
      <h1 className="text-3xl font-bold">Reports</h1>
      <p className="text-muted-foreground text-lg">
        This page is under development
      </p>
      <p className="text-sm text-muted-foreground max-w-md text-center">
        We're working on building comprehensive analytics and reports. 
        This feature will be available soon.
      </p>
    </div>
  );
}
