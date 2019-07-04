import Accessor from "esri/core/Accessor";

import {
  declared,
  property,
  subclass
} from "esri/core/accessorSupport/decorators";
import Handles from "esri/core/Handles";
import watchUtils = require("esri/core/watchUtils");
import Point from "esri/geometry/Point";
import webMercatorUtils = require("esri/geometry/support/webMercatorUtils");
import SceneView from "esri/views/SceneView";
import { renderable } from "esri/widgets/support/widget";

interface Center {
  x: number;
  y: number;
}

interface State extends Center {
  interacting: boolean;
  z: number;
  tilt: number;
  heading: number;
  scale: number;
}

@subclass("app.widgets.Demo.DemoViewModel")
export default class DemoViewModel extends declared(Accessor) {
  // --------------------------------------------------------------------------
  //
  //  Properties
  //
  // --------------------------------------------------------------------------

  // ----------------------------------
  //  state
  // ----------------------------------
  @property()
  @renderable()
  state: State;

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
  private _handles: Handles = new Handles();

  // --------------------------------------------------------------------------
  //
  //  Lifecycle
  //
  // --------------------------------------------------------------------------

  constructor(params?: any) {
    super(params);
  }

  initialize() {
    watchUtils.when(this, "view", () => {
      this._handles.add(
        watchUtils.init(this.view, "center, interacting, scale", () =>
          this._onViewChanged()
        )
      );
      this._onViewChanged();
    });
  }

  destroy(): void {
    this._handles.removeAll();
  }

  // --------------------------------------------------------------------------
  //
  //  Private Methods
  //
  // --------------------------------------------------------------------------
  private _onViewChanged() {
    const { interacting, camera, scale } = this.view;
    // let { camera } = this.view;
    let {position} = camera;
    if (this.view.spatialReference.isWebMercator) {
      position = webMercatorUtils.webMercatorToGeographic(position) as Point;
    }
    this.state = {
      x: position.x,
      y: position.y,
      z: position.z,
      interacting,
      tilt: camera.tilt,
      heading: camera.heading,
      scale
    };
  }
}
