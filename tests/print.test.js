import { describe, expect, it } from "bun:test";
import printStyles from "../src/print.js";

describe("Print Styles Generation", () => {
  it("returns an object with '@media print' key", () => {
    const styles = printStyles({ root: ":root" });
    expect(styles).toBeTypeOf("object");
    expect(styles["@media print"]).toBeDefined();
  });

  it("styles body within '@media print' correctly", () => {
    const styles = printStyles({ root: ":root" });
    const printBlock = styles["@media print"];
    expect(printBlock["body"]).toBeDefined();
    expect(printBlock["body"]["font-size"]).toBe("12pt");
    expect(printBlock["body"]["color"]).toBe("black");
    expect(printBlock["body"]["background"]).toBe("white");
    expect(printBlock["body"]["transition"]).toBe("none");
  });

  it("styles headings (h1-h6) with correct point sizes", () => {
    const styles = printStyles({ root: ":root" });
    const printBlock = styles["@media print"];
    expect(printBlock[":root h1"]).toBeDefined();
    expect(printBlock[":root h1"]["font-size"]).toBe("28pt");
    expect(printBlock[":root h2"]["font-size"]).toBe("22pt");
    expect(printBlock[":root h3"]["font-size"]).toBe("18pt");
    expect(printBlock[":root h4"]["font-size"]).toBe("14pt");
    expect(printBlock[":root h5"]["font-size"]).toBe("12pt");
    expect(printBlock[":root h6"]["font-size"]).toBe("11pt");
  });

  it("styles all headings with page-break-after: avoid and color: black", () => {
    const styles = printStyles({ root: ":root" });
    const printBlock = styles["@media print"];
    const headingGroupKey = Object.keys(printBlock).find(k => k.includes("h1") && k.includes("h6") && !k.includes("h1\":"));
    expect(headingGroupKey).toBeDefined();
    expect(printBlock[headingGroupKey]["page-break-after"]).toBe("avoid");
    expect(printBlock[headingGroupKey]["color"]).toBe("black");
  });

  it("styles pre and blockquote with page-break-inside: avoid", () => {
    const styles = printStyles({ root: ":root" });
    const printBlock = styles["@media print"];
    const preBlockKey = Object.keys(printBlock).find(k => k.includes("pre") && k.includes("blockquote"));
    expect(preBlockKey).toBeDefined();
    expect(printBlock[preBlockKey]["page-break-inside"]).toBe("avoid");
  });

  it("styles table with page-break-inside: avoid", () => {
    const styles = printStyles({ root: ":root" });
    const printBlock = styles["@media print"];
    expect(printBlock[":root table"]).toBeDefined();
    expect(printBlock[":root table"]["page-break-inside"]).toBe("avoid");
  });

  it("styles img and figure with max-width: 100%", () => {
    const styles = printStyles({ root: ":root" });
    const printBlock = styles["@media print"];
    const imgFigKey = Object.keys(printBlock).find(k => k.includes("img") && k.includes("figure"));
    expect(imgFigKey).toBeDefined();
    expect(printBlock[imgFigKey]["max-width"]).toBe("100%");
  });

  it("respects custom root scoping for body", () => {
    const styles = printStyles({ root: "#app" });
    const printBlock = styles["@media print"];
    expect(printBlock["#app"]).toBeDefined();
    expect(printBlock["body"]).toBeUndefined();
  });

  it("applies typography isolation properly", () => {
    const styles = printStyles({ root: ":root", typography: ".prose" });
    const printBlock = styles["@media print"];
    expect(printBlock["body .prose"]).toBeDefined();
    expect(printBlock[":root .prose h1"]).toBeDefined();
    expect(printBlock[":root .prose h1"]["font-size"]).toBe("28pt");
  });
});
