import type {
  RoomEventHandlers,
  RoomEvents,
} from '@/features/room/lib/RoomListener/room-listener.types';

export class RoomListener {
  public readonly unsubscribeListener: Array<() => void> = [];

  protected eventHandlers: Partial<{
    [K in RoomEvents]: Array<RoomEventHandlers[K]>;
  }> = {};

  public on<K extends RoomEvents>(
    event: K,
    handler: RoomEventHandlers[K],
  ): this {
    if (!this.eventHandlers[event]) {
      this.eventHandlers[event] = [];
    }

    this.eventHandlers[event].push(handler);

    return this;
  }

  protected emit<K extends RoomEvents>(
    event: K,
    ...arguments_: Parameters<RoomEventHandlers[K]>
  ) {
    const handlers = this.eventHandlers[event] as
      | Array<(...args: Parameters<RoomEventHandlers[K]>) => void>
      | undefined;

    for (const handler of handlers ?? []) {
      handler(...arguments_);
    }

    return this;
  }
}
