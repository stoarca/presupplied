import { describe, expect, it, beforeAll, beforeEach, afterEach, afterAll } from 'bun:test';
import { XWebDriver } from 'xdotoolify';
import * as C from './common';
import * as XC from 'xdotoolify/dist/common';
import * as Onboarding from './onboarding';
import { UserType } from '/presupplied/images/psapp/common/types';
import { HOVER_RECT_BACKGROUND_COLOR, CELL_WIDTH, CELL_HEIGHT, CELL_W_PADDING, CELL_H_PADDING } from '/presupplied/images/psapp/client/src/KnowledgeMap';

describe('Map View E2E Tests', () => {
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

  describe('Non-admin map view tests', () => {
    const parentPassword = 'Password123';
    const child1Name = 'Child One';
    const child2Name = 'Child Two';
    let parentEmail = '';
    let child1Id = 0;
    let child2Id = 0;

    beforeEach(async () => {
      parentEmail = C.getUniqueEmail();
      await page.X
        .run(Onboarding.registerUser, {
          name: 'Test Parent',
          email: parentEmail,
          password: parentPassword,
          type: UserType.PARENT
        })
        .run(Onboarding.createChildComplete, { name: child1Name, avatarId: 'bear' })
        .checkUntil(Onboarding.getUserInfo, parentEmail, (userInfo) => {
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
        .run(Onboarding.createChildComplete, { name: child2Name, avatarId: 'cat' })
        .checkUntil(Onboarding.getUserInfo, parentEmail, (userInfo) => {
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
    });

    it('should display correct module status when calibration is completed for only one child', async () => {
      await page.X
        .run(C.navigateToRoute, '/map?scroll=CALIBRATION')
        .checkUntil(C.getLocation, (location) => location.pathname === '/map')
        .run(C.shiftClickMapModule, 'Skill calibration')
        .checkUntil(XC.visibleElementCount, Onboarding.accountAvatarBase, 2)
        .run(Onboarding.selectAccount, child1Id)
        .checkUntil(C.getMapModules, (modules) => {
          expect(modules).toEqual(expect.arrayContaining([
            expect.objectContaining({
              moduleId: 'INTRODUCTION',
              status: 'reachable',
              children: []
            }),
            expect.objectContaining({
              moduleId: 'CALIBRATION',
              status: 'reachable',
              children: expect.arrayContaining([child2Name])
            })
          ]));
          return true;
        })
        .do();
    });

    it('should display map view correctly with children on modules after completing modules', async () => {
      await page.X
        .run(XC.autoClick, C.navButtonMapSelector)
      .checkUntil(C.getLocation, (location) => location.pathname === '/map')
      .run(C.shiftClickMapModule, 'Introduction to presupplied.com')
      .checkUntil(C.getMapModules, (modules) => {
        expect(modules).toEqual(expect.arrayContaining([
          expect.objectContaining({
            moduleId: 'INTRODUCTION',
            status: 'reached',
            children: []
          }),
          expect.objectContaining({
            moduleId: 'CALIBRATION', 
            status: 'reachable',
            children: expect.arrayContaining([child2Name])
          })
        ]));
      })
      .run(C.shiftClickMapModule, 'Skill calibration')
      .checkUntil(XC.visibleElementCount, Onboarding.accountAvatarBase, 2)
      .run(Onboarding.selectAccount, child1Id)
      .run(C.shiftClickMapModule, 'Recognizing eyes and faces')
      .checkUntil(XC.visibleElementCount, C.moduleChoiceDialogSelector, 1)
      .run(C.selectModuleChoice, 'mastery')
      .checkUntil(XC.visibleElementCount, C.userSelectorDialogSelector, 1)
      .run(Onboarding.selectAccount, child1Id)
      .checkUntil(C.getMapModules, (modules) => {
        expect(modules).toEqual(expect.arrayContaining([
          expect.objectContaining({
            moduleId: 'INTRODUCTION',
            status: 'reached',
            children: []
          }),
          expect.objectContaining({
            moduleId: 'CALIBRATION',
            status: 'reachable',
            children: expect.arrayContaining([child2Name])
          }),
          expect.objectContaining({
            moduleId: 'RECOGNIZE_EYES_FACES',
            status: 'reached',
            children: []
          }),
          expect.objectContaining({
            moduleId: 'PS_TESTING_ADULT',
            status: 'reachable',
            children: []
          }),
          expect.objectContaining({
            moduleId: 'PS_TESTING_CHILD',
            status: 'reachable',
            children: expect.arrayContaining([child1Name, child2Name])
          }),
          expect.objectContaining({
            moduleId: 'PS_TESTING_DELEGATED',
            status: 'reachable',
            children: expect.arrayContaining([child1Name, child2Name])
          }),
          expect.objectContaining({
            moduleId: 'TUMMY_LIFT_HEAD',
            status: 'reachable',
            children: expect.arrayContaining([child1Name])
          }),
          expect.objectContaining({
            moduleId: 'TRACKING_FACE',
            status: 'reachable',
            children: expect.arrayContaining([child1Name])
          }),
          expect.objectContaining({
            moduleId: 'TRACKING_SOUND',
            status: 'reachable',
            children: expect.arrayContaining([child1Name])
          }),
          expect.objectContaining({
            moduleId: 'RECOGNIZE_SAY',
            status: 'reachable',
            children: expect.arrayContaining([child1Name])
          })
        ]));
      })
      .run(C.shiftClickMapModule, 'Skill calibration')
      .checkUntil(XC.visibleElementCount, C.userSelectorDialogSelector, 1)
      .run(Onboarding.selectAccount, child2Id)
      .checkUntil(C.getMapModules, (modules) => {
        expect(modules).toEqual(expect.arrayContaining([
          expect.objectContaining({
            moduleId: 'CALIBRATION',
            status: 'reached',
            children: []
          }),
          expect.objectContaining({
            moduleId: 'RECOGNIZE_EYES_FACES',
            status: 'reachable',
            children: expect.arrayContaining([child2Name])
          })
        ]));
      })
      .run(C.clickMapModule, 'PS_TESTING_DELEGATED')
      .checkUntil(XC.visibleElementCount, C.userSelectorDialogSelector, 1)
      .run(Onboarding.selectAccount, child1Id)
      .checkUntil(XC.elementText, 'body', (text) => text?.includes('This is a test delegated module. Click yes to complete.'))
      .checkUntil(XC.visibleElementCount, '[data-choice-index="0"]', 1)
      .run(XC.autoClick, '[data-choice-index="0"]')
      .checkUntil(C.getLocation, (location) => location.pathname === '/map')
      .checkUntil(C.getMapModules, (modules) => {
        expect(modules).toEqual(expect.arrayContaining([
          expect.objectContaining({
            moduleId: 'PS_TESTING_DELEGATED',
            status: 'reachable',
            children: expect.arrayContaining([child2Name])
          })
        ]));
      })
      .run(C.clickMapModule, 'PS_TESTING_DELEGATED')
      .checkUntil(XC.elementText, 'body', (text) => text?.includes('This is a test delegated module. Click yes to complete.'))
      .checkUntil(XC.visibleElementCount, '[data-choice-index="0"]', 1)
      .run(XC.autoClick, '[data-choice-index="0"]')
      .checkUntil(C.getLocation, (location) => location.pathname === '/map')
      .checkUntil(C.getMapModules, (modules) => {
        expect(modules).toEqual(expect.arrayContaining([
          expect.objectContaining({
            moduleId: 'PS_TESTING_DELEGATED',
            status: 'reached',
            children: []
          })
        ]));
      })
      .run(C.shiftClickMapModule, 'PS_TESTING_DELEGATED')
      .checkUntil(XC.visibleElementCount, C.userSelectorDialogSelector, 1)
      .run(Onboarding.selectAccount, child1Id)
      .checkUntil(C.getMapModules, (modules) => {
        expect(modules).toEqual(expect.arrayContaining([
          expect.objectContaining({
            moduleId: 'PS_TESTING_DELEGATED',
            status: 'reachable',
            children: expect.arrayContaining([child1Name])
          })
        ]));
      })
      .do();
    });
  });

  it('should support admin map editing features', async () => {
    let hoverX = 0;
    let hoverY = 0;
    let zoomLevel = 0;
    let newModuleId: string | null = null;
    const editedModuleId = 'CUSTOM_TEST_MODULE';
    
    await page.X
      .run(C.navigateToRoute, '/map?admin=1&scroll=PS_TESTING_ADULT')
      .checkUntil(C.getMapZoomLevel, (level) => {
        zoomLevel = level;
        return level > 0;
      })
      .checkUntil(XC.evaluate, (_moduleId: string) => {
        const moduleNode = document.querySelector(`[data-test="map-module-node-${_moduleId}"]`);
        if (!moduleNode) {
          return false;
        }
        const rect = moduleNode.getBoundingClientRect();
        const viewport = {
          top: 0,
          left: 0,
          bottom: window.innerHeight,
          right: window.innerWidth
        };
        return rect.top >= viewport.top && rect.left >= viewport.left && 
               rect.bottom <= viewport.bottom && rect.right <= viewport.right;
      }, 'PS_TESTING_ADULT', true)
      .checkUntil(C.getBoundingClientRect, C.getMapModuleNodeSelector('PS_TESTING_ADULT'), (rect) => {
        expect(rect).not.toBeNull();
        if (rect) {
          hoverX = rect.right + 50;
          hoverY = rect.top + (rect.height / 2);
          return true;
        }
        return false;
      })
      .do();

    await page.X
      .mousemove({ x: hoverX, y: hoverY })
      .checkUntil(XC.evaluate, () => {
        const hoverRect = document.querySelector('[data-test="map-hover-rectangle"]');
        return hoverRect ? {
          visible: window.getComputedStyle(hoverRect).display !== 'none',
          backgroundColor: window.getComputedStyle(hoverRect).backgroundColor,
          bounds: hoverRect.getBoundingClientRect()
        } : null;
      }, (hoverInfo: any) => {
        expect(hoverInfo).not.toBeNull();
        expect(hoverInfo.visible).toBe(true);
        expect(hoverInfo.backgroundColor).toBe(HOVER_RECT_BACKGROUND_COLOR);
        
        expect(hoverInfo.bounds.width).toBeCloseTo(CELL_WIDTH * zoomLevel, 1);
        expect(hoverInfo.bounds.height).toBeCloseTo(CELL_HEIGHT * zoomLevel, 1);
        
        expect(hoverInfo.bounds.left).toBeLessThan(hoverX);
        expect(hoverInfo.bounds.right).toBeGreaterThan(hoverX);
        expect(hoverInfo.bounds.top).toBeLessThan(hoverY);
        expect(hoverInfo.bounds.bottom).toBeGreaterThan(hoverY);
        
        return hoverInfo !== null && hoverInfo.visible;
      })
      .click()
      .checkUntil(C.getMapModules, (modules) => {
        return modules.some(m => m.moduleId.startsWith('NEW_MODULE_'));
      })
      .checkUntil(C.getMapModules, (modules) => {
        const newModule = modules.find(m => m.moduleId.startsWith('NEW_MODULE_'));
        if (newModule) {
          newModuleId = newModule.moduleId;
          return true;
        }
        return false;
      })
      .do();
    
    await page.X
      .checkUntil(XC.visibleElementCount, C.getMapModuleNodeSelector(newModuleId!), 1)
      .run(XC.autoClick, C.getMapModuleNodeSelector(newModuleId!))
      .checkUntil(XC.visibleElementCount, C.moduleEditDialogSelector, 1)
      .checkUntil(XC.visibleElementCount, C.moduleIdInputSelector, 1)
      .run(XC.autoType, C.moduleIdInputSelector, editedModuleId, { overwrite: true })
      .checkUntil(XC.getInputValue, C.moduleIdInputSelector, editedModuleId)
      .run(XC.autoClick, C.applyButtonSelector)
      .checkUntil(XC.visibleElementCount, C.getMapModuleNodeSelector(editedModuleId), 1)
      .checkUntil(XC.visibleElementCount, C.getMapModuleNodeSelector(newModuleId!), 0)
      .checkUntil(C.getMapModules, (modules) => {
        const editedModule = modules.find(m => m.moduleId === editedModuleId);
        expect(editedModule).toBeDefined();
        expect(editedModule!.status).toBe('unreached');
        expect(editedModule!.children).toEqual([]);
        return editedModule !== undefined;
      })
      .do();
  });

  it('should zoom with fixed point at mouse position', async () => {
    const moduleSelector = C.getMapModuleNodeSelector('PECK_DIGITS_ON_KEYBOARD');
    let moduleBounds: any;

    await page.X
      .run(C.navigateToRoute, '/map?admin=1&scroll=PECK_DIGITS_ON_KEYBOARD')
      .checkUntil(C.getLocation, (location) => location.pathname === '/map')
      .checkUntil(XC.elementCount, C.originMarkerSelector, 1)
      .mousemove(moduleSelector)
      .checkUntil(C.verifyHoverRect, 'PECK_DIGITS_ON_KEYBOARD', true)
      ._keydown('ctrl')
      .wheeldown(40)
      .checkUntil(C.verifyHoverRect, 'PECK_DIGITS_ON_KEYBOARD', true)
      ._keyup('ctrl')
      .mousemove(moduleSelector)
      .checkUntil(C.verifyHoverRect, 'PECK_DIGITS_ON_KEYBOARD', true)
      .jitter()
      ._keydown('ctrl')
      .wheelup(40)
      .checkUntil(C.verifyHoverRect, 'PECK_DIGITS_ON_KEYBOARD', true)
      ._keyup('ctrl')
      .mousemove(moduleSelector)
      .checkUntil(C.verifyHoverRect, 'PECK_DIGITS_ON_KEYBOARD', true)
      .do();
  });
});
