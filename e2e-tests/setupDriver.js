import { Builder } from "selenium-webdriver";

export async function getDriver() {
  return await new Builder().forBrowser("chrome").build();
}
