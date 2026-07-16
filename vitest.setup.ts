import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// RTL only auto-registers cleanup when vitest globals are enabled; do it
// explicitly so renders never leak between tests.
afterEach(cleanup);

// jsdom lacks the pointer-capture and scroll APIs Radix popovers/selects
// call on open — stub them so those components can be driven in tests.
Element.prototype.hasPointerCapture ??= () => false;
Element.prototype.setPointerCapture ??= () => {};
Element.prototype.releasePointerCapture ??= () => {};
Element.prototype.scrollIntoView ??= () => {};
