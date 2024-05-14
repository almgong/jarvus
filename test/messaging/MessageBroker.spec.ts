import assert from 'assert';
import ps from 'pubsub-js';
import sinon from 'sinon';

import MessageBroker from '../../src/messaging/MessageBroker.ts';
import { waitForAsync } from '../helpers.ts';
import DummyAction from '../mocks/DummyAction.ts';


describe('MessageBroker', () => {
  let testSubscriberToken : string;
  let testSubscriberSpy : sinon.SinonSpy;

  beforeEach(() => {
    testSubscriberSpy = sinon.spy();
    testSubscriberToken = ps.subscribe(MessageBroker.CHANNEL, testSubscriberSpy);
  });

  afterEach(() => {
    ps.unsubscribe(testSubscriberToken);
  });

  describe('#constructor', () => {
    it('should assign the correct defaults', () => {
      const broker = new MessageBroker();

      assert.strictEqual(broker.pubsub, ps);
      assert.deepStrictEqual(broker.subscriberTokens, {});
    });
  });

  describe('#broadcast', () => {
    it('should broadcast the specified payload to the appropriate channel', async () => {
      const broker = new MessageBroker();

      broker.broadcast({ data: 'my payload' });

      await waitForAsync();

      assert(testSubscriberSpy.calledOnceWithExactly(MessageBroker.CHANNEL, { data: 'my payload' }));
    });
  });

  describe('#register', () => {
    it('should add a subscriber for the specified action', async () => {
      const broker = new MessageBroker();
      const action = new DummyAction('test #register');

      broker.register(action);

      assert(broker.subscriberTokens[action.id]);

      const spy = sinon.spy(action, 'execute');
      broker.broadcast({ should: 'execute' });

      await waitForAsync();

      assert(spy.calledOnce);
    });

    it('should replace subscriber if the action is already registered (by ID)', () => {
      const broker = new MessageBroker();
      const action = new DummyAction('test #register');

      broker.register(action);

      const subscriberToken = broker.subscriberTokens[action.id];

      const duplicateAction = new DummyAction('test #register');
      duplicateAction.id = action.id;

      broker.register(duplicateAction); // register action with same ID
      assert.notStrictEqual(subscriberToken, broker.subscriberTokens[duplicateAction.id]);
    });
  });

  describe('#deregister', () => {
    it('should unsubscribe the specified action and remove it from the lookup', async () => {
      const broker = new MessageBroker();
      const action = new DummyAction('test #deregister');

      broker.register(action);

      assert(broker.subscriberTokens[action.id]);

      broker.deregister(action);

      assert.strictEqual(broker.subscriberTokens[action.id], undefined);

      const spy = sinon.spy(action, 'execute');
      broker.broadcast({ should: 'not execute'});

      await waitForAsync();

      assert(spy.notCalled);
    });

    it('should gracefully handle deregistering non-registered actions', () => {
      const broker = new MessageBroker();
      const action = new DummyAction('test #deregister');

      broker.deregister(action);
    });
  });
});