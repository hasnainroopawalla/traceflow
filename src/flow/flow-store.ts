import { Flow } from "./flow";

class FlowStoreFactory {
  private flows: Flow[];

  constructor() {
    this.flows = [];
  }

  // exported for testing
  public destroyAllFlows(): void {
    this.flows = [];
  }

  /**
   * Creates a new Flow and adds it to the FlowStore.
   * @remarks
   * Each Flow has a unique generated ID.
   * @param flowName - The name of the Flow/scenario
   * @param timeoutInMs - The timeout in milliseconds after which the Flow automatically times out
   * @returns The created Flow object
   */
  public newFlow(flowName: string, timeoutInMs: number): Flow {
    const flow = new Flow(flowName, timeoutInMs);
    this.flows.push(flow);
    return flow;
  }

  /**
   * Finds a currently active Flow by its name.
   *
   * @remarks
   * If there are multiple active Flows with the same name
   * @param flowName - The name of the Flow/scenario
   * @param timeoutInMs - The timeout in milliseconds after which the Flow automatically times out
   * @returns The Flow object if it exists and is active
   */
  public findFlowByName(flowName: string): Flow | undefined {
    return this.flows.find((flow) => flow.isActive && flow.name === flowName);
  }

  /**
   * Finds a currently active Flow by its ID.
   *
   * @param flowId - The ID of the Flo2w/scenario
   * @returns The Flow object if it exists and is active
   */
  public findFlowById(flowId: string): Flow | undefined {
    return this.flows.find((flow) => flow.isActive && flow.id === flowId);
  }
}

// exports a singleton instance of the FlowStore.
export const FlowStore = new FlowStoreFactory();
