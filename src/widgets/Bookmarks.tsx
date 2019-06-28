import {aliasOf, declared, property, subclass} from "esri/core/accessorSupport/decorators";
import Handles from "esri/core/Handles";
import watchUtils from "esri/core/watchUtils";
import SceneView from "esri/views/SceneView";
import {accessibleHandler, cssTransition, renderable, tsx} from "esri/widgets/support/widget";
import Widget from "esri/widgets/Widget";
import BookmarkItem from "./Bookmarks/BookmarkItem";
import BookmarksViewModel from "./Bookmarks/BookmarksViewModel";

const CSS = {
  base: "esri-widget bookmarks-base",
  loading: "bookmarks-base__loading",
  loadingIcon: "esri-icon-loading-indicator esri-rotating",
  fadeIn: "bookmarks-base--fade-in",
  iconClass: "esri-icon-labels",
  bookmarkList: "bookmarks-base__list",
  bookmarkItem: "bookmarks-base__item",
  bookmarkItemIcon: "bookmarks-base__item-icon",
  bookmarkItemName: "bookmarks-base__item-name",
  bookmarkItemActive: "bookmarks-base__item--active"
};

@subclass("app.widgets.Bookmarks")
export default class Bookmarks extends declared(Widget) {
  // --------------------------------------------------------------------------
  //
  //  Properties
  //
  // --------------------------------------------------------------------------

  // ----------------------------------
  //  iconClass
  // ----------------------------------
  @property()
  iconClass = CSS.iconClass;

  // ----------------------------------
  //  view
  // ----------------------------------
  @aliasOf("viewModel.view")
  view: SceneView;

  // ----------------------------------
  //  viewModel
  // ----------------------------------
  @property({
    type: BookmarksViewModel
  })
  @renderable(["state"])
  viewModel: BookmarksViewModel = new BookmarksViewModel();

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

  constructor(params?: any) {
    super();
  }

  postInitialize() {
    this.own(
      watchUtils.on(this, "viewModel.bookmarkItems", "change", () => this._bookmarkItemsChanged())
    );

    this._bookmarkItemsChanged();
  }

  // --------------------------------------------------------------------------
  //
  //  Public Methods
  //
  // --------------------------------------------------------------------------

  render() {
    const fadeInAnimation = cssTransition("enter", CSS.fadeIn);

    const loadingNode = (
      <div class={CSS.loading}>
        <span class={CSS.loadingIcon} />
      </div>
    );

    const bookmarkNodes = this._renderBookmarks();

    const { state } = this.viewModel;

    const bookmarkListNode = state === "ready" && bookmarkNodes.length ? [
        <ul
          enterAnimation={fadeInAnimation}
          class={CSS.bookmarkList}
        >{bookmarkNodes}</ul>
      ] :
      state === "loading" ?
        loadingNode :
        null;

    return (
      <div class={CSS.base}>{bookmarkListNode}</div>
    );
  }

  // --------------------------------------------------------------------------
  //
  //  Private Methods
  //
  // --------------------------------------------------------------------------

  private _renderBookmarks(): any {
    const { bookmarkItems } = this.viewModel;

    return bookmarkItems
      .toArray()
      .map(bookmarkItem => this._renderBookmark(bookmarkItem));
  }

  private _renderBookmark(bookmarkItem: BookmarkItem): any {
    const { active, name } = bookmarkItem;

    const bookmarkItemClasses = {
      [CSS.bookmarkItemActive]: active
    };

    return (
      <li
        bind={this}
        data-bookmark-item={bookmarkItem}
        class={this.classes(CSS.bookmarkItem, bookmarkItemClasses)}
        onclick={this._goToBookmark}
        onkeydown={this._goToBookmark}
        tabIndex={0}
        role="button"
        aria-label={name}
      >
        <span class={this.classes(CSS.iconClass, CSS.bookmarkItemIcon)} />
        <span class={CSS.bookmarkItemName}>{name}</span>
      </li>
    );
  }

  private _bookmarkItemsChanged(): void {
    const itemsKey = "items";
    const { bookmarkItems } = this.viewModel;

    this.handles.remove(itemsKey);

    const handles = bookmarkItems.map(bookmarkItem => {
      return watchUtils.watch(bookmarkItem, ["active", "name"], () =>
        this.scheduleRender()
      );
    });

    this.handles.add(handles, itemsKey);

    this.scheduleRender();
  }

  @accessibleHandler()
  private _goToBookmark(event: Event): void {
    const node = event.currentTarget as Element;
    const bookmarkItem = node["data-bookmark-item"] as BookmarkItem;
    this.viewModel.goTo(bookmarkItem);
  }
}
