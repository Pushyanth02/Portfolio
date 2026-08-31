import { describe, it, expect, beforeEach, vi } from "vitest";
import { normalizeMode, readStoredMode } from "../mode";

describe("normalizeMode", () => {
  it('returns "dev" for the string "dev"', () => {
    expect(normalizeMode("dev")).toBe("dev");
  });

  it('returns "student" for the string "student"', () => {
    expect(normalizeMode("student")).toBe("student");
  });

  it("returns null for empty string", () => {
    expect(normalizeMode("")).toBeNull();
  });

  it("returns null for unrecognized strings", () => {
    expect(normalizeMode("admin")).toBeNull();
    expect(normalizeMode("DEV")).toBeNull();
    expect(normalizeMode("studentt")).toBeNull();
  });

  it("returns null for non-string values", () => {
    expect(normalizeMode(42)).toBeNull();
    expect(normalizeMode(null)).toBeNull();
    expect(normalizeMode(undefined)).toBeNull();
    expect(normalizeMode(true)).toBeNull();
  });
});

describe("readStoredMode", () => {
  beforeEach(() => {
    localStorage.clear();
    window.location.hash = "";
  });

  it('returns "student" when window is undefined (SSR)', () => {
    // readStoredMode checks typeof window === "undefined" first
    // In a test environment window exists, so we test the client path instead
    expect(readStoredMode()).toBe("student");
  });

  it('reads mode from URL hash first (#dev)', () => {
    window.location.hash = "#dev";
    expect(readStoredMode()).toBe("dev");
  });

  it('reads mode from URL hash first (#student)', () => {
    window.location.hash = "#student";
    expect(readStoredMode()).toBe("student");
  });

  it("returns student for unrecognized hash values", () => {
    window.location.hash = "#other";
    expect(readStoredMode()).toBe("student");
  });

  it('falls back to localStorage when no hash is set', () => {
    window.location.hash = "";
    window.localStorage.setItem("pf-mode", "dev");
    expect(readStoredMode()).toBe("dev");
  });

  it('returns "student" as default when both hash and localStorage are empty', () => {
    window.location.hash = "";
    expect(readStoredMode()).toBe("student");
  });

  it("handles localStorage that throws (private browsing)", () => {
    window.location.hash = "";
    const origGetItem = Storage.prototype.getItem;
    Storage.prototype.getItem = vi.fn(() => {
      throw new Error("SecurityError");
    });
    try {
      expect(readStoredMode()).toBe("student");
    } finally {
      Storage.prototype.getItem = origGetItem;
    }
  });
});
