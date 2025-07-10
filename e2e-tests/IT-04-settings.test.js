import { By, until } from "selenium-webdriver";
import { getDriver } from "./setupDriver.js";
import fs from "fs";
import assert from "assert";

async function testUserPTTSettingIT04() {
  const driver = await getDriver();
  try {
    // === LOGIN ===
    await driver.get("http://pttalk.id/login");
    await driver.findElement(By.id("username")).sendKeys("raka1");
    await driver.findElement(By.id("password")).sendKeys("raka1");
    await driver.findElement(By.css("button[type='submit']")).click();
    await driver.wait(until.urlContains("/contact"), 10000);
    console.log("✅ Login berhasil");

    // === BUKA HALAMAN SETTINGS ===
    await driver.get("http://pttalk.id/settings");
    await driver.wait(
      until.elementLocated(By.xpath("//h1[contains(text(), 'Settings')]")),
      5000
    );
    console.log("✅ Halaman pengaturan berhasil dimuat");

    // === IT-04: UBAH DAN SIMPAN PTT KEY ===

    // Klik tombol PTT Key untuk memulai ganti key
    const pttKeyBtn = await driver.findElement(
      By.xpath("//button[contains(text(), 'Current')]")
    );
    await pttKeyBtn.click();
    console.log("⌨️ Tombol PTT Key diklik");

    // Kirim key baru misalnya "z"
    await driver.actions().sendKeys("z").perform();
    console.log("📝 PTT Key baru diketik: z");

    // Klik tombol Save
    const saveBtn = await driver.findElement(
      By.xpath("//button[contains(text(), 'Save Settings')]")
    );
    await saveBtn.click();
    console.log("💾 Tombol Save Settings diklik");

    // Tunggu notifikasi berhasil
    await driver.wait(
      until.elementLocated(
        By.xpath("//*[contains(text(), 'Pengaturan berhasil disimpan')]")
      ),
      8000
    );
    console.log("✅ Notifikasi berhasil disimpan muncul");

    // Verifikasi teks tombol PTT Key sudah berubah menjadi Current: z
    const newPTTText = await driver.findElement(
      By.xpath("//button[contains(text(), 'Current: z')]")
    );
    assert.ok(await newPTTText.isDisplayed());
    console.log("✅ PTT Key tersimpan dan UI menampilkan Current: z");
  } catch (err) {
    console.error("❌ Gagal IT-04:", err.message);
    await driver
      .takeScreenshot()
      .then((img) => fs.writeFileSync("debug_IT04.png", img, "base64"));
  } finally {
    await driver.quit();
  }
}

testUserPTTSettingIT04();
