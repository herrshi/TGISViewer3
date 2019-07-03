import {
  aliasOf,
  declared,
  property,
  subclass
} from "esri/core/accessorSupport/decorators";
import SceneView from "esri/views/SceneView";
import { tsx } from "esri/widgets/support/widget";

import Widget from "esri/widgets/Widget";

import RoadDamageDemoViewModel from "./RoadDamageDemo/RoadDamageDemoViewModel";
import FeatureLayer from "esri/layers/FeatureLayer";

const CSS = {
  base: "esri-widget roaddamagedemo-base"
};

@subclass("app.widgets.RoadDamageDemo")
export default class RoadDamageDemo extends declared(Widget) {
  // --------------------------------------------------------------------
  //
  //  Properties
  //
  // --------------------------------------------------------------------

  @property({
    type: RoadDamageDemoViewModel
  })
  viewModel: RoadDamageDemoViewModel = new RoadDamageDemoViewModel();

  @aliasOf("viewModel.roadLayer")
  roadLayer: FeatureLayer;

  @aliasOf("viewModel.view")
  view: SceneView;

  constructor(param?: any) {
    super();
  }

  render() {
    return (
      <div class={CSS.base}>

      </div>
    );
  }

}
