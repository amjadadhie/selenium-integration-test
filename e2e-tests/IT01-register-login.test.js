import { By, until } from 'selenium-webdriver';
import { getDriver } from './setupDriver.js';

async function main() {
  const driver = await getDriver();
  try {
    await driver.get("http://pttalk.id/register");
    console.log("🔎 Membuka halaman register...");

    await driver.wait(until.elementLocated(By.id("username")), 10000);
    await driver.findElement(By.id("username")).sendKeys("amjad_tes3");
    await driver.findElement(By.id("password")).sendKeys("123456");

    await driver.findElement(By.css("button[type='submit']")).click();

    await driver.wait(until.urlContains("/login"), 5000);

    await driver.wait(until.elementLocated(By.id("username")), 5000);
    await driver.findElement(By.id("username")).sendKeys("amjad_test3");
    await driver.findElement(By.id("password")).sendKeys("123456");
    await driver.findElement(By.css("button[type='submit']")).click();

    await driver.wait(until.urlContains("/contact"), 5000);
    console.log("✅ IT-01: Register & Login berhasil");

  } catch (err) {
    console.error("❌ IT-01 Gagal:", err);
    await driver.takeScreenshot().then(function (image) {
      require("fs").writeFileSync("debug_screenshot.png", image, "base64");
    });
  } finally {
    await driver.quit();
  }
}

main();
