import Action from "../actions/Action.ts";

/**
 * Contract for Jarvus' internal message broker
 */
export default interface MessageBrokerInterface {
  broadcast: (payload: object) => void;
  register: (action: Action) => void;
  deregister: (action: Action) => void;
}