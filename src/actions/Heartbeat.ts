import Action from "./Action.ts";

interface HeartbeatPayload {
  heartbeat?: boolean;
};

/**
 * Example action
 */
export default class Heartbeat extends Action {
  // For demo purposes.
  //
  // More likely than not, you will want each Action
  // instance to have a distinct ID for traceability.
  constructor(id?: string) {
    super(id || 'heatbeat');
  }

  shouldRun(payload: HeartbeatPayload): boolean {
    return payload.heartbeat === true;
  }

  execute(payload: HeartbeatPayload): void {
    console.log('I am alive!', payload);
  }
}