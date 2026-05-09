(async () => {
  /* ============================================================
   *  TikTok Auto-Unfollow Script — Following Popup
   *  Paste ke DevTools Console saat popup Following sudah terbuka
   * ============================================================ */

  const CONFIG = {
    DELAY_MIN: 800,
    DELAY_MAX: 2500,
    SCROLL_AMOUNT: 400,
    SCROLL_WAIT: 1500,
    LOAD_WAIT_MIN: 1200,
    LOAD_WAIT_MAX: 2200,
    RATE_LIMIT_COOLDOWN: 30000,
    MAX_RATE_LIMIT_HITS: 3,
    MAX_ITERATIONS: 2000,
    NO_NEW_ITEMS_LIMIT: 5,
  };

  const stats = { unfollowed: 0, skippedFriends: 0, failed: 0, processed: 0 };
  const processedSet = new Set();
  let rateLimitHits = 0;
  let running = true;
  let noNewItemsCount = 0;

  // Expose stop function globally
  window._stopUnfollow = () => {
    running = false;
    console.log(
      "%c[STOPPED] Script dihentikan.",
      "color:orange;font-weight:bold"
    );
  };

  console.log(
    "%c[INFO] Jalankan window._stopUnfollow() kapan saja untuk hentikan script.",
    "color:cyan"
  );

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  const randDelay = () => sleep(rand(CONFIG.DELAY_MIN, CONFIG.DELAY_MAX));

  const getPopup = () =>
    document.querySelector('[data-e2e="follow-info-popup"]');

  const getScrollContainer = () => {
    const popup = getPopup();
    if (!popup) return null;

    // Cari container yang bisa di-scroll (overflow) di dalam popup
    const allDivs = popup.querySelectorAll("div");

    for (const div of allDivs) {
      if (div.scrollHeight > div.clientHeight + 10) {
        return div;
      }
    }

    return popup;
  };

  const scrollDown = () => {
    const container = getScrollContainer();
    if (!container) return;

    container.scrollBy({
      top: CONFIG.SCROLL_AMOUNT,
      behavior: "smooth",
    });
  };

  const isNearBottom = () => {
    const container = getScrollContainer();
    if (!container) return true;

    return (
      container.scrollTop + container.clientHeight >=
      container.scrollHeight - 50
    );
  };

  const simulateClick = (btn) => {
    ["mouseover", "mousedown", "mouseup", "click"].forEach((evt) => {
      btn.dispatchEvent(
        new MouseEvent(evt, {
          bubbles: true,
          cancelable: true,
        })
      );
    });
  };

  const getUnfollowButtons = () => {
    const popup = getPopup();
    if (!popup) return [];

    return [
      ...popup.querySelectorAll('button[data-e2e="follow-button"]'),
    ].filter((btn) => {
      const text = btn.textContent.trim();
      return text === "Following";
    });
  };

  const getUniqueKey = (btn) => {
    const container =
      btn.closest("[href]")?.href ||
      btn.closest("a")?.href ||
      btn.getAttribute("aria-label") ||
      btn.textContent.trim() + Math.random();

    return container;
  };

  const detectRateLimit = () => {
    // Deteksi jika tombol tidak berubah setelah klik (masih "Following")
    return false;
  };

  const log = (msg, color = "white") =>
    console.log(`%c[TikTok-Unfollow] ${msg}`, `color:${color}`);

  // Main Loop
  log("Script dimulai. Mencari tombol Following...", "lime");

  if (!getPopup()) {
    log(
      "ERROR: Popup Following tidak ditemukan! Buka popup dulu lalu jalankan ulang.",
      "red"
    );
    return;
  }

  let iteration = 0;

  while (running && iteration < CONFIG.MAX_ITERATIONS) {
    iteration++;

    const buttons = getUnfollowButtons();

    // Filter hanya yang belum diproses
    const newButtons = buttons.filter((btn) => {
      const label = btn.getAttribute("aria-label") || "";
      return !processedSet.has(label);
    });

    if (newButtons.length === 0) {
      // Cek tombol Friends yang di-skip
      const friendsCount = [
        ...(getPopup()?.querySelectorAll('button[data-e2e="follow-button"]') ||
          []),
      ].filter((b) => b.textContent.trim() === "Friends").length;

      if (friendsCount > 0) {
        log(`Skip ${friendsCount} akun Friends di layar ini.`, "yellow");
      }

      if (isNearBottom()) {
        noNewItemsCount++;

        log(
          `Tidak ada item baru (${noNewItemsCount}/${CONFIG.NO_NEW_ITEMS_LIMIT}). Scroll...`,
          "gray"
        );

        if (noNewItemsCount >= CONFIG.NO_NEW_ITEMS_LIMIT) {
          log("Semua following telah diproses!", "lime");
          break;
        }
      }

      scrollDown();

      await sleep(rand(CONFIG.LOAD_WAIT_MIN, CONFIG.LOAD_WAIT_MAX));

      continue;
    }

    noNewItemsCount = 0;

    for (const btn of newButtons) {
      if (!running) break;

      const label =
        btn.getAttribute("aria-label") || `unknown_${stats.processed}`;

      // Double-check teks masih "Following"
      if (btn.textContent.trim() !== "Following") {
        if (btn.textContent.trim() === "Friends") {
          stats.skippedFriends++;

          log(`SKIP Friends: ${label}`, "yellow");
        }

        processedSet.add(label);
        continue;
      }

      if (processedSet.has(label)) continue;

      // Delay manusiawi sebelum klik
      await randDelay();

      try {
        // Scroll ke elemen agar terlihat
        btn.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });

        await sleep(300);

        // Pastikan tombol masih ada & masih "Following"
        if (!document.contains(btn) || btn.textContent.trim() !== "Following") {
          processedSet.add(label);
          continue;
        }

        simulateClick(btn);

        stats.processed++;
        processedSet.add(label);

        // Tunggu & verifikasi perubahan
        await sleep(rand(600, 1000));

        const newText = btn.textContent.trim();

        if (newText === "Follow" || newText === "") {
          stats.unfollowed++;

          log(`Unfollow: ${label} (Total: ${stats.unfollowed})`, "lime");
        } else if (newText === "Following") {
          // Kemungkinan rate limit
          stats.failed++;
          rateLimitHits++;

          log(`Gagal unfollow: ${label} (tombol masih Following)`, "red");

          if (rateLimitHits >= CONFIG.MAX_RATE_LIMIT_HITS) {
            log(
              `Rate limit terdeteksi! Cooldown ${
                CONFIG.RATE_LIMIT_COOLDOWN / 1000
              }s...`,
              "orange"
            );

            await sleep(CONFIG.RATE_LIMIT_COOLDOWN);

            rateLimitHits = 0;

            log("Melanjutkan setelah cooldown...", "cyan");
          }
        } else {
          stats.unfollowed++;

          log(`Unfollow: ${label} → "${newText}"`, "lime");
        }
      } catch (err) {
        stats.failed++;
        processedSet.add(label);

        log(`ERROR pada ${label}: ${err.message}`, "red");
      }

      // Progress setiap 10 aksi
      if (stats.processed % 10 === 0) {
        log(
          `Progress — Unfollow: ${stats.unfollowed} | Skip Friends: ${stats.skippedFriends} | Gagal: ${stats.failed} | Total: ${stats.processed}`,
          "cyan"
        );
      }
    }

    // Scroll setelah memproses batch saat ini
    scrollDown();

    await sleep(rand(CONFIG.LOAD_WAIT_MIN, CONFIG.LOAD_WAIT_MAX));
  }

  // Summary
  console.log("%c\n═══════════════════════════════════", "color:cyan");

  console.log("%cSUMMARY AKHIR", "color:cyan;font-weight:bold;font-size:14px");

  console.log("%c═══════════════════════════════════", "color:cyan");

  console.log(
    `%cTotal Unfollow   : ${stats.unfollowed}`,
    "color:lime;font-weight:bold"
  );

  console.log(`%cSkip Friends     : ${stats.skippedFriends}`, "color:yellow");

  console.log(`%cGagal            : ${stats.failed}`, "color:red");

  console.log(`%cTotal Diproses  : ${stats.processed}`, "color:white");

  console.log("%c═══════════════════════════════════\n", "color:cyan");
})();
