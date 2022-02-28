import { Minehut } from "../Minehut";
import { Addon } from "./Addon";
import fetch from "cross-fetch";
import { AddonResponse } from "./AddonResponse";
import { SUPER_LEAGUE_MERCHANDISE } from "../constants";
import NodeCache from "node-cache";

const addonCache = new NodeCache({
  stdTTL: 30 * 60, // * 30 minutes
  checkperiod: 10 * 60, // * 10 minutes
});

export class AddonManager {
  constructor(public readonly client: Minehut) {}

  async fetch(idOrName: string) {
    return (await this.fetchAll())?.find(
      (addon) =>
        idOrName === addon.id ||
        idOrName.toLowerCase() === addon.title.toLowerCase()
    );
  }

  async search(query: string) {
    const exact = await this.fetch(query);
    if (exact) return [exact];
    return (
      (await this.fetchAll())?.filter((addon) =>
        addon.title.toLowerCase().includes(query.toLowerCase())
      ) || null
    );
  }

  async fetchAll() {
    if (addonCache.has("addons")) {
      return (addonCache.get("addons") as AddonResponse[]).map(
        (i) => new Addon(i)
      );
    }

    return await fetch(
      `${SUPER_LEAGUE_MERCHANDISE}/merchandise/v1/merchandise/products/?populateVersions=true`
    )
      .then((res) => res.json())
      .then((res) => res.products)
      .then((res: AddonResponse[]) => {
        addonCache.set("addons", res);

        return res.map((i) => new Addon(i));
      })
      .catch(() => {
        return;
      });
  }
}
