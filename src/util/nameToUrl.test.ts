import { nameToUrl } from "./nameToUrl";

// jest test for nameToUrl.ts
describe("nameToUrl", () => {
  it("shouldn't change a valid string", () => {
    const name = "nameWithSpaces";
    const url = nameToUrl(name);
    expect(url).toBe("nameWithSpaces");
  }),
    it("should replace spaces with _", () => {
      const name = "name with spaces";
      const url = nameToUrl(name);
      expect(url).toBe("name_with_spaces");
    }),
    it("should replace umlauts to", () => {
      const name = "äöüß";
      const url = nameToUrl(name);
      expect(url).toBe("aeoeuess");
    }),
    it("should replace . to dot", () => {
      const name = "name.with.dots";
      const url = nameToUrl(name);
      expect(url).toBe("namedotwithdotdots");
    }),
    it("should replace special characters to _", () => {
      const name = "name with spaces and !@#$%^&*()_+-=[]{}|;':,./<>?";
      const url = nameToUrl(name);
      expect(url).toBe("name_with_spaces_and_dot");
    });
});
