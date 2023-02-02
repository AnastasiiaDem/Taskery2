// class Command {
//   private readonly action: string;
//   private readonly receiver: Receiver;
//
//   constructor(action: string, receiver?: Receiver) {
//     this.action = action;
//     this.receiver = receiver || null;
//   }
//
//   public execute(): void {
//     if (!!this.receiver) {
//       this.receiver.doSomething(this.action);
//     } else {
//       console.log(`Sender: ${this.action}`);
//     }
//   }
// }
//
// class Receiver {
//   public doSomething(a: string): void {
//     console.log(`Receiver: ${a}`);
//   }
// }
//
// class Sender {
//   private onStart: Command;
//   private onFinish: Command;
//
//   private static checkCommand(object): object is Command {
//     return !!object;
//   }
//
//   public beforeAction(command: Command): void {
//     this.onStart = command;
//   }
//
//   public afterAction(command: Command): void {
//     this.onFinish = command;
//   }
//
//   public process(): void {
//     if (Sender.checkCommand(this.onStart)) {
//       this.onStart.execute();
//     }
//
//     console.log('action execution process...');
//
//     if (Sender.checkCommand(this.onFinish)) {
//       this.onFinish.execute();
//     }
//   }
// }
//
// const sender = new Sender();
// const receiver = new Receiver();
// sender.beforeAction(new Command('...Some command BEFORE performing an action...'));
// sender.afterAction(new Command('...Some command AFTER performing an action...', receiver));
// sender.process();
