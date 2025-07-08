import { By, until } from "selenium-webdriver";
import { getDriver } from "./setupDriver.js";
import assert from "assert";

async function runTest() {
  const driver = await getDriver();

  try {
    // =============================
    // IT-01-1: Login Berhasil
    // =============================
    await driver.get("http://pttalk.id/login");
    console.log("🔎 Membuka halaman login...");

    await driver.wait(until.elementLocated(By.id("username")), 5000);
    await driver.findElement(By.id("username")).sendKeys("amjad_test5");
    await driver.findElement(By.id("password")).sendKeys("123456");
    await driver.findElement(By.css("button[type='submit']")).click();

    await driver.wait(until.urlContains("/contact"), 5000);
    console.log("✅ IT-01-1: Login berhasil redirect ke /contact");

    // =============================
    // IT-01-3: Logout Berhasil
    // =============================
    const logoutButton = await driver.findElement(By.css("button.p-2.rounded-full"));
    await logoutButton.click();
    console.log("🔒 Logout modal ditampilkan");

    const confirmLogout = await driver.wait(
      until.elementLocated(By.xpath("//button[contains(text(),'Ya')]")),
      5000
    );
    await confirmLogout.click();

    await driver.wait(until.urlContains("/login"), 5000);
    console.log("✅ IT-01-3: Logout berhasil kembali ke login");

    // =============================
    // IT-01-2: Login Gagal
    // =============================
    await driver.findElement(By.id("username")).clear();
    await driver.findElement(By.id("password")).clear();
    await driver.findElement(By.id("username")).sendKeys("salah_user");
    await driver.findElement(By.id("password")).sendKeys("salah_password");
    await driver.findElement(By.css("button[type='submit']")).click();

    const errorElement = await driver.wait(
      until.elementLocated(By.xpath("//*[contains(text(), 'Invalid username or password')]")),
      5000
    );

    const errorText = await errorElement.getText();
    assert.ok(errorText.includes("Invalid username or password"));
    console.log("✅ IT-01-2: Login gagal memunculkan pesan error");

  } catch (err) {
    console.error("❌ Terjadi error saat pengujian:", err);
    const image = await driver.takeScreenshot();
    require("fs").writeFileSync("screenshot_debug.png", image, "base64");
  } finally {
    await driver.quit();
  }
}

runTest();
