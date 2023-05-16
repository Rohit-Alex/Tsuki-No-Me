/* eslint-disable testing-library/no-node-access */
/* eslint-disable testing-library/no-unnecessary-act */
import React from "react";
import { render, screen, act, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Miscellaneous from "../Miscellaneous";
import * as Constant from "../../../Constant";
import {
  ApiLocations,
  getTokenFromMemCache,
  sayHello,
  TokenExtractor,
} from "../../../Utilies/utils";
// import jwt from 'jsonwebtoken'
import { addMonths, format } from "date-fns";
jest.mock("node-cache");
jest.useFakeTimers();
// jest.mock("../../../Utilies/utils", () => ({
//     __esModule: true,
//     ...jest.requireActual("../../../Utilies/utils"),
// }));

jest.mock(
  "node-cache",
  () =>
    function NodeCache() {
      const cachedObj = { testingKey: "testingValue" };
      this.get = function (key) {
        return cachedObj[key];
      };
    }
);
describe.skip("Mg Backend tricky test", () => {
  it("Should extract token", () => {
    const nextFn = jest.fn();
    const token = jwt.sign(
      { aud: "randomvalue", data: { seller_code: 343 } },
      "secret",
      { expiresIn: "1min" }
    );
    process.env.GSC_AUDIENCE = "randomvalue";
    TokenExtractor(
      { headers: { authorization: `Bearer ${token}` } },
      undefined,
      nextFn
    );
    expect(nextFn).toHaveBeenCalledTimes(1);
  });

  it("Should return null if no key is found", () => {
    const response = getTokenFromMemCache("myKey");
    expect(response).toBe(null);
  });

  it("Should get value from memCache", () => {
    const response = getTokenFromMemCache("testingKey");
    expect(response).toBe("testingValue");
  });
});

window.matchMedia =
  window.matchMedia ||
  (() => {
    return {
      matches: false,
      addListener() {},
      removeListener() {},
    };
  });
describe("Date Picker", () => {
  it("Test Date Picker component", async () => {
    render(<Miscellaneous />);
    //select start date from calender(start date)
    const startDate = screen.getByPlaceholderText(
      "SEARCH_START_DATE_PLACEHOLDER"
    );
    fireEvent.mouseDown(startDate);
    fireEvent.change(startDate, { target: { value: "2020-12-20" } });
    await act(async () => {
      fireEvent.click(
        document.querySelectorAll(".ant-picker-cell-selected")[0]
      );
    });

    const endDate = screen.getByPlaceholderText("SEARCH_END_DATE_PLACEHOLDER");
    await fireEvent.mouseDown(endDate);
    const futureDate = format(addMonths(new Date(), 1), "yyyy-MM-dd");
    await fireEvent.change(endDate, { target: { value: futureDate } });
    await act(async () => {
      fireEvent.click(
        document.querySelectorAll(".ant-picker-cell-selected")[1]
      );
    });
  });

  it("Should clear Start date", async () => {
    render(<Miscellaneous />);
    const startDate = screen.getByPlaceholderText(
      "SEARCH_START_DATE_PLACEHOLDER"
    );
    fireEvent.mouseOver(startDate);
    const closeIcon = screen.getAllByRole("img", { name: "close-circle" })[0]
      ?.parentElement;
    await act(async () => {
      await fireEvent.mouseUp(closeIcon);
    });
  });
});

describe("Lodash", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should debounce the search input", async () => {
    const consoleSpy = jest.spyOn(console, "log");

    render(<Miscellaneous />);
    const input = screen.getByPlaceholderText("SEARCH_RULE_NAME");

    fireEvent.change(input, { target: { value: "search term" } });

    jest.advanceTimersByTime(400);

    expect(consoleSpy).toHaveBeenCalledTimes(2);
    expect(consoleSpy).toHaveBeenCalledWith(
      "inside debounce after 400",
      "search term"
    );
  });
});

describe("Testing constant functions", () => {
  it("Testing url formation", () => {
    ApiLocations.GET_ONE = jest.fn().mockReturnValue("someRandomUrl.com");
    console.log(ApiLocations.GET_TRACE_DETAILS());
  });

  it("Should capitalize first character", () => {
    const res = sayHello("rohit");
    expect(res).toBe("Hi, Rohit");
  });

  it("Should not capitalize first character", () => {
    Constant.IS_CAPITALIZE = false;
    const res = sayHello("rohit");
    expect(res).toBe("Hi, rohit");
  });
});
