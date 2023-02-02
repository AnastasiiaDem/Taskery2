// class Prototype {
//   public _values: number[];
//
//   constructor(values: number[]) {
//     this._values = values;
//   }
//
//   clone() {
//     return Object.assign({}, this);
//   }
//
//   deepClone() {
//     return JSON.parse(JSON.stringify(this));
//   }
// }
//
// function runPrototype() {
//   const object1 = new Prototype([1, 2, 3, 4]);
//   const object2 = object1.clone();
//   const object3 = object1.deepClone();
//
//   object1._values[1] = 101;
//
//   console.log(`object1: ${JSON.stringify(object1._values)}`);
//   console.log(`object2: ${JSON.stringify(object2._values)}`);
//   console.log(`object3: ${JSON.stringify(object3._values)}`);
// }
//
// runPrototype();
