// interface ISubject {
//   subscribe(observer: Observer):void
//   unsubscribe(observer: Observer):void
//   showAllObservers():void
// }
//
// interface IObserver {
//   show():void
// }
//
// class Subject implements ISubject {
//   private observers:Observer[] = [];
//
//   subscribe(observer:Observer) {
//     this.observers.push(observer);
//   }
//
//   unsubscribe(observer:Observer) {
//     this.observers = this.observers.filter((element)=>{
//       return observer.id !== element.id;
//     });
//   }
//
//   showAllObservers() {
//     this.observers.forEach(observer => {
//       observer.show();
//     })
//   }
// }
//
// class Observer implements IObserver {
//
//   constructor(public readonly id:number) {
//   }
//
//   show() {
//     console.log(`Observer ${this.id}`);
//   }
// }
//
// const subject = new Subject();
// const firstObserver = new Observer(1);
// const secondObserver = new Observer(2);
// const thirdObserver = new Observer(3);
// const fourthObserver = new Observer(4);
// const fifthObserver = new Observer(5);
// subject.subscribe(firstObserver);
// subject.subscribe(secondObserver);
// subject.subscribe(thirdObserver);
// subject.subscribe(fourthObserver);
// subject.subscribe(fifthObserver);
// subject.showAllObservers();
// console.log('')
// subject.unsubscribe(firstObserver);
// subject.unsubscribe(thirdObserver);
// subject.unsubscribe(fifthObserver);
// subject.showAllObservers();
