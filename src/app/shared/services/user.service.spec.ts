// import {TestBed} from '@angular/core/testing';
// import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
// import {UserModel} from '../models/user.model';
// import {UserService} from './user.service';
//
// const mockData = [
//   {id: 1, firstName: "First", lastName: "Employee", position: 2},
//   {id: 2, firstName: "First", lastName: "TeamLead", position: 1},
//   {id: 3, firstName: "Second", lastName: "Employee2", position: 2}
// ] as UserModel[];
//
// describe('UserService', () => {
//
//   let httpTestingController: HttpTestingController;
//   let mockUsers;
//   let mockUser;
//   let mockId;
//
//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       imports: [
//         HttpClientTestingModule
//       ],
//       providers: [UserService]
//     });
//     httpTestingController = TestBed.get(HttpTestingController);
//   });
//
//   beforeEach(() => {
//     mockUsers = [...mockData];
//     mockUser = mockUsers[0];
//     mockId = mockUser.id;
//   });
//
//   const apiUrl = (id: number) => {
//     const service = TestBed.inject(UserService);
//     return `${service.usersUrl}/${mockId}`;
//   };
//
//   afterEach(() => {
//     httpTestingController.verify();
//   });
//
//   it('should be created', () => {
//     const service = TestBed.inject(UserService);
//     expect(service).toBeTruthy();
//   });
//
//   describe('getUsers', () => {
//
//     it('should return mock users', () => {
//       const service = TestBed.inject(UserService);
//       service.getUsers()
//         .subscribe(users => {
//             expect(users.length).toEqual(mockUsers.length);
//           }
//         );
//       const req = httpTestingController.expectOne(service.usersUrl);
//       expect(req.request.method).toEqual('GET');
//       req.flush(mockUsers);
//     });
//   });
//
//   describe('addUser', () => {
//
//     it('should add mock user', () => {
//       const service = TestBed.inject(UserService);
//       service.addUser(mockData)
//         .subscribe(user => {
//             expect(user.length).toEqual(mockData.length);
//           }
//         );
//       const req = httpTestingController.expectOne(service.usersUrl);
//       expect(req.request.method).toEqual('POST');
//       req.flush(mockData);
//     });
//   });
//
//
//   describe('deleteUser', () => {
//
//     it('should delete user using id', () => {
//       const service = TestBed.inject(UserService);
//       const mockUrl = apiUrl(mockId);
//       service.deleteUser(mockId).subscribe(
//         response => expect(response).toEqual(mockId)
//       );
//       const req = httpTestingController.expectOne(mockUrl);
//       expect(req.request.method).toEqual('DELETE');
//       req.flush(mockId);
//     });
//   });
// });
