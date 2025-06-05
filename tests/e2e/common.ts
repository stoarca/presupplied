import longjohn from 'longjohn';
longjohn.async_trace_limit = -1;

import { Builder, By, until, WebDriver, WebElement, Capabilities } from 'selenium-webdriver';
import Xdotoolify, { XWebDriver } from 'xdotoolify';
import * as XC from 'xdotoolify/dist/common';
import { typedFetch } from '/presupplied/images/psapp/client/src/typedFetch';

Xdotoolify.defaultCheckUntilTimeout = 20000;

export const url = 'https://applocal.presupplied.com';

// Selectors
export const errorAlertSelector = '.MuiAlert-root';
export const moduleCardSelector = '[data-test="module-card"]';
export const moduleTitleSelector = '[data-test="module-title"]';
export const moduleChoiceDialogSelector = '[data-test="module-choice-dialog"]';
export const teachChoiceSelector = '[data-test="teach-choice"]';
export const learnChoiceSelector = '[data-test="learn-choice"]';
export const masteryChoiceSelector = '[data-test="mastery-choice"]';
export const settingsLink = 'a[href="/settings"]';
export const manageChildrenLink = 'a[href="/settings/children"]';
export const childCardSelector = '[data-test="child-card"]';

export const enableTestMode = Xdotoolify.setupWithoutPage(async () => {
  const response = await typedFetch({
    host: 'https://applocal.presupplied.com',
    endpoint: '/api/test/enable',
    method: 'post',
    body: {}
  });
  
  if (!response.success) {
    throw new Error(`Failed to enable test mode: ${JSON.stringify(response)}`);
  }
  
  return true;
});

export const disableTestMode = Xdotoolify.setupWithoutPage(async () => {
  const response = await typedFetch({
    host: 'https://applocal.presupplied.com',
    endpoint: '/api/test/disable',
    method: 'post',
    body: {}
  });
  
  if (!response.success) {
    throw new Error(`Failed to disable test mode: ${JSON.stringify(response)}`);
  }
  
  return true;
});

export const fetchWebLogs = Xdotoolify.setupWithoutPage(async () => {
  const response = await typedFetch({
    host: 'https://applocal.presupplied.com',
    endpoint: '/api/test/weblogdump',
    method: 'get'
  });
  
  if (!response.success) {
    throw new Error(`Failed to fetch web logs: ${JSON.stringify(response)}`);
  }
  
  if (!Array.isArray(response.logs)) {
    throw new Error(`Invalid logs response: ${JSON.stringify(response)}`);
  }
  
  return response.logs;
});

export const fetchWebErrors = Xdotoolify.setupWithoutPage(async () => {
  const response = await typedFetch({
    host: 'https://applocal.presupplied.com',
    endpoint: '/api/test/weberrordump',
    method: 'get'
  });
  
  if (!response.success) {
    throw new Error(`Failed to fetch web errors: ${JSON.stringify(response)}`);
  }
  
  if (!Array.isArray(response.errors)) {
    throw new Error(`Invalid errors response: ${JSON.stringify(response)}`);
  }
  
  return response.errors;
});

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

export const navigateToRoute = Xdotoolify.setupWithPage(async (page, route: string) => {
  await page.X
    .run(XC.evaluate, (path: string) => {
      window.location.href = path;
    }, route)
    .checkUntil(XC.evaluate, (path: string) => {
      return window.location.pathname === path;
    }, route, true)
    .do();
});

export const getLocation = Xdotoolify.setupWithPage(async (page) => {
  return XC.evaluate(page, () => {
    return {
      href: window.location.href,
      pathname: window.location.pathname,
      hostname: window.location.hostname,
      search: window.location.search,
      hash: window.location.hash
    };
  });
});

let emailCounter = 0;
export const getUniqueEmail = () => `ps-test-account-${emailCounter++}@example.com`;

export const getModuleCardInfo = Xdotoolify.setupWithPage(async (page) => {
  return XC.evaluate(page, (_moduleCardSelector: string, _moduleTitleSelector: string) => {
    const elements = document.querySelectorAll(_moduleCardSelector);
    return Array.from(elements).map(el => {
      const titleElement = el.querySelector(_moduleTitleSelector);
      const title = titleElement?.textContent || '';
      
      const avatars = el.querySelectorAll('[data-test^="child-avatar-"]');
      const childIds = Array.from(avatars).map(avatar => {
        const testAttr = avatar.getAttribute('data-test');
        const match = testAttr?.match(/child-avatar-(\d+)/);
        return match ? parseInt(match[1]) : null;
      }).filter(id => id !== null) as number[];
      
      return { title, childIds };
    });
  }, moduleCardSelector, moduleTitleSelector);
});

export const shiftClickModuleCard = Xdotoolify.setupWithPage(async (page, title: string) => {
  return XC.evaluate(page, (_moduleCardSelector: string, _moduleTitleSelector: string, _title: string) => {
    const cards = document.querySelectorAll(_moduleCardSelector);
    for (const card of cards) {
      const titleElement = card.querySelector(_moduleTitleSelector);
      if (titleElement?.textContent === _title) {
        const event = new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
          shiftKey: true
        });
        card.dispatchEvent(event);
        return true;
      }
    }
    return false;
  }, moduleCardSelector, moduleTitleSelector, title);
});

export const selectModuleChoice = Xdotoolify.setupWithPage(async (page, choice: 'teach' | 'learn' | 'mastery') => {
  const choiceSelector = {
    'teach': teachChoiceSelector,
    'learn': learnChoiceSelector,
    'mastery': masteryChoiceSelector
  }[choice];

  await page.X
    .checkUntil(XC.visibleElementCount, moduleChoiceDialogSelector, 1)
    .checkUntil(XC.visibleElementCount, choiceSelector, 1)
    .run(XC.autoClick, choiceSelector)
    .do();
});
