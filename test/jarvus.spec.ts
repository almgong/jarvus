import assert from 'assert';
import sinon from 'sinon';

import Jarvus from "../src/Jarvus.ts";
import MessageBrokerInterface from '../src/messaging/MessageBrokerInterface.ts';
import DummyAction from './mocks/DummyAction.ts';

describe('Jarvus', () => {
  let dummyMessageBroker : MessageBrokerInterface;

  beforeEach(() => {
    dummyMessageBroker = {
      broadcast: sinon.spy(),
      register: sinon.spy(),
      deregister: sinon.spy()
    };
  });

  describe('#add', () => {
    it('should add the specified action to the registry', () => {
      const j = new Jarvus({ messageBroker: dummyMessageBroker });
      const action = new DummyAction('test #add');

      j.add(action);

      assert(j.actions[action.id]);
    });

    it('should register the action to the message broker', () => {
      const j = new Jarvus({ messageBroker: dummyMessageBroker });
      const action = new DummyAction('test #add');

      j.add(action);

      assert((dummyMessageBroker.register as sinon.SinonSpy).calledOnceWithExactly(action));
    });

    it('should throw an error if the action is already registered (by ID)', () => {
      const j = new Jarvus({ messageBroker: dummyMessageBroker });
      const action = new DummyAction('test #add');

      j.add(action);

      assert.throws(
        () => {
          j.add(action);
        },
        {
          message: 'Action \'test #add\' already registered.'
        }
      );
    });
  });

  describe('#remove', () => {
    it('should remove the action from the registry', () => {
      const j = new Jarvus({ messageBroker: dummyMessageBroker });
      const action = new DummyAction('test #remove');

      j.add(action);

      assert(j.actions[action.id]);

      j.remove(action);

      assert.strictEqual(j.actions[action.id], undefined);
    });

    it('should deregister the action from the message broker', () => {
      const j = new Jarvus({ messageBroker: dummyMessageBroker });
      const action = new DummyAction('test #remove');

      j.add(action);
      j.remove(action);

      assert((dummyMessageBroker.deregister as sinon.SinonSpy).calledOnceWithExactly(action));
    });
  });

  describe('#send', () => {
    it('should broadcast the specified payload via the message broker', () => {
      const j = new Jarvus({ messageBroker: dummyMessageBroker });

      j.send({ my: 'data' });

      assert((dummyMessageBroker.broadcast as sinon.SinonSpy).calledOnceWithExactly({ my: 'data' }));
    });
  });
});