import Accessor from "esri/core/Accessor";
import { whenTrueOnce } from "esri/core/watchUtils";
import FeatureLayer from "esri/layers/FeatureLayer";
import EsriMap from "esri/Map";
import SceneView from "esri/views/SceneView";
import Expand from "esri/widgets/Expand";
import Search from "esri/widgets/Search";
import Bookmarks from "../../widgets/Bookmarks";
import Demo from "../../widgets/Demo";

import {
  declared,
  property,
  subclass
} from "esri/core/accessorSupport/decorators";

export interface AppParams {
  appName: string;
  map: EsriMap;
  featureLayer: FeatureLayer;
  view: SceneView;
}

@subclass("widgets.App.AppViewModel")
class AppViewModel extends declared(Accessor) {
  @property() appName: string;

  @property() map: EsriMap;

  @property() featureLayer: FeatureLayer;

  @property() view: SceneView;

  constructor(params?: Partial<AppParams>) {
    super(params);
    whenTrueOnce(this, "view.ready").then(() => this.onload());
  }

  onload() {
    const search = new Search({ view: this.view });
    const expand = new Expand({
      content: search
    });
    this.view.ui.add(expand, "top-right");
    this.view.ui.remove("attribution");

    // console.log(this.view.camera.heading);
    const demo = new Demo({
      name: "herrshi",
      view: this.view
    });
    this.view.ui.add(demo, "bottom-left");

    // const bookmarks = new Bookmarks({
    //   view: this.view
    // });
    // this.view.ui.add(bookmarks, "bottom-right");

    this.featureLayer.when(() => {
      console.log(this.featureLayer.fullExtent.center);
      this.view.goTo({ target: this.featureLayer.fullExtent.center });
    });
  }
}

export default AppViewModel;
