// import "./config";
import AppConfig from "@/AppConfig";

import "@dojo/framework/shim/Promise";

import App from "./widgets/App";

interface AppParam {
  configUrl: string;
  container?: string;
}

class TGISMap {
  static async createMap(param: AppParam) {
    await AppConfig.loadAppConfig(param.configUrl);
    // @ts-ignore
    const app = new App({
      container: document.getElementById(
        param.container || "app"
      ) as HTMLElement
    });
  }
}

(window as any).TGISMap = TGISMap;

/**
 * Initialize application
 */
// export const app = new App({
//   appName: "Template App",
//   container: document.getElementById("app") as HTMLElement
// });
