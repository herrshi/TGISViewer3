import CameraInfoViewModel from "../../../../../src/app/widgets/CameraInfo/CameraInfoViewModel";

const { beforeEach, suite, test } = intern.getInterface("tdd");
const { assert } = intern.getPlugin("chai");

suite("app/widgets/CameraInfo/CameraInfoViewModel", () => {
  let vm: CameraInfoViewModel;

  beforeEach(() => {
    vm = new CameraInfoViewModel();
  });

  test("validate that name is correct", () => {
    assert.equal(vm.name, "Slagathor");
  });
});
