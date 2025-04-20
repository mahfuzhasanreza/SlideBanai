import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "wouter";
import {
  Grid,
  FileText,
  Download,
  Users,
  Upload,
  Plus,
  Loader2,
  ExternalLink,
} from "lucide-react";
import Sidebar from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import PresentationCard from "@/components/presentation-card";
import TemplateCard from "@/components/template-card";
import ProgressWithText from "@/components/progress-with-text";
import CreatePresentationModal from "@/components/create-presentation-modal";
import { DashboardStats, PresentationWithMeta, Template } from "@/lib/types";

export default function DashboardPage() {
  const { user } = useAuth();
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // Fetch presentations
  const {
    data: presentations = [],
    isLoading: presentationsLoading,
    error: presentationsError,
  } = useQuery<PresentationWithMeta[]>({
    queryKey: ["/api/presentations"],
  });

  // Fetch templates
  const {
    data: templates = [],
    isLoading: templatesLoading,
    error: templatesError,
  } = useQuery<Template[]>({
    queryKey: ["/api/templates"],
  });

  // Calculate dashboard stats
  const stats: DashboardStats = {
    totalPresentations: presentations.length,
    availableCredits: user?.credits || 0,
    collaborators: 0,
  };

  // Sort presentations by updated_at
  const recentPresentations = [...presentations]
    .sort((a, b) => {
      const dateA = a.updated_at ? new Date(a.updated_at).getTime() : 0;
      const dateB = b.updated_at ? new Date(b.updated_at).getTime() : 0;
      return dateB - dateA;
    })
    .slice(0, 3);

  // Handle template selection
  const handleTemplateSelect = (templateId: number) => {
    setCreateModalOpen(true);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white border-b border-gray-200 md:hidden">
          <button className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:bg-gray-100 focus:text-gray-600 md:hidden">
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </button>
        </div>

        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6 px-4 sm:px-6 lg:px-8">
            {/* Dashboard Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  Welcome back, {user?.name || user?.username}
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  Here's what's happening with your presentations.
                </p>
              </div>
              <div className="mt-4 md:mt-0 flex space-x-3">
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Notes
                </Button>
                <Link href="/canva">
                  <Button variant="outline" size="sm">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Canva Integration
                  </Button>
                </Link>
                <Button size="sm" onClick={() => setCreateModalOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Presentation
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-primary-100 rounded-md p-3">
                      <FileText className="h-6 w-6 text-primary-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Total Presentations
                        </dt>
                        <dd>
                          <div className="text-lg font-medium text-gray-900">
                            {stats.totalPresentations}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                      <Download className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Available Credits
                        </dt>
                        <dd>
                          <div className="text-lg font-medium text-gray-900">
                            {stats.availableCredits}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                      <Users className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          Collaborators
                        </dt>
                        <dd>
                          <div className="text-lg font-medium text-gray-900">
                            {stats.collaborators}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Presentations */}
            <div className="mt-8">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium text-gray-900">
                  Recent Presentations
                </h2>
                <Link
                  href="/presentations"
                  className="text-sm font-medium text-primary-600 hover:text-primary-500"
                >
                  View all
                </Link>
              </div>

              {presentationsLoading ? (
                <div className="mt-4 flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
                </div>
              ) : presentationsError ? (
                <div className="mt-4 bg-red-50 p-4 rounded-md">
                  <p className="text-red-500">
                    Failed to load presentations. Please try again.
                  </p>
                </div>
              ) : recentPresentations.length === 0 ? (
                <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                  <h3 className="text-gray-500 font-medium">
                    No presentations yet
                  </h3>
                  <p className="mt-1 text-gray-400 text-sm">
                    Create your first presentation to get started
                  </p>
                  <Button
                    className="mt-4"
                    onClick={() => setCreateModalOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Presentation
                  </Button>
                </div>
              ) : (
                <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {recentPresentations.map((presentation, index) => (
                    <PresentationCard
                      key={presentation.id}
                      presentation={presentation}
                      colorScheme={
                        index % 3 === 0
                          ? "blue"
                          : index % 3 === 1
                          ? "green"
                          : "purple"
                      }
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Templates Section */}
            <div className="mt-10">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">
                  Popular Templates
                </h2>
                <a
                  href="#"
                  className="text-sm font-medium text-primary-600 hover:text-primary-500"
                >
                  View all templates
                </a>
              </div>

              {templatesLoading ? (
                <div className="mt-4 flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
                </div>
              ) : templatesError ? (
                <div className="mt-4 bg-red-50 p-4 rounded-md">
                  <p className="text-red-500">
                    Failed to load templates. Please try again.
                  </p>
                </div>
              ) : (
                <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  {templates.map((template) => (
                    <TemplateCard
                      key={template.id}
                      template={template}
                      onSelect={handleTemplateSelect}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* AI Coach Section */}
            <div className="mt-10 bg-white shadow overflow-hidden rounded-lg">
              <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-accent-500 to-primary-600">
                <h3 className="text-lg leading-6 font-medium text-white">
                  Presentation Coach
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-white opacity-80">
                  Practice your presentation and get personalized feedback from
                  our AI coach.
                </p>
              </div>
              <div className="px-4 py-5 sm:p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="col-span-2">
                    <div className="aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg overflow-hidden">
                      <div className="flex items-center justify-center">
                        <div className="text-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-12 w-12 text-gray-400 mx-auto"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polygon points="23 7 16 12 23 17 23 7" />
                            <rect
                              x="1"
                              y="5"
                              width="15"
                              height="14"
                              rx="2"
                              ry="2"
                            />
                          </svg>
                          <p className="mt-2 text-sm text-gray-500">
                            Turn on your camera to practice your presentation
                          </p>
                          <Button className="mt-4">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 mr-2"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                              <line x1="12" y1="19" x2="12" y2="23" />
                              <line x1="8" y1="23" x2="16" y2="23" />
                            </svg>
                            Start Practice
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-md font-medium text-gray-900">
                      Performance Metrics
                    </h4>
                    <div className="mt-4 space-y-4">
                      <ProgressWithText
                        label="Content Coverage"
                        value={80}
                        color="primary"
                      />
                      <ProgressWithText
                        label="Pace"
                        value={65}
                        color="primary"
                      />
                      <ProgressWithText
                        label="Clarity"
                        value={75}
                        color="primary"
                      />
                      <ProgressWithText
                        label="Eye Contact"
                        value={50}
                        color="warning"
                      />
                    </div>
                    <div className="mt-6">
                      <Link
                        href="/coach"
                        className="text-sm font-medium text-primary-600 hover:text-primary-500"
                      >
                        View practice history →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Subscription Section */}
            <div className="mt-10 mb-10">
              <h2 className="text-lg font-medium text-gray-900">
                Your Subscription
              </h2>
              <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        {user?.subscription_type === "pro"
                          ? "Pro Plan"
                          : "Free Plan"}
                      </h3>
                      <p className="mt-1 max-w-2xl text-sm text-gray-500">
                        {user?.subscription_expiry
                          ? `Your subscription will renew on ${new Date(
                              user.subscription_expiry
                            ).toLocaleDateString()}`
                          : "Upgrade to unlock all features"}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium ${
                        user?.subscription_type === "pro"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {user?.subscription_type === "pro" ? "Active" : "Free"}
                    </span>
                  </div>
                </div>
                <div className="border-t border-gray-200">
                  <dl>
                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">
                        Features
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        <ul className="list-disc pl-5 space-y-1">
                          {user?.subscription_type === "pro" ? (
                            <>
                              <li>Unlimited presentations</li>
                              <li>Advanced AI generation</li>
                              <li>Collaborative editing</li>
                              <li>5 download credits per month</li>
                              <li>AI presentation coach</li>
                            </>
                          ) : (
                            <>
                              <li>Basic presentations</li>
                              <li>Limited AI generation</li>
                              <li>Basic editing features</li>
                              <li>1 download credit</li>
                              <li>Basic coach features</li>
                            </>
                          )}
                        </ul>
                      </dd>
                    </div>
                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">
                        Usage
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        <div className="space-y-4">
                          <div>
                            <div className="flex items-center justify-between">
                              <label className="text-sm font-medium text-gray-700">
                                Download Credits
                              </label>
                              <span className="text-sm text-gray-500">
                                {user?.credits} of{" "}
                                {user?.subscription_type === "pro" ? "5" : "1"}{" "}
                                {user?.credits === 1 ? "credit" : "credits"}{" "}
                                remaining
                              </span>
                            </div>
                            <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-primary-500 h-2 rounded-full"
                                style={{
                                  width: `${
                                    user?.subscription_type === "pro"
                                      ? (user?.credits / 5) * 100
                                      : user?.credits * 100
                                  }%`,
                                }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </dd>
                    </div>
                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">
                        Actions
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex space-x-3">
                        <Link href="/subscription">
                          <Button variant="outline">Manage Subscription</Button>
                        </Link>
                        <Link href="/subscription">
                          <Button>Buy More Credits</Button>
                        </Link>
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
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
