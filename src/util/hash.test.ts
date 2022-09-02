import { hashStable } from "./hash";

// jest test of hash.ts
describe("hashStable", () => {
  it("should hash an object", () => {
    const obj = {
      url: "request/project-management/getTableData",
      body: {
        sessionID: "Session",
        id: 1,
      },
    };
    const hash = hashStable(obj);
    expect(hash).toBe(
      '#url:"request/project-management/getTableData",body:#sessionID:"Session",id:1,,'
    );
  }),
    it("should hash an object with a number", () => {
      const obj = {
        url: "request/project-management/getTableData",
        body: {
          sessionID: "Session",
          id: 1,
        },
      };
      const hash = hashStable(obj);
      expect(hash).toBe(
        '#url:"request/project-management/getTableData",body:#sessionID:"Session",id:1,,'
      );
    }),
    it("should hash an object with a string", () => {
      const obj = {
        url: "request/project-management/getTableData",
        body: {
          sessionID: "Session",
          id: "1",
        },
      };
      const hash = hashStable(obj);
      expect(hash).toBe(
        '#url:"request/project-management/getTableData",body:#sessionID:"Session",id:1,,'
      );
    }),
    it("should hash an object with a boolean", () => {
      const obj = {
        url: "request/project-management/getTableData",
        body: {
          sessionID: "Session",
          id: true,
        },
      };
      const hash = hashStable(obj);
      expect(hash).toBe(
        '#url:"request/project-management/getTableData",body:#sessionID:"Session",id:true,,'
      );
    });
});
