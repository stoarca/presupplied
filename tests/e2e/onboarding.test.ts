import { describe, expect, it, beforeAll, beforeEach, afterEach, afterAll } from 'bun:test';
import { XWebDriver } from 'xdotoolify';
import * as C from './common';
import * as XC from 'xdotoolify/dist/common';
import * as Onboarding from './onboarding';
import { 
  childNameInput, 
  createChildNextButton, 
  createChildButton,
  acceptInvitationButton,
  declineInvitationButton,
  logoutButton,
  errorMessage,
  relationshipTypeSelect,
  sendInvitationButton,
  inviteAdultButton,
  userMenuButton
} from './onboarding';
import { UserType, RelationshipType } from '/presupplied/images/psapp/common/types';

let emailCounter = 0;
const getUniqueEmail = () => `ps-test-account-${emailCounter++}@example.com`;

describe('Presupplied Onboarding E2E Tests', () => {
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
    const errors = await C.fetchWebErrors();
    if (errors.length > 0) {
      console.error('Client-side errors detected:');
      errors.forEach(error => console.error(` - ${error}`));
      throw new Error('Client-side errors detected during test');
    }

    const logs = await C.fetchWebLogs();
    if (logs.length > 0) {
      console.log('Client-side logs:');
      logs.forEach(log => console.log(` - ${log}`));
    }
    
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
      .checkUntil(XC.elementText, Onboarding.userMenuButton, (x: string | null) => 
        expect(x?.toLowerCase()).toBe(validEmail.toLowerCase()))
      .run(Onboarding.createChildComplete, { name: child1Name, avatarId: 'bear' })
      .checkUntil(Onboarding.getUserInfo, validEmail, (userInfo) => {
        expect('success' in userInfo && userInfo.success).toBe(true);
        if ('success' in userInfo && userInfo.success) {
          expect(userInfo.user.children).toBeDefined();
          expect(userInfo.user.children).toHaveLength(1);
          expect(userInfo.user.children![0].name).toBe(child1Name);
          child1Id = userInfo.user.children![0].id;
          return userInfo.user.children!.length === 1;
        }
        return false;
      })
      .run(Onboarding.openChildCreator)
      .run(Onboarding.createChildComplete, {
        name: child2Name,
        pinRequired: true,
        pin: child2Pin,
        avatarId: 'cat'
      })
      .checkUntil(Onboarding.getUserInfo, validEmail, (userInfo) => {
        expect('success' in userInfo && userInfo.success).toBe(true);
        if ('success' in userInfo && userInfo.success) {
          expect(userInfo.user.children).toBeDefined();
          expect(userInfo.user.children).toHaveLength(2);
          const child2 = userInfo.user.children!.find((child: any) => child.name === child2Name);
          expect(child2).toBeDefined();
          if (child2) {
            child2Id = child2.id;
            return userInfo.user.children!.length === 2;
          }
        }
        return false;
      })
      .do();

    await page.X
      .run(Onboarding.openAccountSwitcher)
      .run(Onboarding.selectAccount, child1Id)
      .checkUntil(Onboarding.getCurrentUserName, child1Name)
      .checkUntil(C.getLocation, (location) => location.pathname === '/')
      .checkUntil(XC.visibleElementCount, Onboarding.moduleCardSelector, 0)
      .checkUntil(XC.visibleElementCount, Onboarding.noModulesMessageSelector, 1)
      .run(Onboarding.openAccountSwitcher, true)
      .run(Onboarding.selectAccount, child2Id, child2Pin)
      .checkUntil(Onboarding.getCurrentUserName, child2Name)
      .do();
  });

  it('should handle the complete invitation workflow with multiple users and role restrictions', async () => {
    const primaryParentEmail = getUniqueEmail();
    const secondaryAdultEmail = getUniqueEmail();
    const observerEmail = getUniqueEmail();
    const childEmail = getUniqueEmail();
    const childName = 'Test Child For Invites';
    const primaryParentName = 'Primary Parent';
    const secondaryAdultName = 'Secondary Adult';
    const observerName = 'Observer Adult';
    const childAccountName = 'Child Account';
    const password = 'Password123';
    let childId = 0;

    await page.X
      .run(Onboarding.registerUser, {
        name: primaryParentName,
        email: primaryParentEmail,
        password: password,
        type: UserType.PARENT
      })
      .run(Onboarding.createChildComplete, { name: childName, avatarId: 'bear' })
      .checkUntil(Onboarding.getUserInfo, primaryParentEmail, (userInfo) => {
        expect('success' in userInfo && userInfo.success).toBe(true);
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

    await page.X
      .run(Onboarding.navigateToChildProfile, childId, { mode: 'slow' })
      .run(Onboarding.openInviteAdultDialog)
      .run(Onboarding.sendInvitation, secondaryAdultEmail, RelationshipType.SECONDARY)
      .run(Onboarding.openInviteAdultDialog)
      .run(Onboarding.sendInvitation, observerEmail, RelationshipType.OBSERVER)
      .run(Onboarding.openInviteAdultDialog)
      .run(Onboarding.sendInvitation, childEmail, RelationshipType.OBSERVER)
      .run(Onboarding.logout);

    await page.X
      .run(Onboarding.registerUser, {
        name: secondaryAdultName,
        email: secondaryAdultEmail,
        password: password,
        type: UserType.PARENT
      })
      .checkUntil(Onboarding.getInvitationCount, 1)
      .checkUntil(Onboarding.verifyInvitationDetails, childName, RelationshipType.SECONDARY, true)
      .run(Onboarding.acceptInvitation, 0)
      .checkUntil(Onboarding.getUserInfo, secondaryAdultEmail, (userInfo) => {
        expect('success' in userInfo && userInfo.success).toBe(true);
        if ('success' in userInfo && userInfo.success) {
          expect(userInfo.user.children).toBeDefined();
          expect(userInfo.user.children).toHaveLength(1);
          expect(userInfo.user.children![0].name).toBe(childName);
          expect(userInfo.user.children![0].relationshipType).toBe(RelationshipType.SECONDARY);
          return true;
        }
        return false;
      })
      .run(Onboarding.navigateToChildProfile, childId, { mode: 'slow' })
      .checkUntil(XC.visibleElementCount, inviteAdultButton, 0)
      .run(Onboarding.logout);

    await page.X
      .run(Onboarding.registerUser, {
        name: observerName,
        email: observerEmail,
        password: password,
        type: UserType.TEACHER
      })
      .checkUntil(Onboarding.getInvitationCount, 1)
      .checkUntil(Onboarding.verifyInvitationDetails, childName, RelationshipType.OBSERVER, true)
      .run(Onboarding.rejectInvitation, 0)
      .checkUntil(Onboarding.getInvitationCount, 0)
      .checkUntil(Onboarding.getUserInfo, observerEmail, (userInfo) => {
        expect('success' in userInfo && userInfo.success).toBe(true);
        if ('success' in userInfo && userInfo.success) {
          expect(userInfo.user.children).toBeDefined();
          expect(userInfo.user.children).toHaveLength(0);
          return true;
        }
        return false;
      })
      .run(Onboarding.logout);

    await page.X
      .run(Onboarding.registerUser, {
        name: childAccountName,
        email: childEmail,
        password: password,
        type: UserType.STUDENT
      })
      .checkUntil(Onboarding.getInvitationCount, 0)
      .checkUntil(Onboarding.getUserInfo, childEmail, (userInfo) => {
        expect('success' in userInfo && userInfo.success).toBe(true);
        if ('success' in userInfo && userInfo.success) {
          expect(userInfo.user.children).toBeDefined();
          expect(userInfo.user.children).toHaveLength(0);
          return true;
        }
        return false;
      })
      .run(C.navigateToRoute, '/invitations')
      .checkUntil(XC.elementText, C.errorAlertSelector, (text: string | null) => 
        text?.includes('Student accounts cannot view invitations')
      )
      .do();
  });
});
