import { expect, it } from "vitest";
import { generateClassesForLayout } from "./layout";

it("should generate classes for section grid", () => {
  const classes = generateClassesForLayout({
    colSpan: { sm: 2, xl: 3 },
    colStart: { sm: 1, lg: 9 },
    rowSpan: { sm: 1, lg: 2 },
    rowStart: { sm: 1, lg: 2 },
    cols: { sm: 1, lg: 8 },
  });

  expect(classes).toEqual(
    "sm:col-span-2 xl:col-span-3 sm:col-start-1 lg:col-start-9 sm:row-span-1 lg:row-span-2 sm:row-start-1 lg:row-start-2 sm:grid-cols-1 lg:grid-cols-8",
  );
});
