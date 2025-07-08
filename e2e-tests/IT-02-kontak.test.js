import { By, until } from "selenium-webdriver";
import { getDriver } from "./setupDriver.js";
import fs from "fs";
import assert from "assert"; // ✅ Tambahkan ini untuk fungsi assert.ok

async function main() {
  const driver = await getDriver();
  try {
    // 🔐 Login
    await driver.get("http://pttalk.id/login");
    await driver.wait(until.elementLocated(By.id("username")), 10000);
    await driver.findElement(By.id("username")).sendKeys("raka1");
    await driver.findElement(By.id("password")).sendKeys("raka1");
    await driver.findElement(By.css("button[type='submit']")).click();
    await driver.wait(until.urlContains("/contact"), 5000);
    console.log("✅ Login berhasil");

    // === IT-02-1: Tampilkan daftar kontak dan status ===
    const contactBox = await driver.wait(
      until.elementLocated(By.css("div.bg-\\[\\#292b2f\\]")),
      5000
    );
    const statusText = await contactBox
      .findElement(
        By.xpath(
          ".//p[contains(text(), 'Online') or contains(text(), 'Offline')]"
        )
      )
      .getText();
    assert.ok(statusText === "Online" || statusText === "Offline");
    console.log("✅ IT-02-1: Kontak & status kehadiran ditampilkan");

    // === IT-02-2: Tambah kontak berhasil ===
    await driver.wait(
      until.elementLocated(
        By.xpath("//button[.//div[contains(text(),'Add Contact')]]")
      ),
      5000
    );
    await driver
      .findElement(By.xpath("//button[.//div[contains(text(),'Add Contact')]]"))
      .click();
    console.log("✅ Klik Add Contact");

    await driver.wait(until.elementLocated(By.id("username")), 5000);
    await driver.findElement(By.id("username")).clear();
    await driver.findElement(By.id("username")).sendKeys("amjad_test");
    await driver.findElement(By.id("name")).clear();
    await driver.findElement(By.id("name")).sendKeys("tes tambah");
    await driver
      .findElement(By.xpath("//button[contains(text(),'Add')]"))
      .click();

    await driver.sleep(1000); // kecil delay sebelum toast
    await driver.wait(
      until.elementLocated(
        By.xpath("//*[contains(text(), 'Kontak berhasil ditambahkan')]")
      ),
      8000
    );
    console.log("✅ IT-02-2: Berhasil menambahkan kontak");

    // === IT-02-3: Tambah kontak gagal (sudah ada / tidak valid) ===
    await driver
      .findElement(By.xpath("//button[.//div[contains(text(),'Add Contact')]]"))
      .click();
    await driver.wait(until.elementLocated(By.id("username")), 5000);
    await driver.findElement(By.id("username")).clear();
    await driver.findElement(By.id("username")).sendKeys("febry1");
    await driver.findElement(By.id("name")).clear();
    await driver.findElement(By.id("name")).sendKeys("tes tambah");
    await driver
      .findElement(By.xpath("//button[contains(text(),'Add')]"))
      .click();

    await driver.sleep(1000);
    await driver.wait(
      until.elementLocated(
        By.xpath("//*[contains(text(), 'Gagal menambahkan kontak')]")
      ),
      8000
    );
    console.log("✅ IT-02-3: Gagal menambahkan kontak");

    // 🧹 Cancel modal
    const cancelBtn = await driver.findElement(
      By.xpath("//button[contains(text(),'Cancel')]")
    );
    await cancelBtn.click();

    // === IT-02-4: Hapus kontak bernama amjad_test ===
    console.log("🗑️ Mencari dan menghapus kontak 'amjad_test'...");

    // Temukan contact card berdasarkan nama
    const contactCard = await driver.findElement(
      By.xpath(
        `//h1[text()='amjad_test']/ancestor::div[contains(@class, 'bg-')]`
      )
    );

    // Temukan tombol Delete di dalam card tersebut
    const deleteBtn = await contactCard.findElement(
      By.xpath(".//button[normalize-space()='Delete']")
    );

    // Klik tombol delete
    await deleteBtn.click();

    // Tunggu toast atau notifikasi berhasil
    await driver.wait(
      until.elementLocated(
        By.xpath("//*[contains(text(), 'Kontak berhasil dihapus')]")
      ),
      5000
    );
    console.log("✅ IT-02-4: Kontak 'amjad_test' berhasil dihapus");
  } catch (err) {
    console.error("❌ IT-02 Gagal:", err);
    await driver
      .takeScreenshot()
      .then((img) => fs.writeFileSync("debug_IT02.png", img, "base64"));
  } finally {
    await driver.quit();
  }
}

main();
