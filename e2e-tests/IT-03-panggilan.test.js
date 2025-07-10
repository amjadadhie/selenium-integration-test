import { By, until } from "selenium-webdriver";
import { getDriver } from "./setupDriver.js";
import fs from "fs";
import assert from "assert";

async function testCallFlowIT03() {
  const driver = await getDriver();
  const targetUsername = "tes2"; // 🔧 Ganti ini sesuai username yang ingin dipanggil

  try {
    // === LOGIN SEBAGAI CALLER ===
    await driver.get("http://pttalk.id/login");
    await driver.findElement(By.id("username")).sendKeys("raka1");
    await driver.findElement(By.id("password")).sendKeys("raka1");
    await driver.findElement(By.css("button[type='submit']")).click();
    await driver.wait(until.urlContains("/contact"), 10000);
    console.log("✅ Login berhasil");

    // === CARI KONTAK BERDASARKAN USERNAME ===
    const contactCard = await driver.findElement(
      By.xpath(
        `//div[contains(@class,'bg-[#292b2f]') and .//h2[text()='${targetUsername}']]`
      )
    );

    const callButton = await contactCard.findElement(
      By.xpath(".//button[.//text()='Call' or .//*[name()='svg']]")
    );

    const isDisabled = await callButton.getAttribute("disabled");
    if (isDisabled !== null) {
      throw new Error(
        `❌ User '${targetUsername}' sedang offline, tombol Call disabled`
      );
    }

    // === IT-03-1: Panggil user ===
    await callButton.click();
    console.log(`📞 Panggilan ke '${targetUsername}' dimulai`);

    await driver.wait(
      until.elementLocated(
        By.xpath(
          "//*[contains(text(),'Calling') or contains(text(),'Memanggil')]"
        )
      ),
      10000
    );
    console.log("✅ UI Call muncul, status 'Calling' tampil");

    // === IT-03-2: Tunggu ditolak ===
    console.log("⏳ Tunggu callee menolak panggilan (manual)");
    await driver.sleep(5000);

    const currentUrl = await driver.getCurrentUrl();
    if (currentUrl.includes("/contact")) {
      console.log("✅ Panggilan ditolak, kembali ke halaman contact");
    } else {
      console.log(
        "⚠️ Tidak kembali ke /contact, lanjut ke simulasi accept call"
      );
    }

    // === IT-03-3: Coba call lagi dan diterima ===
    await callButton.click();
    console.log("📞 Panggilan ulang ke callee");

    await driver.wait(
      until.elementLocated(
        By.xpath(
          "//*[contains(text(),'Calling') or contains(text(),'Memanggil')]"
        )
      ),
      10000
    );
    console.log("✅ Status 'Calling' tampil kembali");

    console.log("⏳ Tunggu callee menerima panggilan (manual)");
    await driver.sleep(5000);

    const inCallStatus = await driver.findElement(
      By.xpath(
        "//*[contains(text(),'In Call') or contains(text(),'Sedang panggilan')]"
      )
    );
    assert.ok(await inCallStatus.isDisplayed());
    console.log("✅ Kedua user masuk sesi call");

    // === IT-03-4: PTT dan End Call ===
    const pttButton = await driver.findElement(By.id("ptt-button"));
    await pttButton.click();
    console.log("🎤 Tombol PTT ditekan");
    await driver.sleep(2000);
    await pttButton.click();
    console.log("🔇 Tombol PTT dilepas");

    const endCallBtn = await driver.findElement(By.id("end-call"));
    await endCallBtn.click();
    console.log("❌ Tombol End Call ditekan");

    await driver.wait(until.urlContains("/contact"), 10000);
    console.log("✅ Kembali ke halaman contact setelah panggilan berakhir");
  } catch (err) {
    console.error("❌ Gagal IT-03:", err.message);
    await driver
      .takeScreenshot()
      .then((img) => fs.writeFileSync("debug_IT03.png", img, "base64"));
  } finally {
    await driver.quit();
  }
}

testCallFlowIT03();
