import ps from 'pubsub-js';

import Action from '../actions/Action.ts';

/**
 * Mediates communication between Jarvus and registered actions. Currently one-way.
 */
export default class MessageBroker {
  static CHANNEL = 'JARVUS-CHANNEL';

  pubsub: typeof ps;
  subscriberTokens: { [actionId: string]: string };

  constructor() {
    this.pubsub = ps;
    this.subscriberTokens = {};
  }

  broadcast(payload: object): void {
    this.pubsub.publish(MessageBroker.CHANNEL, payload);
  }

  register(action: Action) {
    this.deregister(action);

    this.subscriberTokens[action.id] = this.pubsub.subscribe(MessageBroker.CHANNEL, (_message, data) => action.run(data));
  }

  deregister(action: Action) {
    if (this.actionIsRegistered(action)) {
      this.pubsub.unsubscribe(this.subscriberTokens[action.id]);
      delete this.subscriberTokens[action.id];
    }
  }

  private actionIsRegistered(action: Action) : boolean {
    return !!this.subscriberTokens[action.id];
  }
}