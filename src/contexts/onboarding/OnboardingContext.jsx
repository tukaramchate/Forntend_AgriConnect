import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
} from 'react';

// Onboarding action types
const ACTIONS = {
  START_ONBOARDING: 'START_ONBOARDING',
  COMPLETE_ONBOARDING: 'COMPLETE_ONBOARDING',
  SKIP_ONBOARDING: 'SKIP_ONBOARDING',
  SET_CURRENT_STEP: 'SET_CURRENT_STEP',
  SET_ONBOARDING_TYPE: 'SET_ONBOARDING_TYPE',
  RESET_ONBOARDING: 'RESET_ONBOARDING',
  UPDATE_PROGRESS: 'UPDATE_PROGRESS',
  SET_USER_PREFERENCES: 'SET_USER_PREFERENCES',
};

// Onboarding types for different user roles
const ONBOARDING_TYPES = {
  CUSTOMER: 'customer',
  FARMER: 'farmer',
  ADMIN: 'admin',
  FIRST_TIME: 'first_time',
};

// Initial state
const initialState = {
  isActive: false,
  currentStep: 0,
  totalSteps: 0,
  onboardingType: null,
  completedOnboardings: [], // Track which onboardings have been completed
  userPreferences: {
    showTooltips: true,
    autoAdvance: false,
    skipAnimations: false,
  },
  progress: {},
  lastCompletedStep: -1,
};

// Onboarding reducer
function onboardingReducer(state, action) {
  switch (action.type) {
    case ACTIONS.START_ONBOARDING:
      return {
        ...state,
        isActive: true,
        currentStep: 0,
        onboardingType: action.payload.type,
        totalSteps: action.payload.totalSteps || 1,
        lastCompletedStep: -1,
      };

    case ACTIONS.COMPLETE_ONBOARDING:
      return {
        ...state,
        isActive: false,
        completedOnboardings: [
          ...state.completedOnboardings.filter(
            (type) => type !== state.onboardingType
          ),
          state.onboardingType,
        ],
        progress: {
          ...state.progress,
          [state.onboardingType]: {
            completed: true,
            completedAt: new Date().toISOString(),
            totalSteps: state.totalSteps,
          },
        },
      };

    case ACTIONS.SKIP_ONBOARDING:
      return {
        ...state,
        isActive: false,
        progress: {
          ...state.progress,
          [state.onboardingType]: {
            skipped: true,
            skippedAt: new Date().toISOString(),
            skippedAtStep: state.currentStep,
          },
        },
      };

    case ACTIONS.SET_CURRENT_STEP:
      return {
        ...state,
        currentStep: action.payload,
        lastCompletedStep: Math.max(
          state.lastCompletedStep,
          action.payload - 1
        ),
      };

    case ACTIONS.SET_ONBOARDING_TYPE:
      return {
        ...state,
        onboardingType: action.payload,
      };

    case ACTIONS.RESET_ONBOARDING:
      return {
        ...initialState,
        completedOnboardings: state.completedOnboardings,
        userPreferences: state.userPreferences,
      };

    case ACTIONS.UPDATE_PROGRESS:
      return {
        ...state,
        progress: {
          ...state.progress,
          [action.payload.type]: {
            ...state.progress[action.payload.type],
            ...action.payload.data,
          },
        },
      };

    case ACTIONS.SET_USER_PREFERENCES:
      return {
        ...state,
        userPreferences: {
          ...state.userPreferences,
          ...action.payload,
        },
      };

    default:
      return state;
  }
}

// Context
const OnboardingContext = createContext(null);

// Provider component
export const OnboardingProvider = ({ children }) => {
  const [state, dispatch] = useReducer(onboardingReducer, initialState);

  // Start onboarding flow
  const startOnboarding = useCallback((type, totalSteps = 1) => {
    dispatch({
      type: ACTIONS.START_ONBOARDING,
      payload: { type, totalSteps },
    });
  }, []);

  // Complete onboarding
  const completeOnboarding = useCallback(() => {
    dispatch({ type: ACTIONS.COMPLETE_ONBOARDING });
  }, []);

  // Skip onboarding
  const skipOnboarding = useCallback(() => {
    dispatch({ type: ACTIONS.SKIP_ONBOARDING });
  }, []);

  // Navigate to specific step
  const goToStep = useCallback((step) => {
    dispatch({ type: ACTIONS.SET_CURRENT_STEP, payload: step });
  }, []);

  // Go to next step
  const nextStep = useCallback(() => {
    if (state.currentStep < state.totalSteps - 1) {
      dispatch({
        type: ACTIONS.SET_CURRENT_STEP,
        payload: state.currentStep + 1,
      });
      return true;
    }
    return false;
  }, [state.currentStep, state.totalSteps]);

  // Go to previous step
  const previousStep = useCallback(() => {
    if (state.currentStep > 0) {
      dispatch({
        type: ACTIONS.SET_CURRENT_STEP,
        payload: state.currentStep - 1,
      });
      return true;
    }
    return false;
  }, [state.currentStep]);

  // Reset onboarding state
  const resetOnboarding = useCallback(() => {
    dispatch({ type: ACTIONS.RESET_ONBOARDING });
  }, []);

  // Update progress for specific onboarding
  const updateProgress = useCallback((type, data) => {
    dispatch({
      type: ACTIONS.UPDATE_PROGRESS,
      payload: { type, data },
    });
  }, []);

  // Set user preferences
  const setUserPreferences = useCallback((preferences) => {
    dispatch({ type: ACTIONS.SET_USER_PREFERENCES, payload: preferences });
  }, []);

  // Check if onboarding has been completed
  const isOnboardingCompleted = useCallback(
    (type) => {
      return state.completedOnboardings.includes(type);
    },
    [state.completedOnboardings]
  );

  // Check if onboarding should be shown
  const shouldShowOnboarding = useCallback(
    (type) => {
      return !isOnboardingCompleted(type) && !state.progress[type]?.skipped;
    },
    [isOnboardingCompleted, state.progress]
  );

  // Get onboarding progress
  const getProgress = useCallback(
    (type) => {
      return state.progress[type] || null;
    },
    [state.progress]
  );

  const value = {
    // State
    ...state,

    // Actions
    startOnboarding,
    completeOnboarding,
    skipOnboarding,
    goToStep,
    nextStep,
    previousStep,
    resetOnboarding,
    updateProgress,
    setUserPreferences,

    // Helpers
    isOnboardingCompleted,
    shouldShowOnboarding,
    getProgress,

    // Constants
    ONBOARDING_TYPES,
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
};

// Hook to use onboarding
export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};

// Export context for advanced usage
export { OnboardingContext, ONBOARDING_TYPES };
