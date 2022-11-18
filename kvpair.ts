function isKvPairEqual<T>(
  kv1: { [key: string]: T },
  kv2: { [key: string]: T }
): boolean {
  const _compare = (l: { [key: string]: T }, r: { [key: string]: T }) =>
    !Object.keys(l).some((key) => r[key] !== l[key]);

  return _compare(kv1, kv2) && _compare(kv2, kv1);
}

const kv1 = { a: 1, b: "12", c: "a" };
const kv2 = { a: 1, b: 12, c: "a" };
console.log(isKvPairEqual(kv1, kv2));
