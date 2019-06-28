import DemoViewModel from "../../../../../src/app/widgets/Demo/DemoViewModel";

const { beforeEach, suite, test } = intern.getInterface("tdd");
const { assert } = intern.getPlugin("chai");

suite("app/widgets/Demo/DemoViewModel", () => {
  let vm: DemoViewModel;

  beforeEach(() => {
    vm = new DemoViewModel();
  });

  test("validate that name is correct", () => {
    assert.equal(vm.name, "Slagathor");
  });
});
