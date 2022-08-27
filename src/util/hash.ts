// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function hashStable(obj: any): string {
  // Example:
  // Input:
  // {
  //   url: `request/project-management/getTableData`,
  //   body: {
  //     sessionID: "Session",
  //     id: data.submit_target.split(".")[2],
  //   },
  // }

  // Output: #url:"request/project-management/getTableData",body:#sessionID:"Session",id:4,,
  // Receiv: #url:"request/project-management/getTableData",body:#sessionID:"Session",id:1,,

  if (!(obj instanceof Object)) {
    if (isNaN(obj)) return JSON.stringify(obj);
    else return obj.toString();
  }

  // iterate over object keys
  let output = "#";
  Object.keys(obj).map((key) => {
    // recursion
    output += `${key}:${hashStable(obj[key])},`;
  });
  return output;
}
