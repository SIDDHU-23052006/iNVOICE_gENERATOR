import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import Intro from "@/pages/Intro";
import Login from "@/pages/Login";
import InvoiceEditor from "@/pages/InvoiceEditor";
import Profile from "@/pages/Profile";
import Preferences from "@/pages/Preferences";

import { setAuthTokenGetter } from "@workspace/api-client-react";
import { getProfile } from "@/lib/storage";

setAuthTokenGetter(() => {
  const profile = getProfile();
  return profile?.email || null;
});

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Intro} />
      <Route path="/login" component={Login} />
      <Route path="/app/invoice" component={InvoiceEditor} />
      <Route path="/app/profile" component={Profile} />
      <Route path="/app/preferences" component={Preferences} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
