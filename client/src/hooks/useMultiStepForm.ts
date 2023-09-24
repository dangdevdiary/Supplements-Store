import { ReactElement, useState } from 'react';

export function useMultiStepForm(steps: ReactElement[]) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  function next() {
    setCurrentStepIndex((pre) => {
      if (pre === steps.length - 1) {
        return pre;
      }
      return pre + 1;
    });
  }
  function back() {
    setCurrentStepIndex((pre) => {
      if (pre === 0) {
        return pre;
      }
      return pre - 1;
    });
  }
  function goto(index: number) {
    setCurrentStepIndex(index);
  }

  return {
    currentStepIndex,
    step: steps[currentStepIndex],
    next,
    goto,
    back,
    steps,
    isFirstStep: currentStepIndex === 0,
    isLastStep: currentStepIndex === steps.length - 1,
  };
}
