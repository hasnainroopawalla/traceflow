import { Flow } from "./flow";

export type IFlowStore = {
  /**
   * Creates a new Flow and adds it to the FlowStore.
   * @remarks
   * Each Flow has a unique generated ID.
   * @param flowName - The name of the Flow/scenario
   * @param timeoutInMs - The timeout in milliseconds after which the Flow automatically times out
   * @returns The created Flow object
   */
  newFlow: (flowName: string, timeoutInMs: number) => Flow;

  /**
   * Finds a currently active Flow by its name.
   *
   * @remarks
   * Returns the most recent Flow if there are multiple active Flows with the same name
   * @param flowName - The name of the Flow/scenario
   * @param timeoutInMs - The timeout in milliseconds after which the Flow automatically times out
   * @returns The Flow object if it exists and is active
   */
  findFlowByName: (flowName: string) => Flow | undefined;

  /**
   * Finds a currently active Flow by its ID.
   *
   * @param flowId - The ID of the Flow/scenario
   * @returns The Flow object if it exists and is active
   */
  findFlowById: (flowId: string) => Flow | undefined;

  // Exported only for testing
  destroyAllFlows: () => void;
};
