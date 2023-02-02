// class Connection1 {
//   public request(): string {
//     return 'Connected to connection1!';
//   }
// }
//
// class Connection2 {
//   public specificRequest(): string {
//     return 'NOT Connected to connection2!';
//   }
// }
//
// class Adapter extends Connection1 {
//   private unsuitable: Connection2;
//
//   constructor(unsuitable: Connection2) {
//     super();
//     this.unsuitable = unsuitable;
//   }
//
//   public request(): string {
//     const result = this.unsuitable.specificRequest().replace('NOT ', '');
//     return 'Adapter: ' + result;
//   }
// }
//
//
// const connection1 = new Connection1();
// console.log(connection1.request());
//
// console.log('');
//
// const connection2 = new Connection2();
// console.log(connection2.specificRequest());
//
// console.log('');
//
// const adapter = new Adapter(connection2);
// console.log(adapter.request());
//
