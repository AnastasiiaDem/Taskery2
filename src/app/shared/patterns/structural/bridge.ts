// class TaskModel {
//   title: string;
//   status: string;
//   duration: number;
//   employee: string;
// }
//
// class Abstraction {
//   protected implementation: Implementation;
//
//   constructor(implementation: Implementation) {
//     this.implementation = implementation;
//   }
//
//   public operation(): string {
//     const result = this.implementation.operationImplementation();
//     return 'Added user info:\n' + result;
//   }
// }
//
// class ExtendedAbstraction extends Abstraction {
//   private readonly description;
//
//   constructor(description: string, implementation: Implementation) {
//     super(implementation);
//     this.description = description;
//   }
//
//   public operation(): string {
//     const result = this.implementation.operationImplementation();
//     return 'Added user extended info:\n' + result + '\n\t---' + this.description;
//   }
// }
//
// interface Implementation {
//   operationImplementation(): string;
// }
//
// class TaskImplementation implements Implementation {
//   private readonly title: string;
//   private readonly duration: number;
//   private readonly employee: string;
//
//   constructor(task: TaskModel) {
//     this.title = task.title;
//     this.duration = task.duration;
//     this.employee = task.employee;
//   }
//
//   public operationImplementation(): string {
//     return this.title + ' assigned to: ' + this.employee + ' (duration: ' + this.duration + ' hrs)';
//   }
// }
//
//
// const task: TaskModel = {
//   title: 'First task',
//   status: 'in proggress',
//   duration: 4,
//   employee: 'employee1'
// }
//
// let implementation = new TaskImplementation(task);
// let abstraction = new Abstraction(implementation);
// console.log(abstraction.operation());
// console.log('')
// abstraction = new ExtendedAbstraction('description', implementation);
// console.log(abstraction.operation());
