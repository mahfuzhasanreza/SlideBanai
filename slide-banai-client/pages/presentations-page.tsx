import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import Sidebar from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import PresentationCard from "@/components/presentation-card";
import CreatePresentationModal from "@/components/create-presentation-modal";
import { PresentationWithMeta, Template } from "@/lib/types";
import { Plus, Search, Filter, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
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

export default function PresentationsPage() {

  // Fetch presentations
  const {
    data: presentations = [],
    isLoading: presentationsLoading,
    error: presentationsError,
  } = useQuery<PresentationWithMeta[]>({
    queryKey: ["/api/presentations"],
  });

  // Fetch shared presentations
  const {
    data: sharedPresentations = [],
    isLoading: sharedLoading,
    error: sharedError,
  } = useQuery<PresentationWithMeta[]>({
    queryKey: ["/api/presentations/shared"],
  });

  // Fetch templates for the create modal
  const { data: templates = [] } = useQuery<Template[]>({
    queryKey: ["/api/templates"],
  });


 
  

    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {activePresentations.map((presentation, index) => (
          <PresentationCard
            key={presentation.id}
            presentation={presentation}
            colorScheme={index % 3 === 0 ? "blue" : index % 3 === 1 ? "green" : "purple"}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">My Presentations</h1>
                <p className="mt-1 text-sm text-gray-500">
                  Manage and organize all your presentations
                </p>
              </div>
              <Button onClick={() => setCreateModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New Presentation
              </Button>
            </div>

            <div className="mt-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                  <TabsList className="mb-2 sm:mb-0">
                    <TabsTrigger value="all">All Presentations</TabsTrigger>
                    <TabsTrigger value="shared">Shared with me</TabsTrigger>
                  </TabsList>
                  
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search presentations..."
                        className="pl-8 w-full"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Select value={sortBy} onValueChange={(value) => setSortBy(value)}>
                      <SelectTrigger className="w-full sm:w-[180px]">
                        <Filter className="h-4 w-4 mr-2 text-gray-400" />
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="updated">Last Updated</SelectItem>
                        <SelectItem value="created">Date Created</SelectItem>
                        <SelectItem value="title">Title A-Z</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="mt-6">
                  <TabsContent value="all" className="pt-4">
                    {renderPresentationsGrid()}
                  </TabsContent>
                  
                  <TabsContent value="shared" className="pt-4">
                    {renderPresentationsGrid()}
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </div>
        </main>
      </div>

      <CreatePresentationModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        templates={templates}
      />
    </div>
  );
}
