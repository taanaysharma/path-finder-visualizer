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
    if (!generatorRef.current) return;

    if (currentIndex < history.length - 1) {
      setCurrentIndex(prev => prev + 1);
      return;
    }

    if (isFinished) return;

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

  // Jump to an arbitrary step index, expanding history by draining the
  // generator forward if the target hasn't been computed yet.
  const jumpToStep = useCallback((targetIndex) => {
    if (!generatorRef.current) return;
    setIsPlaying(false);

    if (targetIndex <= history.length - 1) {
      setCurrentIndex(Math.max(0, targetIndex));
      return;
    }

    // Compute the new history array imperatively (NOT inside a setState
    // updater) since draining the generator is a side effect — StrictMode
    // double-invokes updater functions in dev, which would drain it twice.
    const next = [...history];
    let reachedEnd = false;
    while (next.length - 1 < targetIndex && !reachedEnd) {
      const result = generatorRef.current.next();
      if (result.done) { reachedEnd = true; break; }
      next.push(result.value);
    }
    if (reachedEnd) setIsFinished(true);
    setHistory(next);
    setCurrentIndex(Math.min(targetIndex, next.length - 1));
  }, [history]);

  // Eagerly drains the entire generator so the full step count is known
  // up front (used to render the scrubber timeline with a fixed length).
  const runToCompletion = useCallback(() => {
    if (!generatorRef.current) return;
    const next = [...history];
    let result;
    let guard = 0;
    do {
      result = generatorRef.current.next();
      if (!result.done) next.push(result.value);
      guard++;
    } while (!result.done && guard < 200000);
    setHistory(next);
    setIsFinished(true);
  }, [history]);

  const play = useCallback(() => {
    // Allow play whenever there's more to show: either history ahead of the
    // cursor (replay) or the generator itself isn't exhausted yet.
    const hasMoreHistory = currentIndex < history.length - 1;
    if (hasMoreHistory || !isFinished) setIsPlaying(true);
  }, [isFinished, currentIndex, history.length]);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  // --- Auto-Play Effect ---
  useEffect(() => {
    if (!isPlaying) return;
    const atVeryEnd = isFinished && currentIndex >= history.length - 1;
    if (atVeryEnd) {
      setIsPlaying(false);
      return;
    }
    timerRef.current = setTimeout(() => {
      stepForward();
    }, speed);
    return () => clearTimeout(timerRef.current);
  }, [isPlaying, isFinished, currentIndex, history.length, speed, stepForward]);

  return {
    currentState,
    currentIndex,
    totalSteps: history.length,
    isPlaying,
    isFinished,
    speed,
    setSpeed,
    loadAlgorithm,
    play,
    pause,
    stepForward,
    stepBackward,
    jumpToStep,
    runToCompletion,
  };
}
