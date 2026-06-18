import { useState, useRef, useCallback, useEffect } from 'react';

export function useEngine() {
  const [history, setHistory] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(500); 
  const [isFinished, setIsFinished] = useState(false);

  const generatorRef = useRef(null); 
  const timerRef = useRef(null);     

  const currentState = currentIndex >= 0 ? history[currentIndex] : null;

  // --- Core Engine Functions ---
  const loadAlgorithm = useCallback((generatorFunction, ...args) => {
    // We use setIsPlaying directly here instead of pause() to completely 
    // eliminate any Temporal Dead Zone (TDZ) or minification bugs in production.
    setIsPlaying(false); 
    
    const newGenerator = generatorFunction(...args);
    generatorRef.current = newGenerator;
    
    // Manually execute the 0th step to prevent stale closure crashes
    const { value, done } = newGenerator.next();
    
    if (done) {
      setHistory([]);
      setCurrentIndex(-1);
      setIsFinished(true);
    } else {
      setHistory([value]);
      setCurrentIndex(0);
      setIsFinished(false);
    }
  }, []); // Clean dependency array!

  const stepForward = useCallback(() => {
    if (!generatorRef.current || isFinished) return;

    if (currentIndex < history.length - 1) {
      setCurrentIndex(prev => prev + 1);
      return;
    }

    const { value, done } = generatorRef.current.next();

    if (done) {
      setIsFinished(true);
      setIsPlaying(false);
    } else {
      setHistory(prev => [...prev, value]);
      setCurrentIndex(prev => prev + 1);
    }
  }, [currentIndex, history.length, isFinished]);

  const stepBackward = useCallback(() => {
    setIsPlaying(false);
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
  useEffect(() => {
    if (isPlaying && !isFinished) {
      timerRef.current = setTimeout(() => {
        stepForward();
      }, speed);
    }
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
