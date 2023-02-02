// interface State {
//   task: Task;
//
//   assignTask();
//   processTask();
//   finishTask();
// }
//
// class Task {
//   public finishTaskState: State;
//   public assignTaskState: State;
//   public processTaskState: State;
//   public taskIsAssigned: State;
//
//   public currentState: State;
//
//   constructor() {
//     this.assignTaskState = new AssignTaskState(this);
//     this.processTaskState = new ProcessTaskState(this);
//     this.finishTaskState = new FinishTaskState(this);
//     this.taskIsAssigned = new TaskIsAssigned(this);
//
//     this.setState(this.assignTaskState);
//   }
//
//   public setState(state: State) {
//     this.currentState = state;
//   }
//
//   public getCurrentState(): State {
//     return this.currentState;
//   }
// }
//
// class TaskIsAssigned implements State {
//   task: Task;
//
//   constructor(task: Task) {
//     this.task = task;
//   }
//
//   finishTask() {
//     console.log('Finishing unprocessed task...');
//     this.task.setState(this.task.assignTaskState);
//   }
//
//   assignTask() {
//     console.log('Task is already assigned.');
//   }
//
//   processTask() {
//     console.log('Processing the task now...');
//     this.task.setState(this.task.finishTaskState);
//   }
// }
//
// class FinishTaskState implements State {
//   task: Task;
//
//   constructor(task: Task) {
//     this.task = task;
//   }
//
//   public finishTask() {
//     console.log('This task is finished.');
//     this.task.setState(this.task.assignTaskState);
//   }
//
//   public assignTask() {
//     console.log('This task is successfully assigned.');
//     this.task.setState(this.task.taskIsAssigned);
//   }
//
//   public processTask() {
//     console.log('The task can`t be processed cause it`s not assigned yet.');
//     this.task.setState(this.task.assignTaskState);
//   }
// }
//
// class AssignTaskState implements State {
//   task: Task;
//
//   constructor(task: Task) {
//     this.task = task;
//   }
//
//   finishTask() {
//     console.log('The task can`t be finished cause it`s not assigned yet.');
//     this.task.setState(this.task.assignTaskState);
//   }
//
//   assignTask() {
//     console.log('This task is successfully assigned.');
//     this.task.setState(this.task.taskIsAssigned);
//   }
//
//   processTask() {
//     console.log('The task can`t be processed cause it`s not assigned yet.');
//     this.task.setState(this.task.finishTaskState);
//   }
// }
//
// class ProcessTaskState implements State {
//   task: Task;
//
//   constructor(task: Task) {
//     this.task = task;
//   }
//
//   finishTask() {
//     console.log('This task is finished.');
//     this.task.setState(this.task.assignTaskState);
//   }
//   assignTask() {
//     console.log('This task is already assigned.');
//   }
//   processTask() {
//     console.log('This task is processing now...');
//   }
// }
//
// const task = new Task();
//
// task.getCurrentState().assignTask();
// task.getCurrentState().processTask();
// task.getCurrentState().finishTask();
// console.log('');
// task.getCurrentState().finishTask();
// task.getCurrentState().assignTask();
// task.getCurrentState().processTask();
// console.log('');
// task.getCurrentState().processTask();
// task.getCurrentState().assignTask();
// task.getCurrentState().finishTask();
