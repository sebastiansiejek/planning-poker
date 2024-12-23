import type {
  RoomEventHandlers,
  RoomEvents,
} from '@/features/room/lib/RoomListener/RoomListener.types';

export class RoomListener {
  public readonly unsubscribeListener: Function[] = [];

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
    data?: Parameters<RoomEventHandlers[K]>[0],
  ) {
    this.eventHandlers[event]?.forEach((handler) => handler(data as any));

    return this;
  }
}
