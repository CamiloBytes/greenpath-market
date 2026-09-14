import { describe, expect, it } from "vitest";
import { categorySchema } from "./CategoryValidation";

describe("categorySchema", () => {
  it("accepts a category name with up to 40 characters", () => {
    const result = categorySchema.safeParse({ category_name: "Fresh produce" });

    expect(result.success).toBe(true);
  });

  it("rejects an empty category name", () => {
    const result = categorySchema.safeParse({ category_name: "" });

    expect(result.success).toBe(false);
  });

  it("rejects category names longer than 40 characters", () => {
    const result = categorySchema.safeParse({ category_name: "a".repeat(41) });

    expect(result.success).toBe(false);
  });
});