import Demo from "@/widgets/Demo";
import RoadDamageDemo from "@/widgets/RoadDamageDemo";
import Accessor from "esri/core/Accessor";

import {declared, property, subclass} from "esri/core/accessorSupport/decorators";
import {whenTrueOnce} from "esri/core/watchUtils";
import EsriMap from "esri/Map";
import SceneView from "esri/views/SceneView";

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

    const demo = new Demo({ view });
    view.ui.add(demo, "bottom-left");

    const roadDamage = new RoadDamageDemo({view});
    view.ui.add(roadDamage, "top-right");
  }
}

export default AppViewModel;
