import {SSTConfig} from "sst";
import {AwesomeStack} from "./stacks/MyStack";

export default {
  config(_input) {
    return {
      name: "sst-app-test",
      region: "ap-southeast-1",
    };
  },
  stacks(app) {
    app.stack(AwesomeStack);
  },
} satisfies SSTConfig;
