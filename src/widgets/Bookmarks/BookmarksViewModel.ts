import Accessor from "esri/core/Accessor";

import {declared, property, subclass} from "esri/core/accessorSupport/decorators";
import Collection from "esri/core/Collection";

import Handles from "esri/core/Handles";
import promiseUtils from "esri/core/promiseUtils";
import watchUtils from "esri/core/watchUtils";
import EsriMap from "esri/Map";
import SceneView from "esri/views/SceneView";
import BookmarkItem from "./BookmarkItem";

const BookmarkItemCollection = Collection.ofType(BookmarkItem);

type State = "ready" | "loading" | "disabled";

@subclass("app.widgets.Bookmarks.BookmarksViewModel")
export default class BookmarksViewModel extends declared(Accessor) {
  // --------------------------------------------------------------------------
  //
  //  Properties
  //
  // --------------------------------------------------------------------------

  // ----------------------------------
  //  bookmarkItems
  // ----------------------------------
  @property({
    type: BookmarkItemCollection
  })
  bookmarkItems: Collection<BookmarkItem> = new BookmarkItemCollection();

  // ----------------------------------
  //  state
  // ----------------------------------
  @property({
    dependsOn: ["view.ready"],
    readOnly: true
  })
  get state(): State {
    return this.view.ready ? "ready" : this.view ? "loading" : "disabled";
  }
  // ----------------------------------
  //  view
  // ----------------------------------
  @property() view: SceneView;

  // --------------------------------------------------------------------------
  //
  //  Variables
  //
  // --------------------------------------------------------------------------
  private handles: Handles = new Handles();

  // --------------------------------------------------------------------------
  //
  //  Lifecycle
  //
  // --------------------------------------------------------------------------

  initialize() {
    this.handles.add(
      watchUtils.init(this, "view", view => {
        this._viewUpdated(view);
      })
    );
  }

  destroy() {
    this.handles.destroy();
    this.bookmarkItems.removeAll();
  }

  // --------------------------------------------------------------------------
  //
  //  Public Methods
  //
  // --------------------------------------------------------------------------
  goTo(bookmarkItem: BookmarkItem): IPromise<any> {
    if (!bookmarkItem) {
      return promiseUtils.reject(new Error("BookmarkItem is required"));
    }

    if (!this.view) {
      return promiseUtils.reject(new Error("View is required"));
    }

    bookmarkItem.active = true;

    const goTo = this.view.goTo(bookmarkItem.extent);
    goTo.then(() => {
      bookmarkItem.active = false;
    }).otherwise(() => {
      bookmarkItem.active = false;
    });

    return goTo;
  }

  // --------------------------------------------------------------------------
  //
  //  Private Methods
  //
  // --------------------------------------------------------------------------
  private _viewUpdated(view: SceneView) {
    const mapHandleKey = "map";

    this.handles.remove(mapHandleKey);

    if (!view) {
      return;
    }

    view.when(() => {
      this.handles.add(
        watchUtils.init(view, "map", map => this._mapUpdated(map)),
        mapHandleKey
      );
    });
  }

  private _mapUpdated(map: EsriMap) {
    if (!map) {
      return;
    }

    const bookmarks = map.get<BookmarkItem[]>("bookmarks");
    this.bookmarkItems.removeAll();
    this.bookmarkItems.addMany(bookmarks);
  }
}
