type RootNavigation = {
  reset: (state: {
    index: number;
    routes: { name: string; params?: Record<string, unknown> }[];
  }) => void;
};

let rootNavigation: RootNavigation | null = null;
let shouldResetToWelcome = false;

export const setRootNavigation = (navigation: RootNavigation) => {
  rootNavigation = navigation;

  if (shouldResetToWelcome) {
    shouldResetToWelcome = false;
    resetToWelcome();
  }
};

export const clearRootNavigation = (navigation: RootNavigation) => {
  if (rootNavigation === navigation) {
    rootNavigation = null;
  }
};

export const resetToWelcome = () => {
  if (!rootNavigation) {
    shouldResetToWelcome = true;
    return;
  }

  rootNavigation.reset({
    index: 0,
    routes: [{ name: "WelcomeScreen" }],
  });
};
