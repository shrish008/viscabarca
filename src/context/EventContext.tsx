import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { DEFAULT_EVENT_STATE, type EventState } from "../types";

interface EventContextValue {
  event: EventState;
  updateEvent: (patch: Partial<EventState>) => void;
  resetEvent: () => void;
}

const EventContext = createContext<EventContextValue | null>(null);

export function EventProvider({ children }: { children: ReactNode }) {
  const [event, setEvent] = useState<EventState>(DEFAULT_EVENT_STATE);

  const value = useMemo<EventContextValue>(
    () => ({
      event,
      updateEvent: (patch) => setEvent((prev) => ({ ...prev, ...patch })),
      resetEvent: () => setEvent(DEFAULT_EVENT_STATE),
    }),
    [event],
  );

  return <EventContext.Provider value={value}>{children}</EventContext.Provider>;
}

export function useEvent() {
  const ctx = useContext(EventContext);
  if (!ctx) throw new Error("useEvent must be used within EventProvider");
  return ctx;
}
