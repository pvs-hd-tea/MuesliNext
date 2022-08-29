export function nameToUrl(name: string): string {
  let url = name;
  // space -> _
  url = url.replace(" ", "_");
  // replace umlauts to
  url = url.replace(/ä/g, "ae");
  url = url.replace(/ö/g, "oe");
  url = url.replace(/ü/g, "ue");
  url = url.replace(/ß/g, "ss");
  // replace . to dot
  url = url.replace(/\./g, "dot");
  // replace special characters to _
  url = url.replace(/[^a-zA-Z0-9_]/g, "_");
  // remove double _
  url = url.replace(/_+/g, "_");
  // remove leading _
  url = url.replace(/^_/, "");
  // remove trailing _
  url = url.replace(/_$/, "");
  return url;
}
