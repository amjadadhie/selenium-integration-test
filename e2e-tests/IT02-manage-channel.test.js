import { By, until } from 'selenium-webdriver';
import { getDriver } from './setupDriver.js';
import fs from 'fs';

async function main() {
  const driver = await getDriver();
  try {
    // 🔐 Login
    await driver.get("http://pttalk.id/login");
    await driver.wait(until.elementLocated(By.id("username")), 10000);
    await driver.findElement(By.id("username")).sendKeys("tes");
    await driver.findElement(By.id("password")).sendKeys("tes");
    await driver.findElement(By.css("button[type='submit']")).click();
    await driver.wait(until.urlContains("/contact"), 5000);
    console.log("✅ Login berhasil");

    // 📡 Navigasi ke halaman Channel
    await driver.wait(until.elementLocated(By.css('a[href="/channel"]')), 5000);
    await driver.findElement(By.css('a[href="/channel"]')).click();
    await driver.wait(until.urlContains("/channel"), 5000);
    console.log("✅ Masuk halaman channel");

    // 👉 Klik tombol "Join Channel"
    await driver.wait(until.elementLocated(By.xpath("//button[.//div[contains(text(),'Join Channel')]]")), 5000);
    await driver.findElement(By.xpath("//button[.//div[contains(text(),'Join Channel')]]")).click();
    console.log("✅ Klik Join Channel");

    // ⏳ Tunggu <select> muncul di modal dan pilih option ke-2
    const select = await driver.wait(
      until.elementLocated(By.css('select.w-full.border.border-gray-300')),
      10000
    );
    await driver.wait(until.elementIsVisible(select), 5000);
    await select.findElement(By.css('option:nth-child(2)')).click();
    console.log("✅ Channel dipilih dari dropdown");

    // 🟢 Klik tombol "Join"
    await driver.findElement(By.xpath("//button[contains(text(),'Join')]")).click();
    console.log("✅ Berhasil join ke channel");
    await driver.sleep(2000)

    // ❌ Klik tombol "Leave"
    await driver.wait(until.elementLocated(By.xpath("//button[contains(text(),'Leave')]")), 5000);
    await driver.findElement(By.xpath("//button[contains(text(),'Leave')]")).click();
    console.log("✅ Berhasil leave channel");
    await driver.sleep(4000);

    // ➕ Klik tombol "Create Channel"
    await driver.findElement(By.xpath("//button[.//div[contains(text(),'Create Channel')]]")).click();
    await driver.wait(until.elementLocated(By.id("name")), 5000);
    await driver.findElement(By.id("name")).sendKeys("Channel Selenium");
    await driver.findElement(By.xpath("//button[contains(text(),'Create')]")).click();
    console.log("✅ Channel baru berhasil dibuat");

    // ✏️ Klik tombol Edit Channel
    await driver.wait(until.elementLocated(By.css('button[title="Edit Channel"]')), 5000);
    await driver.findElement(By.css('button[title="Edit Channel"]')).click();
    await driver.wait(until.elementLocated(By.id("name")), 5000);
    await driver.findElement(By.id("name")).clear();
    await driver.findElement(By.id("name")).sendKeys("Channel Selenium Edited");
    await driver.findElement(By.xpath("//button[contains(text(),'Save')]")).click();
    console.log("✅ Channel berhasil diedit");

    // 🗑️ Klik tombol Delete Channel
    await driver.wait(until.elementLocated(By.css('button[title="Delete Channel"]')), 5000);
    await driver.findElement(By.css('button[title="Delete Channel"]')).click();

    // 🔴 Konfirmasi Hapus
    await driver.wait(until.elementLocated(By.xpath("//button[contains(text(),'Hapus')]")), 5000);
    await driver.findElement(By.xpath("//button[contains(text(),'Hapus')]")).click();
    console.log("✅ Channel berhasil dihapus");

  } catch (err) {
    console.error("❌ IT-02 Gagal:", err);
    await driver.takeScreenshot().then(img =>
      fs.writeFileSync("debug_IT02.png", img, "base64")
    );
  } finally {
    await driver.quit();
  }
}

main();
