import React, { createContext, useContext, useState } from "react";
import { Audio } from "expo-av";

type RecordingContextType = {
  recording: Audio.Recording | null;
  setRecord: (recording: Audio.Recording | null) => void;
};

const RecordingContext = createContext<RecordingContextType | undefined>(undefined);

export const RecordingProvider = ({ children }: { children: React.ReactNode }) => {
  const [recording, setRecord] = useState<Audio.Recording | null>(null);

  return (
    <RecordingContext.Provider value={{ recording, setRecord }}>
      {children}
    </RecordingContext.Provider>
  );
};

export const useRecording = () => {
  const context = useContext(RecordingContext);
  if (!context) {
    throw new Error("useRecording must be used within a RecordingProvider");
  }
  return context;
};
