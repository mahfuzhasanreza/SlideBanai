import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Sidebar from "@/components/sidebar";
import ProgressWithText from "@/components/progress-with-text";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { PresentationWithMeta, CoachSession, PresentationAnalysis } from "@/lib/types";
import {
  Mic,
  Play,
  Video,
  BarChart,
  List,
  Loader2,
  Calendar,
} from "lucide-react";

export default function CoachPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedPresentationId, setSelectedPresentationId] = useState<number | null>(null);
  

  // Fetch presentations
  const { data: presentations = [] } = useQuery<PresentationWithMeta[]>({
    queryKey: ["/api/presentations"],
  });

  // Fetch coaching sessions
  const {
    data: coachSessions = [],
    isLoading: sessionsLoading,
    error: sessionsError,
  } = useQuery<CoachSession[]>({
    queryKey: ["/api/coach-sessions/user"],
  });


  // Start practice session
  const handleStartPractice = () => {
    if (!selectedPresentationId) {
      toast({
        title: "No presentation selected",
        description: "Please select a presentation to practice.",
        variant: "destructive",
      });
      return;
    }

  };

  // Simulate record speech
  const handleRecordSpeech = () => {
    toast({
      title: "Recording feature",
      description: "In a full implementation, this would turn on your camera and record your speech.",
    });
    
    // Simulate audio recording by setting sample text
   
  };

  // Get the most recent session analysis
  const latestSession = coachSessions.length > 0 ? coachSessions[0] : null;

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  Presentation Coach
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  Practice your presentation skills and get AI feedback
                </p>
              </div>
            </div>

            
          </div>
        </main>
      </div>
    </div>
  );
}
