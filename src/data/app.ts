import AppConfig from "@/AppConfig";
import TileLayer from "esri/layers/TileLayer";
import EsriMap from "esri/Map";

const appConfig = AppConfig.appConfig;
export const map = new EsriMap({
  basemap: {
    baseLayers: [new TileLayer(appConfig.map.basemaps[0])]
  }
});
