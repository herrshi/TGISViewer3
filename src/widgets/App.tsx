import esri = __esri;
import AppConfig from "@/AppConfig";

import {
  aliasOf,
  declared,
  property,
  subclass
} from "esri/core/accessorSupport/decorators";

import FeatureLayer from "esri/layers/FeatureLayer";
import EsriMap from "esri/Map";
import SceneView from "esri/views/SceneView";
import { tsx } from "esri/widgets/support/widget";
import Widget from "esri/widgets/Widget";

import AppViewModel, { AppParams } from "./App/AppViewModel";

interface AppViewParams extends AppParams, esri.WidgetProperties {}

const CSS = {
  base: "main",
  webmap: "webmap"
};

@subclass("app.widgets.App")
export default class App extends declared(Widget) {
  @property() viewModel = new AppViewModel();

  @aliasOf("viewModel.appName") appName: string;

  @aliasOf("viewModel.featureLayer") featureLayer: FeatureLayer;

  @aliasOf("viewModel.map") map: EsriMap;

  @aliasOf("viewModel.view") view: SceneView;

  constructor(params: Partial<AppViewParams>) {
    super(params);
  }

  render() {
    return (
      <div class={CSS.base}>
        <div class={CSS.webmap} bind={this} afterCreate={this.onAfterCreate} />
      </div>
    );
  }

  private onAfterCreate(element: HTMLDivElement) {
    const appConfig = AppConfig.appConfig;
    import("@/data/app").then(({ map }) => {
      this.view = new SceneView({
        map,
        container: element,
        ...appConfig.viewOptions
      });
    });
  }
}
