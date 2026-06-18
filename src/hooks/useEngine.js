import { useState, useRef, useCallback, useEffect } from 'react';

export function useEngine() {
  // --- State Management ---
  // We store the history of all yielded steps so we can easily "Step Backward"
  const [history, setHistory] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(500); // execution speed in milliseconds
  const [isFinished, setIsFinished] = useState(false);

  // --- Refs ---
  const generatorRef = useRef(null); // Holds the active generator instance
  const timerRef = useRef(null);     // Holds the auto-play timer

  // The current state to render in the UI
  const currentState = currentIndex >= 0 ? history[currentIndex] : null;

  // --- Core Engine Functions ---
  const loadAlgorithm = useCallback((generatorFunction, ...args) => {
    pause(); // Stop any currently running algorithm
    
    // Initialize the new generator
    const newGenerator = generatorFunction(...args);
    generatorRef.current = newGenerator;
    
    // Manually execute the 0th step (initial state) right now
    // This bypasses the stale closure variables inside stepForward
    const { value, done } = newGenerator.next();
    
    if (done) {
      setHistory([]);
      setCurrentIndex(-1);
      setIsFinished(true);
    } else {
      setHistory([value]); // Directly set the first frame
      setCurrentIndex(0);
      setIsFinished(false);
    }
  }, [pause]);

  const stepForward = useCallback(() => {
    if (!generatorRef.current || isFinished) return;

    // If we are reviewing history, just move the index forward
    if (currentIndex < history.length - 1) {
      setCurrentIndex(prev => prev + 1);
      return;
    }

    // Otherwise, calculate the next step using the generator
    const { value, done } = generatorRef.current.next();

    if (done) {
      setIsFinished(true);
      setIsPlaying(false);
    } else {
      // Save the new state frame to history
      setHistory(prev => [...prev, value]);
      setCurrentIndex(prev => prev + 1);
    }
  }, [currentIndex, history.length, isFinished]);

  const stepBackward = useCallback(() => {
    pause();
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  }, [currentIndex]);

  const play = useCallback(() => {
    if (!isFinished) setIsPlaying(true);
  }, [isFinished]);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  // --- Auto-Play Effect ---
  // This handles the "speed control" feature requested in your specs
  useEffect(() => {
    if (isPlaying && !isFinished) {
      timerRef.current = setTimeout(() => {
        stepForward();
      }, speed);
    }

    // Cleanup timer on unmount or when dependencies change
    return () => clearTimeout(timerRef.current);
  }, [isPlaying, isFinished, speed, stepForward]);

  return {
    currentState,
    isPlaying,
    isFinished,
    speed,
    setSpeed,
    loadAlgorithm,
    play,
    pause,
    stepForward,
    stepBackward,
  };
}