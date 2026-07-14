type QueueItem = { id: string };
type Upload<T> = (item: T, signal: AbortSignal) => Promise<void>;

export class UploadQueue<T extends QueueItem> {
  private tail = Promise.resolve();
  private controllers = new Map<string, AbortController>();

  add(items: T[], upload: Upload<T>) {
    items.forEach((item) => {
      this.cancel(item.id);

      const controller = new AbortController();
      this.controllers.set(item.id, controller);
      this.tail = this.tail
        .catch(() => undefined)
        .then(async () => {
          if (controller.signal.aborted) return;

          try {
            await upload(item, controller.signal);
          } finally {
            if (this.controllers.get(item.id) === controller) {
              this.controllers.delete(item.id);
            }
          }
        });
    });
  }

  cancel(id: string) {
    this.controllers.get(id)?.abort();
    this.controllers.delete(id);
  }

  cancelAll() {
    this.controllers.forEach((controller) => controller.abort());
    this.controllers.clear();
  }
}
