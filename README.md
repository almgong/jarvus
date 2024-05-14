# Jarvus

Small (just over 1kb) package for executing arbitrary actions (operations, work) based on specified data. Work is done asynchronously and in a decentralized fashion.

## Installation

```
npm install @almgong/jarvus
```

## Usage

All work-to-do is represented by Action classes in Jarvus. After defining such a class, one simply needs to `#add` an instance of the action to Jarvus' registry.

Let's go through a real(ish) world example.

We have an ML model that returns text content based on some input. When the model returns 'car', we want to log a car result; when the model returns 'bicycle', we want to log a bicycle result instead.

Our car-`Action` class

```
import { Action } from '@almgong/jarvus';

class CarFoundAction extends Action {
  shouldRun(payload) {
    payload.text === 'car';
  }

  execute(payload) {
    MyLoggerService.notify(
      { type: 'vehicle/car', originalImg: payload.imgUrl }
    );
  }
}
```

and for more flavor, our bicycle-`Action` class

```
import { Action } from '@almgong/jarvus';

class BicycleFoundAction extends Action {
  shouldRun(payload) {
    // our model is not quite as accurate when it comes to
    // detecting bikes
    payload.text === 'bicycle' && payload.confidence > 0.98;
  }

  execute(payload) {
    MyLoggerService.notify(
      {
        type: 'vehicle/bicycle',
        originalImg: payload.imgUrl,
        confidence: payload.confidence
      }
    );
  }
}
```

And to wire it all up

```
import Jarvus from '@almgong/jarvus';

const jarvus = new Jarvus();
jarvus.add(new CarFoundAction('cars'));
jarvus.add(new BicycleFoundAction('bicycles));

...

jarvus.send({ text: 'car', confidence: .82, imgUrl: '...' }); // executes our car action

jarvus.send({ text: 'bicycle', confidence: .82, imgUrl: '...' }); // does not execute any action
jarvus.send({ text: 'bicycle', confidence: .91, imgUrl: '...' }); // executes our bicycle action
```

## Actions

`Action` subclasses must define two methods:

`shouldRun(payload: object) : boolean` - whether the action should run

`execute(payload: object) : void` - what the action should do if it should run

The `payload` object in both methods will be the same for any given `Action`, and but can be customized across `Action`s.

All `Action` instances must have a unique identifier, specified on instantiation. This helps guard against duplicate registrations and provides a path for debugging and metric gathering.

## Jarvus API

The `Jarvus` class exposes three public methods:

`add(action: Action) : void` - add the action to the registry

`remove(action: Action) : void` - remove the action from the registry

`send(payload: object) : void` - dispatch an arbitrary payload and let actions determine if they need to run

## License

MIT
