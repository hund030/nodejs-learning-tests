const serviceMap: Map<string, string> = new Map<string, string>([
  ["a", "AppService"],
  ["f", "AzureFunction"],
]);

interface A {
  b: any
}
const a: A= {
  b: "a"
}
const a2: A = {
  b: undefined
}

console.log(serviceMap.get(a.b as string));
console.log(serviceMap.get(a2.b as string));