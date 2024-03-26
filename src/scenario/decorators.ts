import type { Scenario } from "./scenario";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MethodType<T> = (...args: any[]) => T;

const createDecorator =
  <C>(
    _decoratorMethod: (
      thisInstance: C,
      originalMethod: MethodType<void>
    ) => void
  ) =>
  <T extends MethodType<void>>(
    originalMethod: T,
    _context: ClassMethodDecoratorContext<C, T> & {
      private: false;
      static: false;
    }
  ) =>
    function (this: C, ...args: Parameters<T>) {
      _decoratorMethod(this, () => originalMethod.call(this, ...args));
    };

export const terminalStep = createDecorator<Scenario>(
  (scenario, originalMethod) => {
    const result = originalMethod();
    scenario.cleanupOnTermination();
    return result;
  }
);

export const ifActive = createDecorator<Scenario>(
  (scenario, originalMethod) => {
    if (!scenario.isActive) {
      return;
    }
    return originalMethod();
  }
);
