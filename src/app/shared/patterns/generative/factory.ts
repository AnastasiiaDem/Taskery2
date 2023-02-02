// interface Action {
//   build();
// }
//
// class ShoppingMallBuilding implements Action {
//
//   build() {
//     console.log("Shopping mall built!");
//   }
// }
//
// class PharmacyBuilding implements Action {
//
//   build() {
//     console.log("Pharmacy built!");
//   }
// }
//
// class GrocerBuilding implements Action {
//
//   build() {
//     console.log("Grocer built!");
//   }
// }
//
// enum BuildingTypes {
//   ShoppingMall,
//   Pharmacy,
//   Grocer
// }
//
// class BuildingFactory {
//   private shoppingMallBuildingCount = 0;
//   private pharmacyBuildingCount = 0;
//   private grocerBuildingCount = 0;
//
//   public getBuilding(type: BuildingTypes) {
//     switch (type) {
//       case BuildingTypes.ShoppingMall:
//         this.shoppingMallBuildingCount++;
//         return new ShoppingMallBuilding();
//       case BuildingTypes.Pharmacy:
//         this.pharmacyBuildingCount++;
//         return new PharmacyBuilding();
//       case BuildingTypes.Grocer:
//         this.grocerBuildingCount++;
//         return new GrocerBuilding();
//       default:
//         return null;
//     }
//   }
//
//   showReport() {
//     console.log("Number of shopping mall buildings: " + this.shoppingMallBuildingCount);
//     console.log("Number of pharmacy buildings: " + this.pharmacyBuildingCount);
//     console.log("Number of grocer buildings: " + this.grocerBuildingCount);
//     console.log("\nTotal amount of buildings: ", (this.shoppingMallBuildingCount + this.pharmacyBuildingCount + this.grocerBuildingCount));
//   }
// }
//
//
// function runFactory() {
//   const factory = new BuildingFactory();
//
//   const shoppingMall = factory.getBuilding(BuildingTypes.ShoppingMall);
//   shoppingMall.build();
//   const pharmacy = factory.getBuilding(BuildingTypes.Pharmacy);
//   pharmacy.build();
//   const grocer = factory.getBuilding(BuildingTypes.Grocer);
//   grocer.build();
//   factory.showReport();
// }
//
// runFactory();
