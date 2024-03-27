import * as React from "react";
import { ScenarioStore } from "./scenario-store";

type IScenarioStoreContext = {
  scenarioStore: ScenarioStore;
};

const ScenarioStoreContext = React.createContext<IScenarioStoreContext>(
  {} as IScenarioStoreContext
);

export const ScenarioStoreProvider: React.FC<React.PropsWithChildren> = (
  props
) => {
  const { children } = props;

  const scenarioStore = React.useMemo(() => ScenarioStore.getInstance(), []);

  const value = React.useMemo(() => ({ scenarioStore }), [scenarioStore]);

  return (
    <ScenarioStoreContext.Provider value={value}>
      {children}
    </ScenarioStoreContext.Provider>
  );
};

export const useScenarioStore = (): ScenarioStore => {
  const { scenarioStore } = React.useContext(ScenarioStoreContext);
  return scenarioStore;
};
