import { Switch, Route } from "wouter";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import ApiTestPage from "@/pages/api-test-page";
import CanvaPage from "@/pages/canva-page";
import { ProtectedRoute } from "./lib/protected-route";


function Router() {
  return (
    <Switch>
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/canva" component={CanvaPage} />
      <ProtectedRoute path="/api-test" component={ApiTestPage} />
      <Route component={NotFound} />
    </Switch>
  );
}
