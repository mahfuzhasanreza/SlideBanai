import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import DashboardPage from "@/pages/dashboard-page";
import PresentationsPage from "@/pages/presentations-page";
import EditorPage from "@/pages/editor-page";
import CoachPage from "@/pages/coach-page";
import SubscriptionPage from "@/pages/subscription-page";
import ApiTestPage from "@/pages/api-test-page";
import OcrTestPage from "@/pages/ocr-test-page";
import CanvaPage from "@/pages/canva-page";
import { ProtectedRoute } from "./lib/protected-route";
import { AuthProvider } from "./hooks/use-auth";

function Router() {
  return (
    <Switch>
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/" component={DashboardPage} />
      <ProtectedRoute path="/presentations" component={PresentationsPage} />
      <ProtectedRoute path="/presentations/:id" component={EditorPage} />
      <ProtectedRoute path="/editor/:id" component={EditorPage} />
      <ProtectedRoute path="/editor" component={EditorPage} />
      <ProtectedRoute path="/coach" component={CoachPage} />
      <ProtectedRoute path="/subscription" component={SubscriptionPage} />
      <ProtectedRoute path="/canva" component={CanvaPage} />
      <ProtectedRoute path="/api-test" component={ApiTestPage} />
      <ProtectedRoute path="/ocr-test" component={OcrTestPage} />
      <Route component={NotFound} />
    </Switch>
  );
}


function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
