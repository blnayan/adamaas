import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// RTL only auto-registers cleanup when vitest globals are enabled; do it
// explicitly so renders never leak between tests.
afterEach(cleanup);
