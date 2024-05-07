function* generator() {
  for (const i of [1, 2, 3]) {
    yield i;
  }
}

const iter = generator();
for (const it of iter) {
  console.log(it);
}

const iter2 = generator();
let result = iter2.next();
while (!result.done) {
  console.log(result);
  result = iter2.next();
}
