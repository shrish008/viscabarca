import { HashRouter, Routes, Route } from "react-router-dom";
import { EventProvider } from "./context/EventContext";
import Home from "./pages/Home";
import BudgetPlanner from "./pages/BudgetPlanner";
import DressCodePlanner from "./pages/DressCodePlanner";
import DecorPlanner from "./pages/DecorPlanner";

function App() {
  return (
    <EventProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/budget" element={<BudgetPlanner />} />
          <Route path="/dress-code" element={<DressCodePlanner />} />
          <Route path="/decor" element={<DecorPlanner />} />
        </Routes>
      </HashRouter>
    </EventProvider>
  );
}

export default App;
