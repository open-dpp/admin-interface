import { beforeAll } from "vitest";
import * as ResizeObserverModule from "resize-observer-polyfill";
import "@testing-library/jest-dom/vitest";

beforeAll(() => {
  global.ResizeObserver = ResizeObserverModule.default;
});
