import { Action } from "../../src/index.ts";

export default class DummyAction extends Action{
  shouldRun(payload: { shouldRun: boolean }): boolean {
    return payload.shouldRun === undefined ? true : payload.shouldRun;
  }

  execute(_payload: { shouldRun: boolean }): void {}
}