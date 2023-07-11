import WebLogger from "./WebLogger";

describe("WebLogger tests", () => {
  const time = 123456789;
  const baseConfig = {
    origin: "http://localhost:8088",
    token: "12345678-1234-1234-1234-123456789012",
  };

  beforeEach(() => {
    Object.defineProperty(navigator, "sendBeacon", {
      value: () => true,
      writable: true,
    });
    jest.spyOn(Date, "now").mockImplementation(() => time);
  });

  test("Events are set to the buffer", () => {
    const event = { a: 0 };
    const wl = new WebLogger({
      ...baseConfig,
    });

    wl.log(event);
    expect(JSON.parse(wl.buffer)).toStrictEqual({
      time,
      event,
    });
  });

  test("HEC overrides are set appropriately", () => {
    const event = { a: 0 };
    const index = "i";
    const host = "h";
    const source = "s";
    const sourceType = "st";

    const wl = new WebLogger({
      ...baseConfig,
      index,
      host,
      source,
      sourceType,
    });

    wl.log(event);
    expect(JSON.parse(wl.buffer)).toStrictEqual({
      index,
      host,
      source,
      sourcetype: sourceType,
      time,
      event,
    });
  });

  test("Middleware can modify events", () => {
    const eventA = { a: 0 };
    const eventB = { b: 1 };
    const wl = new WebLogger({
      ...baseConfig,
      middleware: [
        (event) => ({
          ...event,
          ...eventB,
        }),
      ],
    });

    wl.log(eventA);
    expect(JSON.parse(wl.buffer)).toStrictEqual({
      time,
      event: {
        ...eventA,
        ...eventB,
      },
    });
  });

  test("Events are sent when buffer reaches capacity", () => {
    const wl = new WebLogger({ ...baseConfig, bufferCapacity: 50 });
    expect(wl.log({ a: 0 })).toBe(false);
    expect(wl.buffer.length).not.toBe(0);
    expect(wl.log({ b: 1 })).toBe(true);
    expect(wl.buffer.length).toBe(0);
  });

  test("Send method returns false when buffer is empty", () => {
    const wl = new WebLogger({
      ...baseConfig,
    });
    expect(wl.send()).toBe(false);
  });

  test("Buffer is maintained on sendBeacon error", () => {
    const buffer = "foo";
    const wl = new WebLogger({
      ...baseConfig,
    });
    navigator.sendBeacon = () => false;
    wl.buffer = buffer;
    expect(wl.send()).toBe(false);
    expect(wl.buffer).toBe(buffer);
  });
});
