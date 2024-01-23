function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

async function loadScript() {
  if (isMobile()) {
    await import("./mobile.js");
  } else {
    await import("./desktop.js");
  }
}

loadScript();
