// class TaskBuilder {
//   private readonly title: string;
//   private description: string;
//   private duration: number;
//   private employee: string;
//
//   constructor(title: string) {
//     this.title = title;
//   }
//
//   get Title() {
//     return this.title;
//   }
//
//   setDescription(value: string): TaskBuilder {
//     this.description = value;
//     return this;
//   }
//
//   get Description() {
//     return this.description;
//   }
//
//   setDuration(value: number): TaskBuilder {
//     this.duration = value;
//     return this;
//   }
//
//   get Duration() {
//     return this.duration;
//   }
//
//   setEmployee(value: string): TaskBuilder {
//     this.employee = value;
//     return this;
//   }
//
//   get Employee() {
//     return this.employee;
//   }
//
//   build(): Task {
//     return new Task(this);
//   }
// }
//
// class Task {
//   private readonly title: string;
//   private readonly description: string;
//   private readonly duration: number;
//   private readonly employee: string;
//
//   constructor(builder: TaskBuilder) {
//     this.title = builder.Title;
//     this.description = builder.Description;
//     this.duration = builder.Duration;
//     this.employee = builder.Employee
//   }
//
//   get Title() {
//     return this.title;
//   }
//
//   get Description() {
//     return this.description;
//   }
//
//   get Duration() {
//     return this.duration;
//   }
//
//   get Employee() {
//     return this.employee;
//   }
// }
//
// function runBuilder(): void {
//   let task = new TaskBuilder("Task1")
//     .setDescription('description')
//     .setDuration(3)
//     .setEmployee('employee1')
//     .build();
//     console.log(task.Title + ' assigned to: ' + task.Employee + ' (duration: ' + task.Duration + ' hrs)\n\t---' + task.Description);
// }
//
// runBuilder();
