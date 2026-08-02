import { Suspense, lazy } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import { EventProvider } from "./context/EventContext";
import Home from "./pages/Home";

const BudgetPlanner = lazy(() => import("./pages/BudgetPlanner"));
const DressCodePlanner = lazy(() => import("./pages/DressCodePlanner"));
const DecorPlanner = lazy(() => import("./pages/DecorPlanner"));

function RouteFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream">
      <div className="w-9 h-9 rounded-full border-2 border-gold border-t-transparent animate-spin" />
    </div>
  );
}

function App() {
  return (
    <EventProvider>
      <HashRouter>
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/budget" element={<BudgetPlanner />} />
            <Route path="/dress-code" element={<DressCodePlanner />} />
            <Route path="/decor" element={<DecorPlanner />} />
          </Routes>
        </Suspense>
      </HashRouter>
    </EventProvider>
  );
}

export default App;
