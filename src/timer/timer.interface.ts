export type ITimerMarker = {
  timestamp: number;
  delta: number;
};

export type IPauseInfo =
  | { isPaused: false; resumedAt: number }
  | {
      isPaused: true;
      pausedAt: number;
    };
