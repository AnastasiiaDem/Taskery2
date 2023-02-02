// import {TestBed} from '@angular/core/testing';
// import {TaskService} from './task.service';
// import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
// import {TaskModel} from "../models/task.model";
//
// const mockData = [
//   {id: 1, title: 'First task', description: '', status: 3, duration: 2, employeeId: 1},
//   {id: 2, title: 'Second task', description: '', status: 2, duration: 1, employeeId: 2},
//   {id: 3, title: 'Third task', description: '', status: 1, duration: 3, employeeId: 3}
// ] as TaskModel[];
//
// describe('TaskService', () => {
//
//   let httpTestingController: HttpTestingController;
//   let mockTasks;
//   let mockTask;
//   let mockId;
//
//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       imports: [
//         HttpClientTestingModule
//       ],
//       providers: [TaskService]
//     });
//     httpTestingController = TestBed.get(HttpTestingController);
//   });
//
//   beforeEach(() => {
//     mockTasks = [...mockData];
//     mockTask = mockTasks[0];
//     mockId = mockTask.id;
//   });
//
//   const apiUrl = (id: number) => {
//     const service = TestBed.inject(TaskService);
//     return `${service.taskUrl}/${mockId}`;
//   };
//
//   afterEach(() => {
//     httpTestingController.verify();
//   });
//
//   it('should be created', () => {
//     const service = TestBed.inject(TaskService);
//     expect(service).toBeTruthy();
//   });
//
//   describe('getTasks', () => {
//
//     it('should return mock board', () => {
//       const service = TestBed.inject(TaskService);
//       service.getTasks()
//         .subscribe(tasks => {
//             expect(tasks.length).toEqual(mockTasks.length);
//           }
//         );
//       const req = httpTestingController.expectOne(service.taskUrl);
//       expect(req.request.method).toEqual('GET');
//       req.flush(mockTasks);
//     });
//   })
//
//   describe('addTask', () => {
//
//     it('should add mock task', () => {
//       const service = TestBed.inject(TaskService);
//       service.addTask(mockTask)
//         .subscribe(tasks => {
//             expect(tasks.length).toEqual(mockTasks.length);
//           }
//         );
//       const req = httpTestingController.expectOne(service.taskUrl);
//       expect(req.request.method).toEqual('POST');
//       req.flush(mockTasks);
//     });
//   });
//
//   describe('deleteTask', () => {
//
//     it('should delete task using task object', () => {
//       const service = TestBed.inject(TaskService);
//       const mockUrl = apiUrl(mockTask.id);
//       service.deleteTask(mockTask.id)
//         .subscribe(
//           response => expect(response).toEqual(mockTask.id)
//         );
//       const req = httpTestingController.expectOne(mockUrl);
//       expect(req.request.method).toEqual('DELETE');
//       req.flush(mockTask.id);
//     });
//   });
// });
