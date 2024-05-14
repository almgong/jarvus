import sinon from 'sinon';
import assert from 'assert';

import Jarvus from "../src/Jarvus.ts";
import DummyAction from './mocks/DummyAction.ts';
import { waitForAsync } from './helpers.ts';

describe('Jarvus integration tests', () => {
  it('should correctly maintain actions', async () => {
    const jarvus = new Jarvus();
    const action = new DummyAction('my action id');

    jarvus.add(action);

    const spy = sinon.spy(action, 'execute');

    jarvus.send({ shouldRun: true });
    await waitForAsync();

    assert(spy.calledOnceWithExactly({ shouldRun: true }));

    jarvus.send({ shouldRun: false });
    await waitForAsync();

    // still only called once; i.e. not called because shouldRun ===  false
    assert(spy.calledOnceWithExactly({ shouldRun: true }));

    jarvus.send({ shouldRun: true });
    await waitForAsync();

    assert(spy.calledTwice);

    jarvus.remove(action);
    spy.resetHistory();

    jarvus.send({ shouldRun: true });

    await waitForAsync();

    assert(spy.notCalled);
  });
});