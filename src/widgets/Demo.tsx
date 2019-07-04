import DemoViewModel from "@/widgets/Demo/DemoViewModel";
import {
  aliasOf,
  declared,
  property,
  subclass
} from "esri/core/accessorSupport/decorators";
import SceneView from "esri/views/SceneView";
import { renderable, tsx } from "esri/widgets/support/widget";

import Widget from "esri/widgets/Widget";

const CSS = {
  base: "esri-widget demo-base"
};

@subclass("app.widgets.Demo")
export default class Demo extends declared(Widget) {
  // --------------------------------------------------------------------
  //
  //  Properties
  //
  // --------------------------------------------------------------------
  @property({
    type: DemoViewModel
  })
  @renderable(["state"])
  viewModel: DemoViewModel = new DemoViewModel();

  @aliasOf("viewModel.view")
  view: SceneView;

  // --------------------------------------------------------------------
  //
  //  LifeCycle
  //
  // --------------------------------------------------------------------
  constructor(param?: any) {
    super();
  }

  postInitialize() {
    // this.view.watch("center, interacting, scale", () => this._onViewChanged());
    // this._onViewChanged();
  }

  // -------------------------------------------------------------------
  //
  //  Public methods
  //
  // -------------------------------------------------------------------

  render() {
    const { x, y, z, scale, heading, tilt } = this.viewModel.state;
    return (
      <div bind={this} class={CSS.base}>
        <p>x: {Number(x).toFixed(6)}</p>
        <p>y: {Number(y).toFixed(6)}</p>
        <p>z: {Number(z).toFixed(6)}</p>
        <p>scale: {Number(scale).toFixed(6)}</p>
        <p>heading: {Number(heading).toFixed(6)}</p>
        <p>tilt: {Number(tilt).toFixed(6)}</p>
      </div>
    );
  }
}
