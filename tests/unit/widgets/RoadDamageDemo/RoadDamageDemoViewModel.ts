import RoadDamageDemoViewModel from "../../../../../src/app/widgets/RoadDamageDemo/RoadDamageDemoViewModel";

const { beforeEach, suite, test } = intern.getInterface("tdd");
const { assert } = intern.getPlugin("chai");

suite("app/widgets/RoadDamageDemo/RoadDamageDemoViewModel", () => {
  let vm: RoadDamageDemoViewModel;

  beforeEach(() => {
    vm = new RoadDamageDemoViewModel();
  });

  test("validate that name is correct", () => {
    assert.equal(vm.name, "Slagathor");
  });
});
