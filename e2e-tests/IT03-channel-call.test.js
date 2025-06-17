import { By, Key, until } from 'selenium-webdriver';
import { getDriver } from './setupDriver.js';
import fs from 'fs';

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

    // 📡 Masuk ke halaman channel
    await driver.wait(until.elementLocated(By.css('a[href="/channel"]')), 5000);
    await driver.findElement(By.css('a[href="/channel"]')).click();
    await driver.wait(until.urlContains("/channel"), 5000);
    console.log("✅ Masuk halaman channel");

    // 👉 Join Channel 
    await driver.wait(until.elementLocated(By.xpath("//button[.//div[contains(text(),'Join Channel')]]")), 5000);
    await driver.findElement(By.xpath("//button[.//div[contains(text(),'Join Channel')]]")).click();
    const select = await driver.wait(
      until.elementLocated(By.css('select.w-full.border.border-gray-300')),
      10000
    );
    await driver.wait(until.elementIsVisible(select), 5000);
    await select.findElement(By.css('option:nth-child(2)')).click();
    await driver.findElement(By.xpath("//button[contains(text(),'Join')]")).click();
    console.log("✅ Join channel berhasil");

    // 📞 Join Channel Call
    await driver.wait(until.elementLocated(By.xpath("//button[contains(., 'Join') and contains(@class, 'bg-green-600')]")), 10000);
    await driver.findElement(By.xpath("//button[contains(., 'Join') and contains(@class, 'bg-green-600')]"))
      .click();
    console.log("✅ Join call berhasil");

    // ⏱️ Tunggu 30 detik sambil tes PTT
    await driver.sleep(5000); // Tunggu call stabil
    console.log("🎤 Simulasi Push-to-Talk (PTT)...");

    // 🔊 Tekan tombol 'l' untuk PTT
    await driver.actions().keyDown('l').perform();
    await driver.sleep(3000); // aktif selama 3 detik
    await driver.actions().keyUp('l').perform();
    console.log("✅ PTT berhasil");

    await driver.sleep(25000); // Sisa waktu sampai 30 detik

    // ❌ Leave call
    await driver.wait(until.elementLocated(By.css('button[title="End Call"]')), 5000);
    await driver.findElement(By.css('button[title="End Call"]')).click();
    console.log("✅ Leave call berhasil");
    await driver.sleep(2000);

    // ❌ Leave channel juga
    const leaveBtn = await driver.wait(
    until.elementLocated(By.xpath("//button[contains(text(),'Leave')]")),
    5000
    );
    await driver.executeScript("arguments[0].scrollIntoView({block: 'center'});", leaveBtn);
    await driver.wait(until.elementIsVisible(leaveBtn), 2000);
    await driver.wait(until.elementIsEnabled(leaveBtn), 2000);
    await leaveBtn.click();
    console.log("✅ Leave channel berhasil");


  } catch (err) {
    console.error("❌ IT-03 Gagal:", err);
    await driver.takeScreenshot().then(img =>
      fs.writeFileSync("debug_IT03.png", img, "base64")
    );
  } finally {
    await driver.quit();
  }
}

main();