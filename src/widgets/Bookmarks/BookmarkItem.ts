import Accessor from "esri/core/Accessor";
import {declared, property, subclass} from "esri/core/accessorSupport/decorators";
import Extent from "esri/geometry/Extent";

@subclass("app.widgets.Bookmarks.BookmarkItem")
export default class BookmarkItem extends declared(Accessor){
  @property() active = false;

  @property({
    type: Extent
  })
  extent: Extent;

  @property() name: string;
}
