import { describe, expect, it, beforeAll, beforeEach, afterEach } from 'bun:test';
import { XWebDriver } from 'xdotoolify';
import * as C from './common';
import * as XC from 'xdotoolify/dist/common';
import * as Onboarding from './onboarding';
import { UserType } from '/presupplied/images/psapp/common/types';

const getUniqueEmail = () => `ps-test-account-${Date.now()}@example.com`;

describe('Presupplied Onboarding E2E Tests', () => {
  let page: XWebDriver;

  beforeAll(async () => {
    await Onboarding.deleteTestAccounts();
  });

  beforeEach(async () => {
    page = await C.setupBrowser();
    await C.openWithHelpers(page, C.url);
  });

  afterEach(async () => {
    if (page) {
      await page.quit();
    }
  });

  it('should complete the full onboarding process with registration and child accounts', async () => {
    const parentName = 'Test Parent';
    const invalidEmail = 'invalidemail';
    const validEmail = getUniqueEmail();
    const parentPassword = 'Password123';
    const child1Name = 'Child No Pin';
    const child2Name = 'Child With Pin';
    const child2Pin = '1234';
    let child1Id = 0;
    let child2Id = 0;

    await page.X
      .run(Onboarding.navigateToRegister)
      .run(Onboarding.enterRegistrationDetails, {
        name: parentName,
        email: invalidEmail,
        password: parentPassword,
        type: UserType.PARENT
      })
      .run(Onboarding.submitRegistration, false)
      .do();

    const errorMsg = await Onboarding.getErrorMessage(page);
    expect(errorMsg).toContain('Email is invalid');

    await page.X
      .run(Onboarding.enterRegistrationDetails, {
        name: parentName,
        email: validEmail,
        password: parentPassword,
        type: UserType.PARENT
      })
      .run(Onboarding.submitRegistration)
      .checkUntil(XC.elementText, 'button[data-test="user-display-email"]', (x: string | null) => 
        expect(x?.toLowerCase()).toBe(validEmail.toLowerCase()))
      .do();

    await page.X
      .checkUntil(XC.visibleElementCount, 'input[data-test="child-name-input"]', 1)
      .run(Onboarding.enterChildDetails, {
        name: child1Name
      })
      .checkUntil(XC.visibleElementCount, 'button[data-test="next-button"]', 1)
      .run(XC.autoClick, 'button[data-test="next-button"]')
      .checkUntil(XC.visibleElementCount, 'button[data-test="create-child-button"]', 1)
      .run(Onboarding.selectChildAvatar, 'bear')
      .run(Onboarding.submitChildCreation)
      .checkUntil(Onboarding.getUserInfo, validEmail, (userInfo) => {
        expect('success' in userInfo && userInfo.success).toBe(true);
        if ('success' in userInfo && userInfo.success) {
          expect(userInfo.children).toHaveLength(1);
          expect(userInfo.children![0].name).toBe(child1Name);
          child1Id = userInfo.children![0].id;
          return userInfo.children!.length === 1;
        }
        return false;
      })
      .do();
    
    await page.X
      .run(Onboarding.openChildCreator)
      .run(Onboarding.enterChildDetails, {
        name: child2Name,
        pinRequired: true,
        pin: child2Pin
      })
      .checkUntil(XC.visibleElementCount, 'button[data-test="next-button"]', 1)
      .run(XC.autoClick, 'button[data-test="next-button"]')
      .checkUntil(XC.visibleElementCount, 'button[data-test="create-child-button"]', 1)
      .run(Onboarding.selectChildAvatar, 'cat')
      .run(Onboarding.submitChildCreation)
      .checkUntil(Onboarding.getUserInfo, validEmail, (userInfo) => {
        expect('success' in userInfo && userInfo.success).toBe(true);
        if ('success' in userInfo && userInfo.success) {
          expect(userInfo.children).toHaveLength(2);
          const child2 = userInfo.children!.find(child => child.name === child2Name);
          expect(child2).toBeDefined();
          if (child2) {
            child2Id = child2.id;
            return userInfo.children!.length === 2;
          }
        }
        return false;
      })
      .do();

    await page.X
      .run(Onboarding.openAccountSwitcher)
      .run(Onboarding.selectAccount, child1Id)
      .checkUntil(Onboarding.getCurrentUserName, child1Name)
      .do();

    await page.X
      .run(Onboarding.openAccountSwitcher, true)
      .run(Onboarding.selectAccount, child2Id, child2Pin)
      .checkUntil(Onboarding.getCurrentUserName, child2Name)
      .do();
  });
});
