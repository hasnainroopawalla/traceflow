# trackflow 📈

`trackflow` is a lightweight package to track scenarios in an app using telemetry markers.

## 💡 Example scenario

Assume we have an app where we need to track the submit button scenario.

`SubmitButton` React component:

```javascript
import * as React from "react";

const SubmitButton: React.FC = () => {

  const onSubmit = () => {
    // start the submit_button_click Flow with a timeout of 5000 ms
    const flow = FlowStore.newFlow("submit_button_click", 5000);
    fetchApi(flow);
  } 

  return (
    <button onClick={onSubmit}>Submit</button>
  );
}
```

In the above snippet, we start the Flow when the button is clicked. Lets continue to track this `Flow` in the `fetchApi()` method:

```javascript
import { Flow } from "trackflow";

// method that makes a network request on submit button click
const fetchApi = (flow: Flow) => {
  const url = "https://restcountries.com/v3.1/independent?status=true";

  // add some useful data to the Flow
  flow.addFlowData({
    url,
    requestType: "GET"
  });

  fetch(url)
    .then(res => {
      // mark the successful network request
      flow.mark("api_fetch_complete");

      parseResponse(res);

      // mark the parsing completed step with some step data
      flow.mark("response_parsed", {
        parseType: 2,
      });

      render(parsedResponse);

      // stop the Flow after the response has been rendered
      flow.stop({
        reason: "response rendered",
      });
    })
    .catch(error => {
      // fail the Flow if the network request throws an error
      flow.fail({
        reason: error,
      });
    });
};
```

Lets take a deeper look at the completed Flow using `flow.info()`:
```yaml
{
  id: "082d691f-40a3-4821-b538-a47b6b07b119",
  name: "submit_button_click",
  stepCount: 4,
  data: {
    url: "https://restcountries.com/v3.1/independent?status=true",
    requestType: "GET"
  },
  delta: 3200,
  startedAt: 1711788835295,
  finishedAt: 1711788838495,
  status: "success",
  steps: [
    {
      step: "start",
      timestamp: 1711788835295,
      delta: 0,
      stepDelta: 0,
      status: "success",
      data: {},
      sequence: 1,
      previousStep: "",
    },
    {
      step: "api_fetch_complete",
      timestamp: 1711788836795,
      delta: 1500,
      stepDelta: 1500,
      status: "success",
      data: {},
      sequence: 2,
      previousStep: "start",
    },
    {
      step: "response_parsed",
      timestamp: 1711788837095,
      delta: 1800,
      stepDelta: 300,
      status: "success",
      data: {
        parseType: 2
      },
      sequence: 3,
      previousStep: "api_fetch_complete",
    },
    {
      step: "stop",
      timestamp: 1711788838495,
      delta: 3800,
      stepDelta: 1000,
      status: "success",
      data: {
        reason: "response rendered"
      },
      sequence: 4,
      previousStep: "response_parsed",
    },
  ],
};
```


## 🏁 Getting started
```
$ npm install trackflow
```
or
```
$ yarn add trackflow
```

## 💻 Installation
```
$ git clone https://github.com/hasnainroopawalla/trackflow.git
$ cd trackflow
$ yarn install
```

## 📄 Documentation


## ✏️ Contributing
- Post any issues and suggestions on the GitHub [issues](https://github.com/hasnainroopawalla/trackflow/issues) page.
- To contribute, fork the project and then create a pull request back to `master`.


## License
This project is licensed under the MIT License - see the [LICENSE](https://github.com/hasnainroopawalla/trackflow/blob/f11b8a6d1ebc81dd9855b09f36d4d896262631c5/LICENSE) file for details.