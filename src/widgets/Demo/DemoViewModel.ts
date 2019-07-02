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
  private _initcCamera;

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
      this._initcCamera = this.view.camera;
      this._handles.add(this.view.watch("center, interacting, scale", () =>
        this._onViewChanged()
      ));
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
    const { interacting, scale } = this.view;
    let { center } = this.view;
    if (this.view.spatialReference.isWebMercator) {
      center = webMercatorUtils.webMercatorToGeographic(center) as Point;
    }
    this.state = {
      x: center.x,
      y: center.y,
      interacting,
      scale
    };
  }
}
