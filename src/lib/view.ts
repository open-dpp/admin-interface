import {
  NodeDto,
  isSectionGrid,
  ResponsiveConfigDto,
} from "@open-dpp/api-client";

export function generateClasses(
  config: ResponsiveConfigDto,
  className: string,
) {
  const hasBreakpoints = Object.keys(config).length > 0;

  const effectiveBreakpoints = hasBreakpoints ? config : { xs: 1 }; // default if none are provided

  return Object.entries(effectiveBreakpoints).map(
    ([key, value]) => `${key}:${className}-${value}`,
  );
}

export function generateClassesForNode(node: NodeDto | undefined): string {
  if (!node) {
    return "";
  }
  const classes = generateClasses(node.colSpan, "col-span");
  if (node.colStart) {
    classes.push(...generateClasses(node.colStart, "col-start"));
  }
  if (node.rowSpan) {
    classes.push(...generateClasses(node.rowSpan, "row-span"));
  }
  if (node.rowStart) {
    classes.push(...generateClasses(node.rowStart, "row-start"));
  }
  if (isSectionGrid(node)) {
    classes.push(...generateClasses(node.cols, "grid-cols"));
  }
  return classes.join(" ");
}
