import {
  aliasOf,
  declared,
  property,
  subclass
} from "esri/core/accessorSupport/decorators";
import { renderable, tsx } from "esri/widgets/support/widget";
import SceneView from "esri/views/SceneView";

import Widget from "esri/widgets/Widget";

import DemoViewModel from "./Demo/DemoViewModel";

const CSS = {
  base: "esri-widget demo-base"
};

@subclass("app.widgets.Demo")
export default class Demo extends declared(Widget) {

  @aliasOf("viewModel.name")
  @renderable()
  name = "";

  @aliasOf("viewModel.view")
  @renderable()
  view: SceneView;

  @property({
    type: DemoViewModel
  })
  @renderable()
  viewModel: DemoViewModel = new DemoViewModel();

  constructor(param?: any) {
    super();
  }

  render() {
    return (
      <div class={CSS.base}>
        <p>
          Welcome {this.name}!
        </p>
        <p>heading: {this.view.camera ? this.view.camera.heading : ""}</p>
      </div>
    );
  }

}
