export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      mongoUri: string;
      botToken: string;
      guildId: string;
      webhookUrl: string;
      guildInvite: string;
      minhutApiBase: string;
      enviroment: "dev" | "prod" | "debug";
    }
  }
}
