// interface Handler {
//   setNext(handler: Handler): Handler;
//   handle(request: string): string;
// }
//
// abstract class AbstractHandler implements Handler {
//   private nextHandler: Handler;
//
//   public setNext(handler: Handler): Handler {
//     this.nextHandler = handler;
//     return handler;
//   }
//
//   public handle(request: string): string {
//     if (this.nextHandler) {
//       return this.nextHandler.handle(request);
//     }
//     return null;
//   }
// }
//
// class user1Handler extends AbstractHandler {
//   public handle(request: string): string {
//     if (request === 'Read-Only') {
//       return `user1: has ${request} access.`;
//     }
//     return super.handle(request);
//
//   }
// }
//
// class user2Handler extends AbstractHandler {
//   public handle(request: string): string {
//     if (request === 'Write-Only') {
//       return `user2: has ${request} access.`;
//     }
//     return super.handle(request);
//   }
// }
//
// class user3Handler extends AbstractHandler {
//   public handle(request: string): string {
//     if (request === 'Read-Write') {
//       return `user3: has ${request} access.`;
//     }
//     return super.handle(request);
//   }
// }
//
// function showAccessList(handler: Handler) {
//   const access = ['Read-Only', 'Write-Only', 'Read-Write'];
//
//   for (const a of access) {
//     const result = handler.handle(a);
//     if (result) {
//       console.log(`  ${result}`);
//     } else {
//       console.log(`  No user with ${a} access.`);
//     }
//   }
// }
//
// const user1 = new user1Handler();
// const user2 = new user2Handler();
// const user3 = new user3Handler();
//
// user1.setNext(user2).setNext(user3);
// console.log('\nAccess-list:\n');
// showAccessList(user1);
// console.log('');
// showAccessList(user2);
// console.log('');
// showAccessList(user3);
