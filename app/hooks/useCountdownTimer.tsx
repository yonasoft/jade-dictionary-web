import { useState, useEffect } from "react";

const useCountdownTimer = (
  initialValue: number,
  onTimeout: () => void
): [number, React.Dispatch<React.SetStateAction<number>>] => {
  const [secondsLeft, setSecondsLeft] = useState(initialValue);

  useEffect(() => {
    let intervalId: number | undefined;

    if (secondsLeft > 0) {
      intervalId = window.setInterval(() => {
        setSecondsLeft((seconds) => seconds - 1);
      }, 1000);
    } else if (secondsLeft === 0) {
      onTimeout();
    }

    return () => {
      if (intervalId !== undefined) clearInterval(intervalId);
    };
  }, [secondsLeft, onTimeout]);

  return [secondsLeft, setSecondsLeft];
};

export default useCountdownTimer;
