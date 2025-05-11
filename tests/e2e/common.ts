import longjohn from 'longjohn';
longjohn.async_trace_limit = -1;

import { Builder, By, until, WebDriver, WebElement, Capabilities } from 'selenium-webdriver';
import Xdotoolify, { XWebDriver } from 'xdotoolify';

export const url = 'https://applocal.presupplied.com';
export const defaultCheckUntilTimeout = 10000; // 10 seconds

export const setupBrowser = async () => {
  const { execSync } = require('child_process');
  const { mkdtempSync, writeFileSync, mkdirSync } = require('fs');

  const tmpdir = mkdtempSync('/tmp/presupplied-selenium-test');

  const chromeDir = `${tmpdir}/chrome`;
  mkdirSync(chromeDir);
  writeFileSync(
    `${chromeDir}/userChrome.css`,
    '@namespace url("http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul"); /* only needed once */\n' +
    'statuspanel { display: none !important; }\n' +
    '#statuspanel { display: none !important; }'
  );

  const firefox = require('selenium-webdriver/firefox');
  const firefoxOpts = new firefox.Options();

  firefoxOpts.setProfile(tmpdir);

  firefoxOpts.setPreference('focusmanager.testmode', false);
  firefoxOpts.setPreference('security.fileuri.strict_origin_policy', false);
  firefoxOpts.setPreference('gfx.direct2d.disabled', true);
  firefoxOpts.setPreference('dom.storage.next_gen', true);
  firefoxOpts.setPreference('layers.acceleration.disabled', true);
  firefoxOpts.setPreference('devtools.webconsole.persistlog', true);
  firefoxOpts.setPreference('app.update.auto', false);
  firefoxOpts.setPreference('app.update.enabled', false);
  firefoxOpts.setPreference('browser.fullscreen.animate', false);
  firefoxOpts.setPreference('browser.fullscreen.autohide', false);
  firefoxOpts.setPreference('full-screen-api.warning.delay', 0);
  firefoxOpts.setPreference('full-screen-api.warning.timeout', 0);
  firefoxOpts.setPreference('browser.formfill.enable', false);
  firefoxOpts.setPreference('ui.caretBlinkTime', 0); // disable caret blinking for consistent screenshots
  firefoxOpts.setPreference('layout.spellcheckDefault', 0); // disable spellcheck

  firefoxOpts.setPreference('security.enterprise_roots.enabled', true);
  firefoxOpts.setPreference('security.cert_pinning.enforcement_level', 0);
  firefoxOpts.setPreference('security.ssl.enable_ocsp_stapling', false);
  firefoxOpts.setPreference('security.ssl.enable_ocsp_must_staple', false);
  firefoxOpts.setPreference('security.tls.insecure_fallback_hosts', 'applocal.presupplied.com');
  firefoxOpts.setPreference('security.default_personal_cert', 'Select Automatically');

  firefoxOpts.setAcceptInsecureCerts(true);

  firefoxOpts.addArguments('-no-remote');
  firefoxOpts.addArguments('--shm-size=2g');

  const driver = await new Builder()
    .forBrowser('firefox')
    .setFirefoxOptions(firefoxOpts)
    .build();

  await driver.manage().window().setRect({
    width: 1280,
    height: 1024
  });

  const page = Xdotoolify(driver);

  return page;
};

export const openWithHelpers = Xdotoolify.setupWithPage(async function(page, _url: string): Promise<void> {
  await page.X.focus();
  const handle = await page.getWindowHandle();
  await page.switchTo().window(handle);
  await page.get(_url);
});
