/* eslint-disable testing-library/no-unnecessary-act */

import "@testing-library/jest-dom";

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import FakeTimer from "../FakeTimer";

window.matchMedia =
    window.matchMedia ||
    (() => {
        return {
            matches: false,
            addListener() { },
            removeListener() { },
        };
    });

describe("Fake Timer", () => {
    // Fake timers using Jest
    beforeEach(() => {
        jest.useFakeTimers();
    })

    // Running all pending timers and switching to real timers using Jest
    afterEach(() => {
        jest.runOnlyPendingTimers();
        jest.useRealTimers();
    });

    it.skip("Should show I am visible using waitFor", async () => {
        /* 
            ******* <<<------>>>
            ! when using this => we can't use jest.useFakeTimers()
            ! Not recommended 
            ******* <<<------>>>
        */
       console.info('<<<== efsd ==>>>', {output: 2}, '<<<==||==>>>');
        render(<FakeTimer />);
        const timeoutBtn = screen.getByRole("button", { name: /timeout/i });
        act(() => { fireEvent.click(timeoutBtn) });
        await waitFor(async () => await screen.findByRole("heading", { name: /i am visible/i }), { timeout: 1810, interval: 1810 });
        /*
            ******* <<<------>>>
            ? default timeout is 1000
            * default interval is 50
            ! Ideally timeout & interval should be >= applied timeout + 10
            ******* <<<------>>>
        */
        expect(screen.getByRole("heading", { name: /i am visible/i })).toBeInTheDocument();
    });

    it("Should show I am visible using fakeTimers", async () => {
        // ! Recommended
        render(<FakeTimer />);
        const timeoutBtn = screen.getByRole("button", { name: /timeout/i });
        fireEvent.click(timeoutBtn);
        act(() => {
            jest.runAllTimers();
            // jest.advanceTimersByTime(1800);
        });
        expect(screen.getByRole("heading", { name: /i am visible/i })).toBeInTheDocument();
    });
});
