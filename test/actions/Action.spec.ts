import sinon from "sinon";
import assert from 'assert';

import DummyAction from "../mocks/DummyAction.ts";

describe('Action', () => {
  describe('constructor', () => {
    it('should assign the specified action id', () => {
      const action = new DummyAction('some ID');
      assert.strictEqual(action.id, 'some ID');
    });
  });

  describe('#run', () => {
    it('should execute if shouldRun returns true', () => {
      const action = new DummyAction('Action test');
      const spy = sinon.spy(action, 'execute');

      action.run({ shouldRun: true });

      assert(spy.called);
    });

    it('should not execute if shouldRun returns false', () => {
      const action = new DummyAction('Action test');
      const spy = sinon.spy(action, 'execute');

      action.run({ shouldRun: false });

      assert(spy.notCalled);
    });
  });
});