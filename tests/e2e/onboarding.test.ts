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
  userMenuButton,
  accountAvatarBase
} from './onboarding';
import { UserType, RelationshipType, ProgressStatus, ProgressVideoStatus } from '/presupplied/images/psapp/common/types';

const sortCards = (cardList: { title: string; childIds: number[] }[]) => cardList
  .map(card => ({ 
    title: card.title, 
    childIds: [...card.childIds].sort() 
  }))
  .sort((a, b) => a.title.localeCompare(b.title));

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
    await C.checkForErrorsAndLogs();
    
    if (page) {
      await page.quit();
    }
  });

  it('should complete the full onboarding process with registration and child accounts', async () => {
    const parentName = 'Test Parent';
    const invalidEmail = 'invalidemail';
    const validEmail = C.getUniqueEmail();
    const parentPassword = 'Password123';
    const child1Name = 'Child No Pin';
    const child2Name = 'Child With Pin';
    const child2Pin = '1234';
    let child1Id = 0;
    let child2Id = 0;

    await page.X
      .checkUntil(XC.visibleElementCount, '[data-test="nav-button-home"]', 1)
      .checkUntil(XC.visibleElementCount, '[data-test="nav-button-map"]', 1)
      .checkUntil(XC.visibleElementCount, '[data-test="nav-button-children"]', 0)
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
      .checkUntil(XC.visibleElementCount, '[data-test="nav-button-home"]', 0)
      .checkUntil(XC.visibleElementCount, '[data-test="nav-button-map"]', 0)
      .checkUntil(XC.visibleElementCount, '[data-test="nav-button-children"]', 0)
      .run(Onboarding.createChildComplete, { 
        name: child1Name, 
        birthday: '05/15/2020',
        gender: 'female',
        avatarId: 'bear' 
      })
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
      .checkUntil(XC.visibleElementCount, '[data-test="nav-button-home"]', 1)
      .checkUntil(XC.visibleElementCount, '[data-test="nav-button-map"]', 1)
      .checkUntil(XC.visibleElementCount, '[data-test="nav-button-children"]', 1)
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
      .run(Onboarding.switchToChildAccount, child1Id)
      .checkUntil(Onboarding.getCurrentUserName, child1Name)
      .checkUntil(C.getLocation, (location) => location.pathname === '/')
      .checkUntil(C.getModuleCardInfo, (cards) => {
        expect(sortCards(cards)).toEqual(sortCards([
          { title: 'PS_TESTING_CHILD', childIds: [] }
        ]));
      })
      .run(Onboarding.openAccountSwitcher)
      .run(Onboarding.selectAccount, child2Id, child2Pin)
      .checkUntil(Onboarding.getCurrentUserName, child2Name)
      .do();
  });

  it('should handle the complete invitation workflow with multiple users and role restrictions', async () => {
    const primaryParentEmail = C.getUniqueEmail();
    const secondaryAdultEmail = C.getUniqueEmail();
    const observerEmail = C.getUniqueEmail();
    const childEmail = C.getUniqueEmail();
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

  it('should sync progress to second child when parent signs up after completing modules anonymously', async () => {
    const parentEmail = C.getUniqueEmail();
    const parentPassword = 'Password123';
    const child1Name = 'First Child';
    const child2Name = 'Second Child';
    let child2Id = 0;

    await page.X
      .checkUntil(C.getModuleCardInfo, (cards) => {
        const intro = cards.filter(card => card.title === 'Introduction to presupplied.com');
        expect(intro.length).toBe(1);
        expect(cards.length).toBe(4);
      })
      .run(C.shiftClickModuleCard, 'Introduction to presupplied.com')
      .checkUntil(C.getModuleCardInfo, (cards) => {
        const calibrationCards = cards.filter(card => card.title === 'Skill calibration');
        expect(calibrationCards.length).toBe(1);
        expect(cards.length).toBe(4);
      })
      .run(C.shiftClickModuleCard, 'PS_TESTING_CHILD')
      .checkUntil(XC.visibleElementCount, C.moduleChoiceDialogSelector, 1)
      .run(C.selectModuleChoice, 'teach')
      .checkUntil(XC.visibleElementCount, C.videoListDialogSelector, 1)
      .run(C.selectVideo, 0)
      .checkUntil(C.getVideoListInfo, (videos) => {
        expect(videos[0].isWatched).toBe(true);
        expect(videos[0].status).toBe('Watched');
        const today = new Date().toLocaleDateString();
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toLocaleDateString();
        expect([today, yesterday]).toContain(videos[0].lastWatched);
      })
      .run(C.closeVideoList)
      .run(C.selectModuleChoice, 'learn')
      .checkUntil(XC.visibleElementCount, C.videoListDialogSelector, 1)
      .run(C.selectVideo, 0)
      .checkUntil(C.getVideoListInfo, (videos) => {
        expect(videos[0].isWatched).toBe(true);
        expect(videos[0].status).toBe('Watched');
        const today = new Date().toLocaleDateString();
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toLocaleDateString();
        expect([today, yesterday]).toContain(videos[0].lastWatched);
      })
      .run(C.closeVideoList)
      .run(C.selectModuleChoice, 'mastery')
      .checkUntil(XC.visibleElementCount, C.moduleChoiceDialogSelector, 0)
      .run(C.shiftClickModuleCard, 'Skill calibration')
      .checkUntil(C.getModuleCardInfo, (cards) => {
        const eyesCards = cards.filter(card => card.title === 'Recognizing eyes and faces');
        expect(eyesCards.length).toBe(1);
        expect(cards.length).toBe(3);
      })
      .checkUntil(XC.evaluate, () => {
        const progress = localStorage.getItem('progress');
        return progress ? JSON.parse(progress) : null;
      }, (progress: any) => {
        expect(progress).not.toBeNull();
        expect(progress['INTRODUCTION']).toBeDefined();
        expect(progress['CALIBRATION']).toBeDefined();
        expect(progress['PS_TESTING_CHILD']).toBeDefined();
      })
      .checkUntil(XC.evaluate, () => {
        const progressVideo = localStorage.getItem('progressVideo');
        return progressVideo ? JSON.parse(progressVideo) : null;
      }, (progressVideo: any) => {
        expect(progressVideo).not.toBeNull();
        expect(progressVideo['PS_TESTING_TEACHER_VIDEO']).toBeDefined();
        expect(progressVideo['PS_TESTING_TEACHER_VIDEO'].status).toBe(ProgressVideoStatus.WATCHED);
        expect(progressVideo['PS_TESTING_STUDENT_VIDEO']).toBeDefined();
        expect(progressVideo['PS_TESTING_STUDENT_VIDEO'].status).toBe(ProgressVideoStatus.WATCHED);
      })
      .run(Onboarding.registerUser, {
        name: 'Test Parent',
        email: parentEmail,
        password: parentPassword,
        type: UserType.PARENT
      })
      .checkUntil(XC.elementText, 'h1', (text: string | null) => 
        text?.includes('Create Your Child\'s Account')
      )
      .run(Onboarding.createChildComplete, { name: child1Name, avatarId: 'bear' })
      .checkUntil(XC.elementText, 'h1', (text: string | null) => 
        text?.includes('Sync Your Progress')
      )
      .run(XC.autoClick, '[data-test="create-new-child-profile"]')
      .checkUntil(XC.elementText, 'h1', (text: string | null) => 
        text?.includes('Create Your Child\'s Account')
      )
      .run(Onboarding.createChildComplete, { name: child2Name, avatarId: 'cat' })
      .checkUntil(XC.elementText, 'h1', (text: string | null) => 
        text?.includes('Sync Your Progress')
      )
      .checkUntil(Onboarding.getUserInfo, parentEmail, (userInfo) => {
        if ('success' in userInfo && userInfo.success) {
          expect(userInfo.user.children).toBeDefined();
          expect(userInfo.user.children).toHaveLength(2);
          const child2 = userInfo.user.children!.find((child: any) => child.name === child2Name);
          if (child2) {
            child2Id = child2.id;
            return true;
          }
        }
        return false;
      })
      .do();

    await page.X
      .run(Onboarding.selectSyncChildCard, child2Id)
      .checkUntil(C.getLocation, (location) => location.pathname === '/')
      .checkUntil(XC.evaluate, () => {
        const progress = localStorage.getItem('progress');
        return progress ? JSON.parse(progress) : {};
      }, (progress: any) => {
        expect(Object.keys(progress).length).toBe(0);
      })
      .checkUntil(C.getModuleCardInfo, (cards) => {
        const child1Id = cards.find(card => card.title === 'Skill calibration')?.childIds[0];
        expect(child1Id).toBeDefined();
        expect(child1Id).not.toBe(child2Id);
        
        expect(sortCards(cards)).toEqual(sortCards([
          { title: 'PS_TESTING_ADULT', childIds: [] },
          { title: 'PS_TESTING_DELEGATED', childIds: [child1Id!, child2Id] },
          { title: 'Skill calibration', childIds: [child1Id!] },
          { title: 'Recognizing eyes and faces', childIds: [child2Id] }
        ]));
      })
      .checkUntil(Onboarding.getUserInfo, parentEmail, (userInfo) => {
        if ('success' in userInfo && userInfo.success) {
          expect(userInfo.user.progress).toBeDefined();
          expect(userInfo.user.progress['INTRODUCTION']).toBeDefined();
          expect(userInfo.user.progress['INTRODUCTION'].status).toBe(ProgressStatus.PASSED);
          expect(Object.keys(userInfo.user.progress).length).toBe(1);
          
          expect(userInfo.user.children).toBeDefined();
          expect(userInfo.user.children).toHaveLength(2);
          
          const child1List = userInfo.user.children!.filter(child => child.id !== child2Id);
          expect(child1List.length).toBe(1);
          expect(Object.keys(child1List[0].progress).length).toBe(0);
          
          const child2List = userInfo.user.children!.filter(child => child.id === child2Id);
          expect(child2List.length).toBe(1);
          const child2Info = child2List[0];
          expect(child2Info.progress).toBeDefined();
          expect(child2Info.progress['CALIBRATION']).toBeDefined();
          expect(child2Info.progress['CALIBRATION'].status).toBe(ProgressStatus.PASSED);
          expect(child2Info.progress['PS_TESTING_CHILD']).toBeDefined();
          expect(child2Info.progress['PS_TESTING_CHILD'].status).toBe(ProgressStatus.PASSED);
          expect(Object.keys(child2Info.progress).length).toBe(2);
        }
      })
      .do();
  });

  it('should sync all progress to student account when student signs up after completing modules anonymously', async () => {
    const studentEmail = C.getUniqueEmail();
    const studentPassword = 'Password123';
    const studentName = 'Test Student';

    await page.X
      .checkUntil(C.getModuleCardInfo, (cards) => {
        const introCards = cards.filter(card => card.title === 'Introduction to presupplied.com');
        expect(introCards.length).toBe(1);
        expect(cards.length).toBe(4);
      })
      .run(C.shiftClickModuleCard, 'Introduction to presupplied.com')
      .checkUntil(C.getModuleCardInfo, (cards) => {
        const calibrationCards = cards.filter(card => card.title === 'Skill calibration');
        expect(calibrationCards.length).toBe(1);
        expect(cards.length).toBe(4);
      })
      .run(C.shiftClickModuleCard, 'Skill calibration')
      .checkUntil(C.getModuleCardInfo, (cards) => {
        const eyesCards = cards.filter(card => card.title === 'Recognizing eyes and faces');
        expect(eyesCards.length).toBe(1);
        expect(cards.length).toBe(4);
      })
      .run(C.shiftClickModuleCard, 'Recognizing eyes and faces')
      .checkUntil(XC.visibleElementCount, C.moduleChoiceDialogSelector, 1)
      .run(C.selectModuleChoice, 'mastery')
      .checkUntil(XC.evaluate, () => {
        const progress = localStorage.getItem('progress');
        return progress ? JSON.parse(progress) : null;
      }, (progress: any) => {
        expect(progress).not.toBeNull();
        expect(Object.keys(progress).length).toBe(3);
        expect(progress['INTRODUCTION']).toBeDefined();
        expect(progress['CALIBRATION']).toBeDefined();
        expect(progress['RECOGNIZE_EYES_FACES']).toBeDefined();
      })
      .run(Onboarding.registerUser, {
        name: studentName,
        email: studentEmail,
        password: studentPassword,
        type: UserType.STUDENT
      })
      .checkUntil(C.getLocation, (location) => location.pathname === '/')
      .checkUntil(XC.visibleElementCount, '[data-test="nav-button-home"]', 1)
      .checkUntil(XC.visibleElementCount, '[data-test="nav-button-map"]', 1)
      .checkUntil(XC.visibleElementCount, '[data-test="nav-button-children"]', 0)
      .checkUntil(XC.evaluate, () => {
        const progress = localStorage.getItem('progress');
        return progress ? JSON.parse(progress) : {};
      }, (progress: any) => {
        expect(Object.keys(progress).length).toBe(0);
      })
      .checkUntil(Onboarding.getUserInfo, studentEmail, (userInfo) => {
        if ('success' in userInfo && userInfo.success && userInfo.user.progress) {
          const progressKeys = Object.keys(userInfo.user.progress);
          expect(progressKeys.length).toBe(3);
          expect(userInfo.user.progress['INTRODUCTION']).toBeDefined();
          expect(userInfo.user.progress['INTRODUCTION'].status).toBe(ProgressStatus.PASSED);
          expect(userInfo.user.progress['CALIBRATION']).toBeDefined();
          expect(userInfo.user.progress['CALIBRATION'].status).toBe(ProgressStatus.PASSED);
          expect(userInfo.user.progress['RECOGNIZE_EYES_FACES']).toBeDefined();
          expect(userInfo.user.progress['RECOGNIZE_EYES_FACES'].status).toBe(ProgressStatus.PASSED);
          
          return true;
        }
        return false;
      })
      .checkUntil(C.getModuleCardInfo, (cards) => {
        expect(sortCards(cards)).toEqual(sortCards([
          { title: 'PS_TESTING_ADULT', childIds: [] },
          { title: 'PS_TESTING_CHILD', childIds: [] },
          { title: 'PS_TESTING_DELEGATED', childIds: [] },
          { title: 'Lifting head while on tummy', childIds: [] },
          { title: 'Recognizing "say"', childIds: [] },
          { title: 'Tracking faces', childIds: [] },
          { title: 'Tracking sound', childIds: [] }
        ]));
      })
      .run(C.shiftClickModuleCard, 'Tracking faces')
      // intentionally no choice screen since we are registered as a student
      // and there are only teaching videos
      .checkUntil(C.getModuleCardInfo, (cards) => {
        expect(sortCards(cards)).toEqual(sortCards([
          { title: 'PS_TESTING_ADULT', childIds: [] },
          { title: 'PS_TESTING_CHILD', childIds: [] },
          { title: 'PS_TESTING_DELEGATED', childIds: [] },
          { title: 'Lifting head while on tummy', childIds: [] },
          { title: 'Recognizing "say"', childIds: [] },
          { title: 'Social smiles and signs of affection', childIds: [] },
          { title: 'Tracking objects', childIds: [] },
          { title: 'Tracking sound', childIds: [] }
        ]));
      })
      .do();
  });

  it('should display module cards correctly for parent with multiple children', async () => {
    const parentEmail = C.getUniqueEmail();
    const parentPassword = 'Password123';
    const secondaryEmail = C.getUniqueEmail();
    let child1Id = 0;
    let child2Id = 0;
    let parentId = 0;

    await page.X
      .run(Onboarding.registerUser, {
        name: 'Test Parent',
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
      .run(Onboarding.createChildComplete, { name: 'Child One', avatarId: 'bear' })
      .checkUntil(Onboarding.getUserInfo, parentEmail, (userInfo) => {
        if ('success' in userInfo && userInfo.success) {
          expect(userInfo.user.children).toBeDefined();
          expect(userInfo.user.children).toHaveLength(1);
          expect(userInfo.user.children![0].name).toBe('Child One');
          child1Id = userInfo.user.children![0].id;
          return userInfo.user.children!.length === 1;
        }
        return false;
      })
      .run(Onboarding.openChildCreator)
      .run(Onboarding.createChildComplete, { name: 'Child Two', avatarId: 'cat' })
      .checkUntil(Onboarding.getUserInfo, parentEmail, (userInfo) => {
        if ('success' in userInfo && userInfo.success) {
          expect(userInfo.user.children).toBeDefined();
          expect(userInfo.user.children).toHaveLength(2);
          const child2 = userInfo.user.children!.find((child: any) => child.name === 'Child Two');
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
      .run(C.navigateToRoute, '/')
      .checkUntil(C.getModuleCardInfo, (cards) => {
        expect(cards.length).toBe(3);
        const introCards = cards.filter(card => card.title === 'Introduction to presupplied.com');
        expect(introCards.length).toBe(1);
        expect(introCards[0].title).toBe('Introduction to presupplied.com');
        expect(introCards[0].childIds).toEqual([]);
        const childCards = cards.filter(card => card.title === 'PS_TESTING_CHILD');
        expect(childCards.length).toBe(0);
        const adultCards = cards.filter(card => card.title === 'PS_TESTING_ADULT');
        expect(adultCards.length).toBe(1);
        const delegateCards = cards.filter(card => card.title === 'PS_TESTING_DELEGATED');
        expect(delegateCards.length).toBe(1);
      })
      .run(C.shiftClickModuleCard, 'Introduction to presupplied.com')
      .checkUntil(C.getModuleCardInfo, (cards) => {
        const calibrationCards = cards.filter(card => card.title === 'Skill calibration');
        expect(calibrationCards.length).toBe(1);
        expect(calibrationCards[0].childIds.sort()).toEqual([child1Id, child2Id].sort());
        expect(cards.length).toBe(3);
      })
      .run(C.shiftClickModuleCard, 'Skill calibration')
      .checkUntil(XC.visibleElementCount, C.userSelectorDialogSelector, 1)
      .run(Onboarding.selectAccount, child1Id)
      .checkUntil(C.getModuleCardInfo, (cards) => {
        const eyesFacesCard = cards.find(card => card.title === 'Recognizing eyes and faces');
        expect(eyesFacesCard).toBeDefined();
        expect(eyesFacesCard!.childIds).toEqual([child1Id]);
        
        const remainingCalibrationCards = cards.filter(card => card.title === 'Skill calibration');
        expect(remainingCalibrationCards.length).toBe(1);
        expect(remainingCalibrationCards[0].childIds).toEqual([child2Id]);
        expect(cards.length).toBe(4);
      })
      .run(Onboarding.navigateToChildProfile, child1Id)
      .run(Onboarding.openInviteAdultDialog)
      .run(Onboarding.sendInvitation, secondaryEmail, RelationshipType.SECONDARY)
      .run(Onboarding.logout)
      .run(Onboarding.registerUser, {
        name: 'Secondary Adult',
        email: secondaryEmail,
        password: parentPassword,
        type: UserType.PARENT
      })
      .run(XC.autoClick, Onboarding.acceptInvitationButton)
      .checkUntil(C.getModuleCardInfo, (cards) => {
        expect(cards.length).toBe(3);
        expect(cards[0].title).toBe('Introduction to presupplied.com');
        expect(cards[0].childIds).toEqual([]);
      })
      .run(C.shiftClickModuleCard, 'Introduction to presupplied.com')
      .checkUntil(C.getModuleCardInfo, (cards) => {
        const eyesFacesCards = cards.filter(card => card.title === 'Recognizing eyes and faces');
        expect(eyesFacesCards.length).toBe(1);
        expect(eyesFacesCards[0].childIds).toEqual([child1Id]);
        expect(cards.length).toBe(3);
      })
      .run(C.shiftClickModuleCard, 'Recognizing eyes and faces')
      .checkUntil(XC.visibleElementCount, C.moduleChoiceDialogSelector, 1)
      .run(C.selectModuleChoice, 'mastery')
      .checkUntil(XC.visibleElementCount, C.userSelectorDialogSelector, 1)
      .run(Onboarding.selectAccount, child1Id)
      .checkUntil(C.getModuleCardInfo, (cards) => {
        expect(cards.length).toBe(6);
        const trackingCards = cards.filter(card => card.title === 'Tracking sound');
        expect(trackingCards.length).toBe(1);
        expect(trackingCards[0].childIds).toEqual([child1Id]);
      })
      .run(Onboarding.logout)
      .run(Onboarding.loginUser, parentEmail, parentPassword)
      .run(Onboarding.switchToChildAccount, child1Id)
      .checkUntil(C.getModuleCardInfo, (cards) => {
        expect(cards.length).toBe(1);
        expect(cards[0].title).toBe('PS_TESTING_CHILD');
      })
      .run(Onboarding.openAccountSwitcher)
      .checkUntil(Onboarding.getAccountSwitcherAccountIds, (accountIds) => {
        expect(accountIds).toHaveLength(3);
        expect(accountIds).toContain(child1Id);
        expect(accountIds).toContain(child2Id);
        expect(accountIds).toContain(parentId);
      })
      .run(Onboarding.selectAccount, parentId, '4000')
      .checkUntil(C.getModuleCardInfo, (cards) => {
        expect(cards.length).toBe(7);
        const trackingCards = cards.filter(card => card.title === 'Tracking sound');
        expect(trackingCards.length).toBe(1);
        expect(trackingCards[0].childIds).toEqual([child1Id]);
        const finalCalibrationCards = cards.filter(card => card.title === 'Skill calibration');
        expect(finalCalibrationCards.length).toBe(1);
        expect(finalCalibrationCards[0].childIds).toEqual([child2Id]);
      })
      .run(XC.autoClick, '[data-test-module="PS_TESTING_DELEGATED"]')
      .checkUntil(XC.visibleElementCount, accountAvatarBase, 2)
      .run(Onboarding.selectAccount, child1Id)
      .checkUntil(XC.visibleElementCount, '[data-choice-index="0"]', 1)
      .run(XC.autoClick, '[data-choice-index="0"]')
      .checkUntil(C.getModuleCardInfo, (cards) => {
        expect(sortCards(cards)).toEqual(sortCards([
          { title: 'Lifting head while on tummy', childIds: [child1Id] },
          { title: 'PS_TESTING_ADULT', childIds: [] },
          { title: 'PS_TESTING_DELEGATED', childIds: [child2Id] },
          { title: 'Recognizing "say"', childIds: [child1Id] },
          { title: 'Skill calibration', childIds: [child2Id] },
          { title: 'Tracking faces', childIds: [child1Id] },
          { title: 'Tracking sound', childIds: [child1Id] }
        ]));
      })
      .do();
  });
});
