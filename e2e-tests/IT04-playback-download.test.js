import { By, until } from "selenium-webdriver";
import { getDriver } from "./setupDriver.js";
import fs from "fs";

async function main() {
  const driver = await getDriver();
  try {
    // 🔐 Login
    await driver.get("http://pttalk.id/login");
    await driver.wait(until.elementLocated(By.id("username")), 10000);
    await driver.findElement(By.id("username")).sendKeys("amjad_test");
    await driver.findElement(By.id("password")).sendKeys("123456");
    await driver.findElement(By.css("button[type='submit']")).click();
    await driver.wait(until.urlContains("/contact"), 5000);
    console.log("✅ Login berhasil");

    // 🎵 Buka halaman Recordings
    await driver.wait(until.elementLocated(By.css('a[href="/recordings"]')), 5000);
    await driver.findElement(By.css('a[href="/recordings"]')).click();
    await driver.wait(until.urlContains("/recordings"), 5000);
    console.log("✅ Halaman recordings terbuka");

    // 🎧 Klik tombol "Channel Call"
    await driver.wait(until.elementLocated(By.xpath("//button[.//div[contains(text(),'Channel Call')]]")), 5000);
    await driver.findElement(By.xpath("//button[.//div[contains(text(),'Channel Call')]]")).click();
    console.log("✅ Klik tombol Channel Call");

    // ⬇️ Klik tombol Download Log Activity
    await driver.wait(until.elementLocated(By.xpath("//a[contains(text(), 'Log Activity')]")), 10000);
    await driver.findElement(By.xpath("//a[contains(text(), 'Log Activity')]"))
      .click();
    console.log("✅ Log Activity diunduh");

    // ▶️ Klik tombol Play
    await driver.wait(until.elementLocated(By.css(".rhap_play-pause-button")), 10000);
    await driver.findElement(By.css(".rhap_play-pause-button")).click();
    console.log("✅ Playback dimulai");

    // ⏳ Tunggu 30 detik
    await driver.sleep(30000);
    console.log("⏱️ Tunggu 30 detik selesai");


  } catch (err) {
    console.error("❌ IT-04 Gagal:", err);
    await driver.takeScreenshot().then(img =>
      fs.writeFileSync("debug_IT04.png", img, "base64")
    );
  } finally {
    await driver.quit();
  }
}

main();
