import longjohn from 'longjohn';
longjohn.async_trace_limit = -1;

import { Builder, By, until, WebDriver, WebElement, Capabilities } from 'selenium-webdriver';
import Xdotoolify, { XWebDriver } from 'xdotoolify';
import * as XC from 'xdotoolify/dist/common';
import { typedFetch } from '/presupplied/images/psapp/client/src/typedFetch';
import { expect } from 'bun:test';

Xdotoolify.defaultCheckUntilTimeout = 20000;

export const url = 'https://applocal.presupplied.com';

// Selectors
export const errorAlertSelector = '.MuiAlert-root';
export const moduleCardSelector = '[data-test="module-card"]';
export const moduleTitleSelector = '[data-test="module-title"]';
export const moduleChoiceDialogSelector = '[data-test="module-choice-dialog"]';
export const userSelectorDialogSelector = '[data-test="user-selector-dialog"]';
export const teachChoiceSelector = '[data-test="teach-choice"]';
export const learnChoiceSelector = '[data-test="learn-choice"]';
export const masteryChoiceSelector = '[data-test="mastery-choice"]';
export const videoListDialogSelector = '[data-test="video-list-dialog"]';
export const videoItemSelector = '[data-test^="video-item-"]';
export const videoTitleSelector = '[data-test="video-title"]';
export const videoStatusSelector = '[data-test="video-status"]';
export const videoCheckSelector = '[data-test="video-check"]';
export const videoLastWatchedSelector = '[data-test="video-last-watched"]';
export const settingsLink = 'a[href="/settings"]';
export const manageChildrenLink = 'a[href="/settings/children"]';
export const childCardSelector = '[data-test="child-card"]';
export const navButtonMapSelector = '[data-test="nav-button-map"]';
export const navButtonHomeSelector = '[data-test="nav-button-home"]';
export const navButtonChildrenSelector = '[data-test="nav-button-children"]';

// Map view selectors
export const mapModuleNodeSelector = '[data-test^="map-module-node-"]';
export const mapModuleBgSelector = '[data-test="map-module-bg"]';
export const mapModuleTitleSelector = '[data-test="map-module-title"]';
export const mapModuleChildrenSelector = '[data-test="map-module-children"]';
export const mapModuleChildNameSelector = '[data-test="map-module-child-name"]';
export const mapHoverRectangleSelector = '[data-test="map-hover-rectangle"]';
export const originMarkerSelector = '[data-test="origin-marker"]';
export const panZoomTransformSelector = '[data-test="pan-zoom-transform"]';
export const getMapModuleNodeSelector = (moduleId: string) => `[data-test="map-module-node-${moduleId}"]`;

// Admin toolbar selectors
export const moduleEditDialogSelector = '[data-test="module-edit-dialog"]';
export const moduleIdInputSelector = '[data-test="module-id-input"]';
export const applyButtonSelector = '[data-test="apply-button"]';

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
    .checkUntil(getLocation, (location) => {
      return location.pathname + location.search === route;
    })
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
  await page.X
    .run(XC.evaluate, (_moduleCardSelector: string, _moduleTitleSelector: string, _title: string) => {
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
    }, moduleCardSelector, moduleTitleSelector, title)
    .addRequireCheckImmediatelyAfter()
    .do();
});

export const shiftClickMapModule = Xdotoolify.setupWithPage(async (page, title: string) => {
  await page.X
    .run(XC.evaluate, (_mapModuleNodeSelector: string, _mapModuleTitleSelector: string, _title: string) => {
      const modules = document.querySelectorAll(_mapModuleNodeSelector);
      for (const module of modules) {
        const titleElement = module.querySelector(_mapModuleTitleSelector);
        if (titleElement?.textContent === _title) {
          const event = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            shiftKey: true
          });
          module.dispatchEvent(event);
          return true;
        }
      }
      return false;
    }, mapModuleNodeSelector, mapModuleTitleSelector, title)
    .addRequireCheckImmediatelyAfter()
    .do();
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

export const selectVideo = Xdotoolify.setupWithPage(async (page, index = 0) => {
  await page.X
    .checkUntil(XC.visibleElementCount, videoListDialogSelector, 1)
    .checkUntil(XC.visibleElementCount, videoItemSelector, (count: number) => count > index)
    .run(XC.autoClick, [videoItemSelector, index])
    .do();
});

export const closeVideoList = Xdotoolify.setupWithPage(async (page) => {
  await page.X
    .run(XC.autoClick, 'body', { relpos: 'topleft' })
    .checkUntil(XC.visibleElementCount, moduleChoiceDialogSelector, 1)
    .do();
});

export const getVideoListInfo = Xdotoolify.setupWithPage(async (page) => {
  return XC.evaluate(page, (_videoItemSelector: string, _videoTitleSelector: string, _videoStatusSelector: string, _videoCheckSelector: string, _videoLastWatchedSelector: string) => {
    const videoItems = document.querySelectorAll(_videoItemSelector);
    return Array.from(videoItems).map((item) => {
      const videoId = item.getAttribute('data-test')?.replace('video-item-', '') || '';
      const titleElement = item.querySelector(_videoTitleSelector);
      const statusElement = item.querySelector(_videoStatusSelector);
      const checkElement = item.querySelector(_videoCheckSelector);
      const lastWatchedElement = item.querySelector(_videoLastWatchedSelector);
      
      const lastWatchedText = lastWatchedElement?.textContent?.trim() || '';
      const lastWatched = lastWatchedText.replace('Last watched: ', '');
      
      return {
        videoId,
        title: titleElement?.textContent?.trim() || '',
        isWatched: checkElement !== null,
        status: statusElement?.textContent?.trim() || '',
        lastWatched
      };
    });
  }, videoItemSelector, videoTitleSelector, videoStatusSelector, videoCheckSelector, videoLastWatchedSelector);
});

export const getMapModules = Xdotoolify.setupWithPage(async (page) => {
  return XC.evaluate(page, (_mapModuleNodeSelector: string, _mapModuleBgSelector: string, _mapModuleTitleSelector: string, _mapModuleChildrenSelector: string, _mapModuleChildNameSelector: string) => {
    const modules: any[] = [];
    const moduleNodes = document.querySelectorAll(_mapModuleNodeSelector);
    
    moduleNodes.forEach((node) => {
      const moduleId = node.getAttribute('data-test')?.replace('map-module-node-', '') || '';
      const titleElement = node.querySelector(_mapModuleTitleSelector);
      const bgElement = node.querySelector(_mapModuleBgSelector);
      const childrenContainer = node.querySelector(_mapModuleChildrenSelector);
      const childNameElements = childrenContainer?.querySelectorAll(_mapModuleChildNameSelector) || [];
      
      const children: string[] = [];
      childNameElements.forEach((nameEl) => {
        const name = nameEl.textContent?.trim();
        if (name) {
          children.push(name);
        }
      });
      
      const computedStyle = window.getComputedStyle(node);
      const backgroundColor = bgElement ? window.getComputedStyle(bgElement).backgroundColor : '';
      
      // Convert color to status
      let status: 'reached' | 'reachable' | 'unreached';
      if (backgroundColor === 'rgb(144, 238, 144)') { // green
        status = 'reached';
      } else if (backgroundColor === 'rgb(241, 235, 156)') { // yellow
        status = 'reachable';
      } else {
        status = 'unreached';
      }
      
      modules.push({
        moduleId,
        title: titleElement?.textContent?.trim() || '',
        status,
        children,
        position: {
          left: parseInt(computedStyle.left || '0'),
          top: parseInt(computedStyle.top || '0')
        },
        opacity: parseFloat(computedStyle.opacity || '1')
      });
    });
    
    return modules.sort((a, b) => {
      if (a.position.top !== b.position.top) {
        return a.position.top - b.position.top;
      }
      return a.position.left - b.position.left;
    });
  }, mapModuleNodeSelector, mapModuleBgSelector, mapModuleTitleSelector, mapModuleChildrenSelector, mapModuleChildNameSelector);
});

export const clickMapModule = Xdotoolify.setupWithPage(async (page, moduleId: string) => {
  await page.X
    .checkUntil(XC.visibleElementCount, getMapModuleNodeSelector(moduleId), 1)
    .run(XC.autoClick, getMapModuleNodeSelector(moduleId))
    .do();
});

export const getBoundingClientRect = Xdotoolify.setupWithPage(async (page, selector: string) => {
  return XC.evaluate(page, (_selector: string) => {
    const element = document.querySelector(_selector);
    if (!element) {
      return null;
    }
    const rect = element.getBoundingClientRect();
    return {
      top: rect.top,
      left: rect.left,
      bottom: rect.bottom,
      right: rect.right,
      width: rect.width,
      height: rect.height,
      x: rect.x,
      y: rect.y
    };
  }, selector);
});

export const getMapZoomLevel = Xdotoolify.setupWithPage(async (page) => {
  return XC.evaluate(page, (_selector: string) => {
    const element = document.querySelector(_selector);
    if (!element) {
      throw new Error(`Element not found: ${_selector}`);
    }
    const style = window.getComputedStyle(element);
    const transform = style.transform;
    
    // Handle matrix transform: matrix(a, b, c, d, tx, ty) where a is scale X
    const matrixMatch = transform.match(/matrix\(([^,]+),/);
    if (matrixMatch) {
      return parseFloat(matrixMatch[1]);
    }
    
    // Handle scale transform as fallback
    const scaleMatch = transform.match(/scale\(([^)]+)\)/);
    return scaleMatch ? parseFloat(scaleMatch[1]) : 1;
  }, panZoomTransformSelector);
});

export const getHoverRectInfo = Xdotoolify.setupWithPage(async (page) => {
  return XC.evaluate(page, () => {
    const hoverRect = document.querySelector('[data-test="map-hover-rectangle"]');
    return hoverRect ? {
      visible: window.getComputedStyle(hoverRect).display !== 'none',
      backgroundColor: window.getComputedStyle(hoverRect).backgroundColor,
      bounds: hoverRect.getBoundingClientRect()
    } : null;
  });
});

export const verifyHoverRect = Xdotoolify.setupWithPage(async (page, kmid: string) => {
  const moduleSelector = getMapModuleNodeSelector(kmid);
  let moduleBounds: any;
  
  await page.X
    .checkUntil(getBoundingClientRect, moduleSelector, (bounds) => {
      moduleBounds = bounds;
      return bounds !== null;
    })
    .checkUntil(getHoverRectInfo, (hoverInfo) => {
      if (!hoverInfo) return false;
      expect(hoverInfo.visible).toBe(true);
      
      expect(hoverInfo.bounds.left).toBeCloseTo(moduleBounds.left, 1);
      expect(hoverInfo.bounds.top).toBeCloseTo(moduleBounds.top, 1);
      expect(hoverInfo.bounds.width).toBeCloseTo(moduleBounds.width, 1);
      expect(hoverInfo.bounds.height).toBeCloseTo(moduleBounds.height, 1);
      
      return hoverInfo.visible;
    })
    .do();

  return true;
});



export const checkForErrorsAndLogs = async () => {
  const errors = await fetchWebErrors();
  if (errors.length > 0) {
    console.error('Client-side errors detected:');
    errors.forEach(error => console.error(` - ${error}`));
    throw new Error('Client-side errors detected during test');
  }

  const logs = await fetchWebLogs();
  if (logs.length > 0) {
    console.log('Client-side logs:');
    logs.forEach(log => console.log(` - ${log}`));
  }
};
