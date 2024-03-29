import { Flow } from "./flow";
import type { IFlowStore } from "./flow-store.interface";

class FlowStoreFactory implements IFlowStore {
  private flows: Flow[];

  constructor() {
    this.flows = [];
  }

  public destroyAllFlows() {
    this.flows = [];
  }

  public newFlow(flowName: string, timeoutInMs: number) {
    const flow = new Flow(flowName, timeoutInMs);
    this.flows.push(flow);
    return flow;
  }

  public findFlowByName(flowName: string) {
    return this.flows.findLast(
      (flow) => flow.isActive && flow.name === flowName
    );
  }

  public findFlowById(flowId: string) {
    return this.flows.find((flow) => flow.isActive && flow.id === flowId);
  }
}

// Exports a singleton instance of the FlowStore.
export const FlowStore: IFlowStore = new FlowStoreFactory();
