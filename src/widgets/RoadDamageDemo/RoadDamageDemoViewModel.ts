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

import SceneView from "esri/views/SceneView";
import "esri/widgets/Feature/nls/Feature";
import "esri/widgets/Feature/nls/zh-cn/Feature";
import Legend from "esri/widgets/Legend";
import "esri/widgets/support/nls/uriUtils";
import "esri/widgets/support/nls/zh-cn/uriUtils";
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

  // --------------------------------------------------------------------------
  //
  //  Variables
  //
  // --------------------------------------------------------------------------
  _appConfig: any;
  _roadLayer: FeatureLayer;
  _samplingPointLayer: FeatureLayer;

  // --------------------------------------------------------------------------
  //
  //  Lifecycle
  //
  // --------------------------------------------------------------------------

  constructor(params?: any) {
    super();
    this._appConfig = AppConfig.appConfig;
    this._view_clickHandler = this._view_clickHandler.bind(this);
  }

  initialize() {
    watchUtils.when(this, "view", async view => {
      watchUtils.init(view, "scale", () => this._onViewChanged());
      await this._createRoadLayer();
      await this._createSamplingPointLayer();
      this._onViewChanged();

      const legend = new Legend({
        view,
        layerInfos: [
          {
            layer: this._roadLayer,
            title: "道路病害"
          },
          {
            layer: this._samplingPointLayer,
            title: "道路病害"
          }
        ]
      });
      view.ui.add(legend, "top-right");
    });
  }

  // --------------------------------------------------------------------------
  //
  //  Private Methods
  //
  // --------------------------------------------------------------------------
  private async _createRoadLayer() {
    const { view } = this;

    const fetchResponse = await fetch(
      `${this._appConfig.loader.appUrl}/static/data/RoadDamage/Road.json`
    );
    const layerData = await fetchResponse.json();
    this._roadLayer = new FeatureLayer({
      objectIdField: "FID",
      source: layerData.features.map((feature: any) => {
        return Graphic.fromJSON(feature);
      }),
      fields: layerData.fields.map((field: any) => {
        return Field.fromJSON(field);
      })
    });

    this._roadLayer.renderer = {
      type: "unique-value",
      field: "DAMAGE",
      defaultLabel: "正常",
      defaultSymbol: {
        type: "simple-line",
        color: [0, 163, 0, 0.5],
        width: 4
      },
      uniqueValueInfos: [
        {
          value: "裂缝",
          symbol: {
            type: "simple-line",
            color: "#ffc40d",
            width: 4
          }
        },
        {
          value: "坑塘",
          symbol: {
            type: "simple-line",
            color: "#603cba",
            width: 4
          }
        },
        {
          value: "松散",
          symbol: {
            type: "simple-line",
            color: "#00aba9",
            width: 4
          }
        }
      ]
    } as any;
    view.map.add(this._roadLayer);

    // 点击事件
    await view.whenLayerView(this._roadLayer);
    view.on("immediate-click", (event: any) => this._view_clickHandler(event));
  }

  private async _createSamplingPointLayer() {
    const { view } = this;

    const fetchResponse = await fetch(
      `${this._appConfig.loader.appUrl}/static/data/RoadDamage/SamplingPoint.json`
    );
    const layerData = await fetchResponse.json();
    this._samplingPointLayer = new FeatureLayer({
      objectIdField: "FID",
      source: layerData.features.map((feature: any) => {
        return Graphic.fromJSON(feature);
      }),
      fields: layerData.fields.map((field: any) => {
        return Field.fromJSON(field);
      }),
      outFields: ["*"],
      popupTemplate: {
        title: "{POS}",
        content: [
          {
            type: "fields",
            fieldInfos: [
              {
                fieldName: "DAMAGE",
                label: "病害类型"
              },
              {
                fieldName: "UNIT",
                label: "养护单位"
              }
            ]
          },
          {
            type: "media",
            mediaInfos: [
              {
                type: "image",
                value: {
                  sourceURL: `${this._appConfig.loader.appUrl}/static/data/RoadDamage/img/{PIC}`
                }
              }
            ]
          }
        ]
      }
    });
    this._samplingPointLayer.renderer = {
      type: "unique-value",
      field: "DAMAGE",
      defaultLabel: "正常",
      defaultSymbol: {
        type: "point-3d",
        symbolLayers: [
          {
            type: "object",
            resource: { primitive: "sphere" },
            material: { color: [0, 163, 0, 0.8] },
            width: 15,
            height: 15,
            depth: 15
          }
        ]
      },
      uniqueValueInfos: [
        {
          value: "裂缝",
          symbol: {
            type: "point-3d",
            symbolLayers: [
              {
                type: "object",
                resource: { primitive: "cone" },
                material: { color: "#ffc40d" },
                width: 20,
                height: 20,
                depth: 20
              }
            ]
          }
        },
        {
          value: "坑塘",
          symbol: {
            type: "point-3d",
            symbolLayers: [
              {
                type: "object",
                resource: { primitive: "cone" },
                material: { color: "#603cba" },
                width: 20,
                height: 20,
                depth: 20
              }
            ]
          }
        },
        {
          value: "松散",
          symbol: {
            type: "point-3d",
            symbolLayers: [
              {
                type: "object",
                resource: { primitive: "cone" },
                material: { color: "#00aba9" },
                width: 20,
                height: 20,
                depth: 20
              }
            ]
          }
        }
      ]
    } as any;

    view.map.add(this._samplingPointLayer);
  }

  private async _view_clickHandler(event: any) {
    const { view, _roadLayer } = this;
    const hitResponse = await view.hitTest(event);
    if (hitResponse.results.length) {
      const graphic = hitResponse.results[0].graphic;
      if (
        graphic.layer === _roadLayer &&
        graphic.getAttribute("DAMAGE").trim() !== ""
      ) {
        view.goTo({
          target: graphic,
          tilt: 70
        });
      }
    }
  }

  private _onViewChanged() {
    const { scale } = this.view;
    if (this._roadLayer && this._samplingPointLayer) {
      this._roadLayer.visible = scale >= 6580;
      this._samplingPointLayer.visible = scale < 6580;
    }

    // if (scale >= 6580) {
    //   this._roadLayer.visible = true;
    //   this._samplingPointLayer.visible = false;
    // }
  }
}
