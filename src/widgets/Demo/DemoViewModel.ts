import Accessor from "esri/core/Accessor";

import { declared, property, subclass } from "esri/core/accessorSupport/decorators";
import SceneView from "esri/views/SceneView";

@subclass("app.widgets.Demo.DemoViewModel")
export default class DemoViewModel extends declared(Accessor) {

  @property() name = "Slagathor";

  @property() view: SceneView;

  constructor(params?: any) {
    super();
  }

}
