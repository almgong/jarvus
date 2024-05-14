/**
 * Abstract class for Jarvus actions, which represent tasks to be done
 * in response to the specified payload.
 */
export default abstract class Action {
  id: string;

  constructor(id: string) {
    this.id = id;
  }

  // must be implemented by subclass
  abstract shouldRun(payload: object) : boolean;
  abstract execute(payload: object) : void;

  run(payload: object) {
    if (this.shouldRun(payload)) {
      this.execute(payload);
    }
  }
}