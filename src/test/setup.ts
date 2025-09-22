import "@testing-library/jest-dom";

// Mock de variablesimport '@testing-library/jest-dom';

// Extend Vitest's expect with jest-dom matchers
import { expect } from "vitest";
import * as matchers from "@testing-library/jest-dom/matchers";

expect.extend(matchers);

// Mock de variables de entorno para tests
Object.defineProperty(import.meta, "env", {
  value: {
    VITE_TMDB_API_KEY: "test-api-key",
    VITE_TMDB_BEARER: "test-bearer-token",
  },
  writable: true,
});
