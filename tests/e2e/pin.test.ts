import { describe, expect, it, beforeAll, beforeEach, afterEach, afterAll } from 'bun:test';
import { XWebDriver } from 'xdotoolify';
import * as C from './common';
import * as XC from 'xdotoolify/dist/common';
import * as Onboarding from './onboarding';
import { UserType } from '/presupplied/images/psapp/common/types';

// Selectors specific to PIN settings functionality
const settingsPinInputSelector = '[data-test="settings-pin-input"] input';
const settingsSaveButtonSelector = '[data-test="settings-save-button"]';
const settingsPasswordDialogSelector = '[data-test="settings-password-dialog"]';
const settingsPasswordInputSelector = '[data-test="settings-password-input"] input';
const settingsPasswordConfirmSelector = '[data-test="settings-password-confirm"]';
const settingsAlertSelector = '[data-test="settings-alert"]';
const switchAuthMethodSelector = '[data-test="switch-auth-method"]';
const pinDialogPasswordInputSelector = '[data-test="pin-dialog-password-input"] input';
const pinDialogPasswordSubmitSelector = '[data-test="pin-dialog-password-submit"]';

describe('PIN Functionality E2E Tests', () => {
  let page: XWebDriver;

  beforeAll(async () => {
    await C.enableTestMode();
  });

  afterAll(async () => {
    await C.disableTestMode();
  });

  beforeEach(async () => {
    page = await C.setupBrowser();
    await XC.showConsole(page);
    await C.openWithHelpers(page, C.url);
  });

  afterEach(async () => {
    await C.checkForErrorsAndLogs();
    
    if (page) {
      await page.quit();
    }
  });

  it('should test complete PIN functionality including setting PIN and using it for account switching', async () => {
    const parentEmail = C.getUniqueEmail();
    const parentPassword = 'Password123';
    const parentName = 'Test Parent';
    const childName = 'Test Child';
    const newPin = '1234';
    const incorrectPin = '9999';
    const incorrectPassword = 'WrongPassword';
    let childId = 0;
    let parentId = 0;

    // Step 1: Create parent and child accounts
    await page.X
      .run(Onboarding.registerUser, {
        name: parentName,
        email: parentEmail,
        password: parentPassword,
        type: UserType.PARENT
      })
      .checkUntil(Onboarding.getUserInfo, parentEmail, (userInfo) => {
        if ('success' in userInfo && userInfo.success) {
          parentId = userInfo.user.id;
          return true;
        }
        return false;
      })
      .run(Onboarding.createChildComplete, { name: childName, avatarId: 'bear' })
      .checkUntil(Onboarding.getUserInfo, parentEmail, (userInfo) => {
        if ('success' in userInfo && userInfo.success) {
          expect(userInfo.user.children).toBeDefined();
          expect(userInfo.user.children).toHaveLength(1);
          expect(userInfo.user.children![0].name).toBe(childName);
          childId = userInfo.user.children![0].id;
          return userInfo.user.children!.length === 1;
        }
        return false;
      })
      .do();

    // Step 2: Set the parent's PIN to 1234
    await page.X
      .checkUntil(XC.visibleElementCount, Onboarding.userMenuButton, 1)
      .run(XC.autoClick, Onboarding.userMenuButton)
      .checkUntil(XC.visibleElementCount, C.settingsMenuItemSelector, 1)
      .run(XC.autoClick, C.settingsMenuItemSelector)
      .checkUntil(C.getLocation, (location) => location.pathname === '/settings/general')
      .checkUntil(XC.visibleElementCount, settingsPinInputSelector, 1)
      .run(XC.autoType, settingsPinInputSelector, newPin)
      .checkUntil(XC.getInputValue, settingsPinInputSelector, newPin)
      .run(XC.autoClick, settingsSaveButtonSelector)
      .checkUntil(XC.visibleElementCount, settingsPasswordDialogSelector, 1)
      .checkUntil(XC.visibleElementCount, settingsPasswordInputSelector, 1)
      .run(XC.autoType, settingsPasswordInputSelector, parentPassword)
      .checkUntil(XC.getInputValue, settingsPasswordInputSelector, parentPassword)
      .run(XC.autoClick, settingsPasswordConfirmSelector)
      .checkUntil(XC.visibleElementCount, settingsAlertSelector, 1)
      .checkUntil(XC.elementText, settingsAlertSelector, (text: string | null) => 
        text?.includes('Settings updated successfully!')
      )
      .do();

    // Step 3: Switch to the child account
    await page.X
      .run(Onboarding.switchToChildAccount, childId)
      .checkUntil(Onboarding.getCurrentUserName, childName)
      .checkUntil(C.getLocation, (location) => location.pathname === '/')
      .do();

    // Step 4: Switch back to parent with incorrect PIN, then correct PIN
    await page.X
      .run(Onboarding.openAccountSwitcher)
      .checkUntil(XC.visibleElementCount, Onboarding.accountAvatarBase, (count: number) => count >= 2)
      .run(XC.autoClick, Onboarding.getAccountAvatarSelector(parentId))
      .checkUntil(XC.visibleElementCount, C.pinDialogSelector, 1)
      .do();

    // Enter incorrect PIN
    await page.X
      .run(Onboarding.enterPIN, incorrectPin, { expectSuccess: false })
      .checkUntil(XC.elementText, C.pinErrorSelector, (text: string | null) => 
        text?.includes('Incorrect PIN')
      )
      .do();

    // Enter correct PIN
    await page.X
      .run(XC.autoClick, C.pinBackspaceSelector)
      .checkUntil(XC.getInputValue, C.pinInputSelector, '999')
      .run(XC.autoClick, C.pinBackspaceSelector)
      .checkUntil(XC.getInputValue, C.pinInputSelector, '99')
      .run(XC.autoClick, C.pinBackspaceSelector)
      .checkUntil(XC.getInputValue, C.pinInputSelector, '9')
      .run(XC.autoClick, C.pinBackspaceSelector)
      .checkUntil(XC.getInputValue, C.pinInputSelector, '')
      .run(Onboarding.enterPIN, newPin)
      .checkUntil(XC.elementText, Onboarding.userMenuButton, (text: string | null) => 
        text?.toLowerCase() === parentEmail.toLowerCase()
      )
      .checkUntil(C.getLocation, (location) => location.pathname === '/')
      .do();

    // Step 5: Switch back to child again
    await page.X
      .run(Onboarding.switchToChildAccount, childId)
      .checkUntil(Onboarding.getCurrentUserName, childName)
      .checkUntil(C.getLocation, (location) => location.pathname === '/')
      .do();

    // Step 6: Switch to parent using password option
    await page.X
      .run(Onboarding.openAccountSwitcher)
      .checkUntil(XC.visibleElementCount, Onboarding.accountAvatarBase, (count: number) => count >= 2)
      .run(XC.autoClick, Onboarding.getAccountAvatarSelector(parentId))
      .checkUntil(XC.visibleElementCount, C.pinDialogSelector, 1)
      .checkUntil(XC.visibleElementCount, switchAuthMethodSelector, 1)
      .run(XC.autoClick, switchAuthMethodSelector)
      .checkUntil(XC.visibleElementCount, pinDialogPasswordInputSelector, 1)
      .do();

    // Enter incorrect password
    await page.X
      .run(XC.autoType, pinDialogPasswordInputSelector, incorrectPassword)
      .checkUntil(XC.getInputValue, pinDialogPasswordInputSelector, incorrectPassword)
      .run(XC.autoClick, pinDialogPasswordSubmitSelector)
      .checkUntil(XC.elementText, C.pinErrorSelector, (text: string | null) => 
        text?.includes('Incorrect password')
      )
      .do();

    // Enter correct password
    await page.X
      .run(XC.autoType, pinDialogPasswordInputSelector, parentPassword, { overwrite: true })
      .checkUntil(XC.getInputValue, pinDialogPasswordInputSelector, parentPassword)
      .run(XC.autoClick, pinDialogPasswordSubmitSelector)
      .checkUntil(XC.elementText, Onboarding.userMenuButton, (text: string | null) => 
        text?.toLowerCase() === parentEmail.toLowerCase()
      )
      .checkUntil(C.getLocation, (location) => location.pathname === '/')
      .do();
  });
});
