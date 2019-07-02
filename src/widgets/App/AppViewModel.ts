import Accessor from "esri/core/Accessor";
import { whenTrueOnce } from "esri/core/watchUtils";
import EsriMap from "esri/Map";
import SceneView from "esri/views/SceneView";
import Expand from "esri/widgets/Expand";
import Search from "esri/widgets/Search";
import Demo from "@/widgets/Demo";

import {
  declared,
  property,
  subclass
} from "esri/core/accessorSupport/decorators";

export interface AppParams {
  appName: string;
  map: EsriMap;
  view: SceneView;
}

@subclass("widgets.App.AppViewModel")
class AppViewModel extends declared(Accessor) {
  @property() appName: string;

  @property() map: EsriMap;

  @property() view: SceneView;

  constructor(params?: Partial<AppParams>) {
    super(params);
    whenTrueOnce(this, "view.ready").then(() => this._onViewReady());
  }

  private _onViewReady() {
    const { view } = this;
    view.ui.remove("attribution");

    const search = new Search({ view });
    const expand = new Expand({
      content: search
    });
    view.ui.add(expand, "top-right");

    const demo = new Demo({ view });
    view.ui.add(demo, "bottom-left");
  }
}

export default AppViewModel;
