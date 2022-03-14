import { Addon } from "../src/api/minehut/addon/Addon";
import { Minehut } from "../src/api/minehut/Minehut";

describe("API", () => {
  let minehut: Minehut;

  beforeEach(() => {
    minehut = new Minehut();
  });

  it("can get addons", async () => {
    const addons = await minehut.addons.fetchAll();

    expect(addons).toBeInstanceOf(Array);
  });

  it("can get icons", async () => {
    const icons = await minehut.icons.fetchAll();

    expect(icons).toBeInstanceOf(Array);
  });

  it("can get player", async () => {
    const player = await minehut.players.find("yes");

    console.log(player);

    expect(player).toBeInstanceOf(Array);
  });

  it("can get icons", async () => {
    const addons = await minehut.icons.fetchAll();

    expect(addons).toBeInstanceOf(Array);
  });
  // it("can get player");
  // it("can get plugins");
  // it("can get server");
  // it("can get servers");
  // it("can get stats");
});
