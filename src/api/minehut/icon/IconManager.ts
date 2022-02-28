import { Minehut } from "../Minehut";
import { Icon } from "./Icon";
import fetch from "cross-fetch";
import { IconResponse } from "./IconResponse";

export class IconManager {
  private client: Minehut;
  private store!: Icon[];

  constructor(client: Minehut) {
    this.client = client;
    this.store = [];
  }

  // No byName option for IconManager#get, yet...
  async fetch(icons: string[]) {
    const allIcons: Icon[] = await this.fetchAll();
    const found = allIcons.filter((icon) => icons.includes(icon.id));
    if (found.length < 1) return [] as Icon[];
    return found;
  }

  private async fetchAll() {
    return await fetch(`${this.client.API_BASE}/servers/icons`)
      .then((res) => res.json())
      .then((res: IconResponse[]) => {
        const icons = res.map((i) => new Icon(i));
        // TODO: Add cache so that the API isn't constantly called
        return icons;
      })
      .catch();
  }
}
