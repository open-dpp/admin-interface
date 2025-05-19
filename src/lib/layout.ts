import {
  ResponsiveConfigDto,
  LayoutDto,
  SectionLayout,
  isSectionLayout,
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

export function generateClassesForLayout(
  layout: LayoutDto | SectionLayout | undefined,
): string {
  if (!layout) {
    return "";
  }
  const classes = generateClasses(layout.colSpan, "col-span");
  if (layout.colStart) {
    classes.push(...generateClasses(layout.colStart, "col-start"));
  }
  if (layout.rowSpan) {
    classes.push(...generateClasses(layout.rowSpan, "row-span"));
  }
  if (layout.rowStart) {
    classes.push(...generateClasses(layout.rowStart, "row-start"));
  }
  if (isSectionLayout(layout)) {
    classes.push(...generateClasses(layout.cols, "grid-cols"));
  }
  return classes.join(" ");
}
