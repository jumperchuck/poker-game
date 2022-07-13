export type EventListener = (...args: any[]) => void;

export class EventEmitter {
  listeners: Record<string, Set<EventListener>> = {};

  addListener(event: string, listener: EventListener) {
    if (!this.listeners[event]) {
      this.listeners[event] = new Set<EventListener>();
    }
    this.listeners[event].add(listener);
  }

  removeListener(event: string, listener: EventListener) {
    this.listeners[event]?.delete(listener);
  }

  removeAllListeners(event: string) {
    this.listeners[event]?.clear();
  }

  emit(event: string, ...data: any[]) {
    this.listeners[event]?.forEach((listener) => listener(...data));
  }

  on(event: string, listener: EventListener) {
    this.addListener(event, listener);
  }

  once(event: string, listener: EventListener) {
    const handle = (...data: any[]) => {
      this.removeListener(event, listener);
      listener(...data);
    };
    this.addListener(event, handle);
  }
}
