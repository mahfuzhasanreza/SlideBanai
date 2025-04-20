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
  const [practiceText, setPracticeText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [activeTab, setActiveTab] = useState("practice");

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

  // Analyze presentation mutation
  const analyzePresentationMutation = useMutation({
    mutationFn: async (presentationText: string) => {
      const res = await apiRequest("POST", "/api/analyze-presentation", {
        presentationText,
      });
      return await res.json();
    },
    onSuccess: (analysis: PresentationAnalysis) => {
      // Save coaching session
      if (selectedPresentationId) {
        saveCoachSessionMutation.mutate({
          user_id: user?.id || 0,
          presentation_id: selectedPresentationId,
          content_coverage: analysis.content_coverage,
          pace_score: analysis.pace_score,
          clarity_score: analysis.clarity_score,
          eye_contact_score: analysis.eye_contact_score,
          feedback: analysis.feedback,
        });
      }

      toast({
        title: "Analysis complete",
        description: "Your presentation has been analyzed.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Analysis failed",
        description: error.message,
        variant: "destructive",
      });
      setIsRecording(false);
    },
  });

  // Save coach session mutation
  const saveCoachSessionMutation = useMutation({
    mutationFn: async (sessionData: any) => {
      const res = await apiRequest("POST", "/api/coach-sessions", sessionData);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/coach-sessions/user"] });
      setIsRecording(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to save session",
        description: error.message,
        variant: "destructive",
      });
      setIsRecording(false);
    },
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

    if (!practiceText.trim()) {
      toast({
        title: "No practice text",
        description: "Please enter or record your practice speech.",
        variant: "destructive",
      });
      return;
    }

    setIsRecording(true);
    
    analyzePresentationMutation.mutate(practiceText);
  };

  // Simulate record speech
  const handleRecordSpeech = () => {
    toast({
      title: "Recording feature",
      description: "In a full implementation, this would turn on your camera and record your speech.",
    });
    
    setPracticeText(
      "Today I want to talk about our new product launch. We've been working on this for six months and I'm excited to show you what we've created. Our product solves the key pain points our customers have been facing. The main features include an intuitive dashboard, automated reporting, and seamless integration with existing tools. Based on our research, we expect this to improve productivity by 30%. We're planning to roll this out next quarter and will start with our premium customers."
    );
  };

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

            <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
              <TabsList>
                <TabsTrigger value="practice">
                  <Play className="h-4 w-4 mr-2" />
                  Practice
                </TabsTrigger>
                <TabsTrigger value="history">
                  <Calendar className="h-4 w-4 mr-2" />
                  Practice History
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="practice" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="md:col-span-2">
                    <CardContent className="pt-6">
                      <h2 className="text-lg font-medium mb-4">Practice Your Presentation</h2>
                      
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Select Presentation
                        </label>
                        <Select 
                          value={selectedPresentationId?.toString() || ""} 
                          onValueChange={(value) => setSelectedPresentationId(Number(value))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a presentation" />
                          </SelectTrigger>
                          <SelectContent>
                            {presentations.map((presentation) => (
                              <SelectItem 
                                key={presentation.id} 
                                value={presentation.id.toString()}
                              >
                                {presentation.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg overflow-hidden mb-4">
                        <div className="flex items-center justify-center">
                          <div className="text-center">
                            <Video className="h-12 w-12 text-gray-400 mx-auto" />
                            <p className="mt-2 text-sm text-gray-500">
                              Turn on your camera to practice your presentation
                            </p>
                            <Button 
                              className="mt-4"
                              onClick={handleRecordSpeech}
                              disabled={isRecording}
                            >
                              <Mic className="h-4 w-4 mr-2" />
                              Start Recording
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Practice Speech
                        </label>
                        <Textarea
                          placeholder="Enter your practice speech here or record it with your camera..."
                          className="min-h-[150px]"
                          value={practiceText}
                          onChange={(e) => setPracticeText(e.target.value)}
                          disabled={isRecording}
                        />
                      </div>
                      
                      <Button 
                        className="w-full" 
                        onClick={handleStartPractice}
                        disabled={isRecording || !selectedPresentationId || !practiceText.trim()}
                      >
                        {analyzePresentationMutation.isPending ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <BarChart className="h-4 w-4 mr-2" />
                            Analyze Performance
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <h2 className="text-lg font-medium mb-4">Performance Metrics</h2>
                      
                      {latestSession ? (
                        <div className="space-y-4">
                          <ProgressWithText
                            label="Content Coverage"
                            value={latestSession.content_coverage || 0}
                          />
                          <ProgressWithText
                            label="Pace"
                            value={latestSession.pace_score || 0}
                          />
                          <ProgressWithText
                            label="Clarity"
                            value={latestSession.clarity_score || 0}
                          />
                          <ProgressWithText
                            label="Eye Contact"
                            value={latestSession.eye_contact_score || 0}
                          />
                          
                          <div className="mt-6 p-3 bg-gray-50 rounded-md">
                            <h3 className="text-sm font-medium text-gray-900 mb-2">
                              Coach Feedback
                            </h3>
                            <p className="text-sm text-gray-600">
                              {latestSession.feedback || "No feedback available"}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                          <BarChart className="h-12 w-12 text-gray-300 mb-2" />
                          <h3 className="text-gray-500 font-medium">No practice data yet</h3>
                          <p className="text-gray-400 text-sm mt-1">
                            Complete a practice session to see your metrics
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
                
                <Card className="mt-6">
                  <CardContent className="pt-6">
                    <h2 className="text-lg font-medium mb-4">Coaching Tips</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 border rounded-md bg-gray-50">
                        <h3 className="font-medium text-gray-800 mb-2">
                          <List className="h-4 w-4 inline mr-2" />
                          Improve Content Coverage
                        </h3>
                        <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                          <li>Focus on key points rather than trying to cover everything</li>
                          <li>Use concrete examples to illustrate main concepts</li>
                          <li>Summarize important takeaways at the end of each section</li>
                        </ul>
                      </div>
                      
                      <div className="p-4 border rounded-md bg-gray-50">
                        <h3 className="font-medium text-gray-800 mb-2">
                          <List className="h-4 w-4 inline mr-2" />
                          Improve Pace
                        </h3>
                        <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                          <li>Practice with a timer to get familiar with your timing</li>
                          <li>Mark places in your notes where you can slow down</li>
                          <li>Use pauses strategically to emphasize key points</li>
                        </ul>
                      </div>
                      
                      <div className="p-4 border rounded-md bg-gray-50">
                        <h3 className="font-medium text-gray-800 mb-2">
                          <List className="h-4 w-4 inline mr-2" />
                          Improve Clarity
                        </h3>
                        <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                          <li>Avoid jargon unless your audience is familiar with it</li>
                          <li>Use simple, concise language to explain complex ideas</li>
                          <li>Structure your presentation with clear transitions</li>
                        </ul>
                      </div>
                      
                      <div className="p-4 border rounded-md bg-gray-50">
                        <h3 className="font-medium text-gray-800 mb-2">
                          <List className="h-4 w-4 inline mr-2" />
                          Improve Eye Contact
                        </h3>
                        <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                          <li>Practice looking at different areas of the room</li>
                          <li>Try the "triangle technique" - look at different faces</li>
                          <li>Reduce reliance on notes to maintain audience connection</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="history" className="mt-6">
                <Card>
                  <CardContent className="pt-6">
                    <h2 className="text-lg font-medium mb-4">Practice History</h2>
                    
                    {sessionsLoading ? (
                      <div className="flex justify-center items-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
                      </div>
                    ) : sessionsError ? (
                      <div className="bg-red-50 p-4 rounded-md text-center">
                        <p className="text-red-500">Failed to load practice history. Please try again.</p>
                      </div>
                    ) : coachSessions.length === 0 ? (
                      <div className="text-center py-8">
                        <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                        <h3 className="text-gray-500 font-medium">No practice history</h3>
                        <p className="text-gray-400 text-sm mt-1">
                          Your practice sessions will appear here
                        </p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Date
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Presentation
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Content
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Pace
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Clarity
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Eye Contact
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {coachSessions.map((session) => {
                              const presentation = presentations.find(p => p.id === session.presentation_id);
                              return (
                                <tr key={session.id}>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(session.created_at || "").toLocaleDateString()}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {presentation?.title || "Unknown"}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="w-24">
                                      <ProgressWithText
                                        label=""
                                        value={session.content_coverage || 0}
                                        size="sm"
                                      />
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="w-24">
                                      <ProgressWithText
                                        label=""
                                        value={session.pace_score || 0}
                                        size="sm"
                                      />
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="w-24">
                                      <ProgressWithText
                                        label=""
                                        value={session.clarity_score || 0}
                                        size="sm"
                                      />
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="w-24">
                                      <ProgressWithText
                                        label=""
                                        value={session.eye_contact_score || 0}
                                        size="sm"
                                      />
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}
