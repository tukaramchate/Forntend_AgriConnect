import '@testing-library/jest-dom';

// optional: mock window.matchMedia if some components expect it
if (typeof window !== 'undefined' && !window.matchMedia) {
  window.matchMedia = () => ({
    matches: false,
    addListener: () => {},
    removeListener: () => {},
  });
}
