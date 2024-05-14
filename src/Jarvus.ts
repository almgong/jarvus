import Action from './actions/Action.ts';
import MessageBroker from "./messaging/MessageBroker.ts";
import MessageBrokerInterface from './messaging/MessageBrokerInterface.ts';

interface ActionRegistry {
  [id: string]: Action
};

interface JarvusConfig {
  messageBroker?: MessageBrokerInterface;
}

export default class Jarvus {
  actions: ActionRegistry;
  messageBroker: MessageBrokerInterface;

  constructor(config : JarvusConfig = {}) {
    this.actions = {};
    this.messageBroker = config.messageBroker || new MessageBroker();
  }

  add(action: Action, options = { override: false }) : void {
    const actionAlreadyRegistered = !!this.actions[action.id];

    if (!actionAlreadyRegistered || options.override === true) {
      this.actions[action.id] = action;
      this.messageBroker.register(action);
    } else {
      throw new Error(`Action '${action.id}' already registered.`);
    }
  }

  remove(action: Action) : void {
    delete this.actions[action.id];
    this.messageBroker.deregister(action);
  }

  send(payload: object) : void {
    this.messageBroker.broadcast(payload);
  }
}