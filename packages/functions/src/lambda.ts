import { ApiHandler } from "sst/node/api";
import { Time } from "@sst-app-test/core/time";

export const handler = ApiHandler(async (_evt) => {
  return {
    // body: `Hello world. The time is ${Time.now()}`,
    body: `This is fckin rad!`,
  };
});
