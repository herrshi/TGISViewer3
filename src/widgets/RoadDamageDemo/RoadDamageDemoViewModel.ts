import AppConfig from "@/AppConfig";
import Accessor from "esri/core/Accessor";

import {
  declared,
  property,
  subclass
} from "esri/core/accessorSupport/decorators";
import Graphic from "esri/Graphic";
import FeatureLayer from "esri/layers/FeatureLayer";
import "esri/layers/graphics/sources/support/MemorySourceWorker";
import Field from "esri/layers/support/Field";
import UniqueValueRenderer from "esri/renderers/UniqueValueRenderer";
import SimpleLineSymbol from "esri/symbols/SimpleLineSymbol";

import SceneView from "esri/views/SceneView";
import watchUtils = require("esri/core/watchUtils");

@subclass("app.widgets.RoadDamageDemo.RoadDamageDemoViewModel")
export default class RoadDamageDemoViewModel extends declared(Accessor) {
  // --------------------------------------------------------------------------
  //
  //  Properties
  //
  // --------------------------------------------------------------------------

  // ----------------------------------
  //  view
  // ----------------------------------
  @property()
  view: SceneView;

  // ----------------------------------
  //  roadLayer
  // ----------------------------------
  @property()
  roadLayer: FeatureLayer = new FeatureLayer();

  // --------------------------------------------------------------------------
  //
  //  Variables
  //
  // --------------------------------------------------------------------------
  _appConfig: any;

  // --------------------------------------------------------------------------
  //
  //  Lifecycle
  //
  // --------------------------------------------------------------------------

  constructor(params?: any) {
    super();
    this._appConfig = AppConfig.appConfig;
  }

  initialize() {
    watchUtils.when(this, "view", () => {
      this._createRoadLayer().then();
    });
  }

  // --------------------------------------------------------------------------
  //
  //  Private Methods
  //
  // --------------------------------------------------------------------------
  private async _createRoadLayer() {
    let { roadLayer } = this;
    const { view } = this;

    const response = await fetch(
      `${this._appConfig.loader.appUrl}/static/data/RoadDamage/Road.json`
    );
    const layerData = await response.json();
    roadLayer = new FeatureLayer({
      objectIdField: "FID",
      source: layerData.features.map((feature: any) => {
        return Graphic.fromJSON(feature);
      }),
      fields: layerData.fields.map((field: any) => {
        return Field.fromJSON(field);
      })
    });

    roadLayer.renderer = new UniqueValueRenderer({
      field: "DAMAGE",
      defaultLabel: "正常",
      defaultSymbol: new SimpleLineSymbol({
        color: "grey",
        width: 2
      }),
      uniqueValueInfos: [
        {
          value: "裂缝",
          symbol: new SimpleLineSymbol({
            color: "red",
            width: 4
          })
        },
        {
          value: "坑塘",
          symbol: new SimpleLineSymbol({
            color: "green",
            width: 4
          })
        }
      ]
    });
    view.map.add(roadLayer);

    // const legend = new Legend({
    //   view,
    //   layerInfos: [
    //     {
    //       layer: roadLayer,
    //       title: "道路病害"
    //     }
    //   ]
    // });
    // view.ui.add(legend, "top-right");
  }
}
