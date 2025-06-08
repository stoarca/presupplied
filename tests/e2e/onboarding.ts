import Xdotoolify, { XWebDriver } from 'xdotoolify';
import { WebDriver } from 'selenium-webdriver';
import * as XC from 'xdotoolify/dist/common';
import { UserType } from '/presupplied/images/psapp/common/types';
import { typedFetch } from '/presupplied/images/psapp/client/src/typedFetch';
import * as C from './common';
import { moduleCardSelector, settingsLink, manageChildrenLink, childCardSelector, navButtonChildrenSelector } from './common';

interface RegistrationDetails {
  name: string;
  email: string;
  password: string;
  type: UserType;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface ChildStep1Details {
  name: string;
  pinRequired?: boolean;
  pin?: string;
}

interface ChildStep2Details {
  avatarId?: string;
}

interface ChildDetails extends ChildStep1Details, ChildStep2Details {}

// Base selectors for navigation and forms
export const registerLink = 'a[href="/register"]';
export const loginLink = '[data-test="login-button-navbar"]';
export const nameInput = 'input[name="name"]';
export const emailInput = 'input[name="email"]';
export const passwordInput = 'input[name="password"]';
export const userTypeRadioGroup = 'input[name="user-type"]';
export const submitButton = 'button[type="submit"]';
export const errorMessage = '.MuiFormHelperText-root.Mui-error';
export const noModulesMessageSelector = '[data-test="no-modules-message"]';
export const getUserTypeRadioSelector = (type: string) => `input[name="user-type"][value="${type}"]`;

// User menu and account selectors
export const userMenuButton = 'button[data-test="user-display-email"]';
export const userDisplayName = '[data-test="user-display-name"]';
export const userAvatar = '[data-test="user-avatar"]';
export const logoutButton = '[data-test="menu-item-logout"]';
export const childModeButton = '[data-test="menu-item-child-mode"]';
export const settingsMenuItem = '[data-test="menu-item-settings"]';
export const mapViewMenuItem = '[data-test="menu-item-map-view"]';
export const addChildMenuItem = '[data-test="menu-item-add-child"]';
export const accountSwitcher = 'div[data-test="account-switcher"]';
export const accountAvatarBase = '[data-test^="account-avatar-"]';
export const accountSwitcherDialogTitle = '#account-switcher-dialog-title';
export const getAccountAvatarSelector = (accountId: number) => `[data-test="account-avatar-${accountId}"]`;
export const getChildCardSelector = (childId: number) => `[data-test="child-card-${childId}"]`;

export const getAccountSwitcherAccountIds = Xdotoolify.setupWithPage(async (page) => {
  return XC.evaluate(page, (_accountAvatarBase: string) => {
    const accountContainers = document.querySelectorAll(_accountAvatarBase);
    return Array.from(accountContainers).map(container => {
      const testAttr = container.getAttribute('data-test');
      const match = testAttr?.match(/account-avatar-(\d+)/);
      return match ? parseInt(match[1]) : null;
    }).filter(id => id !== null) as number[];
  }, accountAvatarBase);
});

// Child creation selectors
export const addChildCard = '[data-test="add-child-card"]';
export const childNameInput = 'input[data-test="child-name-input"]';
export const pinRequiredCheckbox = 'input[data-test="pin-required-checkbox"]';
export const pinInput = 'input[data-test="pin-input"]';
export const createChildNextButton = 'button[data-test="create-child-next-button"]';
export const createChildButton = 'button[data-test="create-child-button"]';
export const switchToChildButton = '[data-test="switch-to-child-button"]';
export const getAvatarSelector = (avatarId: string) => `[data-test="avatar-option-${avatarId}"]`;
export const getSelectedAvatarSelector = (avatarId: string) => `${getAvatarSelector(avatarId)} .avatar-selected`;

// PIN entry selectors
export const pinDialogSelector = '[data-test="pin-dialog"]';
export const pinInputSelector = '#pin';
export const pinSubmitButton = 'button[data-test="pin-submit"]';
export const getPinDigitButtonSelector = (digit: string) => `button[data-test="pin-digit-${digit}"]`;

// Invitation selectors
export const inviteAdultButton = '[data-test="invite-adult-button"]';
export const inviteEmailInput = '[data-test="invite-email-input"]';
export const relationshipTypeSelect = '[data-test="relationship-type-select"]';
export const sendInvitationButton = '[data-test="send-invitation-button"]';
export const invitationCard = '[data-test="invitation-card"]';
export const acceptInvitationButton = '[data-test="accept-invitation-button"]';
export const declineInvitationButton = '[data-test="decline-invitation-button"]';
export const childNameSelector = '[data-test="child-name"]';
export const relationshipRoleSelector = '[data-test="relationship-role"]';
export const inviteDialogSelector = '[data-test="invite-dialog"]';
export const getRelationshipOptionSelector = (type: string) => `[data-test="relationship-option-${type.toLowerCase()}"]`;

export const getUserInfo = Xdotoolify.setupWithoutPage(async (email: string) => {
  return await typedFetch({
    host: 'https://applocal.presupplied.com',
    endpoint: '/api/test/get-user-info',
    method: 'post',
    body: { email },
  });
});

export const selectSyncChildCard = Xdotoolify.setupWithPage(async (page, childId: number) => {
  await page.X
    .run(XC.autoClick, `[data-test="sync-child-card-${childId}"]`)
    .checkUntil(C.getLocation, (location) => location.pathname === '/')
    .do();
});

export const getCurrentUserName = Xdotoolify.setupWithPage(async (page) => {
  return await XC.evaluate(page, (_userDisplayName: string) => {
    const nameElement = document.querySelector(_userDisplayName);
    return nameElement ? nameElement.textContent : null;
  }, userDisplayName);
});

// Navigation functions
export const navigateToRegister = Xdotoolify.setupWithPage(async (page) => {
  await page.X
    .checkUntil(XC.visibleElementCount, registerLink, 1)
    .run(XC.autoClick, registerLink)
    .checkUntil(XC.visibleElementCount, submitButton, 1)
    .do();
});

export const navigateToLogin = Xdotoolify.setupWithPage(async (page) => {
  await page.X
    .checkUntil(XC.visibleElementCount, loginLink, 1)
    .run(XC.autoClick, loginLink)
    .checkUntil(XC.visibleElementCount, submitButton, 1)
    .do();
});

// Registration functions
export const enterRegistrationDetails = Xdotoolify.setupWithPage(async (
  page, 
  { name, email, password, type }: RegistrationDetails
) => {
  const typeSelector = getUserTypeRadioSelector(type);
  
  await page.X
    .checkUntil(XC.visibleElementCount, nameInput, 1)
    .run(XC.autoType, nameInput, name, { overwrite: true })
    .checkUntil(XC.getInputValue, nameInput, name)
    .checkUntil(XC.visibleElementCount, emailInput, 1)
    .run(XC.autoType, emailInput, email, { overwrite: true })
    .checkUntil(XC.getInputValue, emailInput, email)
    .checkUntil(XC.visibleElementCount, passwordInput, 1)
    .run(XC.autoType, passwordInput, password, { overwrite: true })
    .checkUntil(XC.getInputValue, passwordInput, password)
    .checkUntil(XC.visibleElementCount, typeSelector, {allowZeroOpacity: true}, 1)
    .run(XC.autoClick, typeSelector)
    // Check that radio button is selected instead of its value
    .checkUntil(XC.evaluate, (_typeSelector: string) => {
      const radio = document.querySelector(_typeSelector) as HTMLInputElement;
      return radio ? radio.checked : false;
    }, typeSelector, true)
    .do();
});

export const submitRegistration = Xdotoolify.setupWithPage(async (page, expectSuccess = true) => {
  let ret = page.X
    .checkUntil(XC.visibleElementCount, submitButton, 1)
    .run(XC.autoClick, submitButton)

  if (expectSuccess) {
    await ret
      .checkUntil(XC.visibleElementCount, userMenuButton, 1)
      .do();
  } else {
    await ret
      .checkUntil(XC.visibleElementCount, errorMessage, (count: number) => count > 0)
      .do();
  }
});

// Login functions
export const enterLoginCredentials = Xdotoolify.setupWithPage(async (page, { email, password }: LoginCredentials) => {
  await page.X
    .checkUntil(XC.visibleElementCount, emailInput, 1)
    .run(XC.autoType, emailInput, email, { overwrite: true })
    .checkUntil(XC.getInputValue, emailInput, email)
    .run(XC.autoType, passwordInput, password, { overwrite: true })
    .checkUntil(XC.getInputValue, passwordInput, password)
    .do();
});

export const submitLogin = Xdotoolify.setupWithPage(async (page, expectSuccess = true) => {
  await page.X
    .checkUntil(XC.visibleElementCount, submitButton, 1)
    .run(XC.autoClick, submitButton)
    .do();

  if (expectSuccess) {
    // Check for successful login by checking for homepage elements
    await page.X
      .checkUntil(XC.evaluate, () => {
        return window.location.pathname === "/";
      }, true)
      .do();
  } else {
    // Check for error message
    await page.X
      .checkUntil(XC.visibleElementCount, errorMessage, (count: number) => count > 0)
      .do();
  }
});

// Child account management  
export const openChildCreator = Xdotoolify.setupWithPage(async (page) => {
  await page.X
    .checkUntil(XC.visibleElementCount, navButtonChildrenSelector, 1)
    .run(XC.autoClick, navButtonChildrenSelector)
    .checkUntil(XC.evaluate, () => {
      return window.location.pathname;
    }, '/children')
    .checkUntil(XC.visibleElementCount, addChildCard, 1)
    .run(XC.autoClick, addChildCard)
    .checkUntil(XC.evaluate, () => {
      return window.location.pathname;
    }, '/create-child')
    .checkUntil(XC.visibleElementCount, childNameInput, 1)
    .do();
});

export const enterChildDetails = Xdotoolify.setupWithPage(async (page, { name, pinRequired = false, pin = "" }: ChildStep1Details) => {
  await page.X
    .checkUntil(XC.visibleElementCount, childNameInput, 1)
    .run(XC.autoType, childNameInput, name)
    .checkUntil(XC.getInputValue, childNameInput, name)
    .do();

  if (pinRequired) {
    await page.X
      .checkUntil(XC.visibleElementCount, pinRequiredCheckbox, {allowZeroOpacity: true}, 1)
      .run(XC.autoClick, pinRequiredCheckbox)
      .checkUntil(XC.visibleElementCount, pinInput, 1)
      .run(XC.autoType, pinInput, pin)
      .checkUntil(XC.getInputValue, pinInput, pin)
      .do();
  }
});

export const selectChildAvatar = Xdotoolify.setupWithPage(async (page, avatarId = 'bear') => {
  const avatarSelector = getAvatarSelector(avatarId);
  const selectedAvatarSelector = getSelectedAvatarSelector(avatarId);

  await page.X
    .checkUntil(XC.visibleElementCount, avatarSelector, 1)
    .run(XC.autoClick, avatarSelector)
    .checkUntil(XC.visibleElementCount, selectedAvatarSelector, 1)
    .do();
});

export const submitChildCreation = Xdotoolify.setupWithPage(async (page) => {
  await page.X
    .checkUntil(XC.visibleElementCount, createChildButton, 1)
    .run(XC.autoClick, createChildButton)
    .do();
});

export const createChildComplete = Xdotoolify.setupWithPage(async (page, childDetails: ChildDetails) => {
  const { avatarId = 'bear', ...step1Details } = childDetails;
  
  await page.X
    .checkUntil(XC.visibleElementCount, childNameInput, 1)
    .run(enterChildDetails, step1Details)
    .checkUntil(XC.visibleElementCount, createChildNextButton, 1)
    .run(XC.autoClick, createChildNextButton)
    .checkUntil(XC.visibleElementCount, createChildButton, 1)
    .run(selectChildAvatar, avatarId)
    .run(submitChildCreation)
    .do();
});

export const switchToChildAccount = Xdotoolify.setupWithPage(async (page, childId: number) => {
  await page.X
    .run(navigateToChildProfile, childId, { mode: 'slow' })
    .checkUntil(XC.visibleElementCount, switchToChildButton, 1)
    .run(XC.autoClick, switchToChildButton)
    .checkUntil(XC.evaluate, () => {
      return window.location.pathname;
    }, '/')
    .do();
});

export const openAccountSwitcher = Xdotoolify.setupWithPage(async (page) => {
  await page.X
    .checkUntil(XC.visibleElementCount, userAvatar, 1)
    .run(XC.autoClick, userAvatar)
    .checkUntil(
      XC.visibleElementCount, accountAvatarBase, (x) => x >= 1
    )
    .do();
});

export const selectAccount = Xdotoolify.setupWithPage(async (page, accountId: number, pin?: string) => {
  const accountSelector = getAccountAvatarSelector(accountId);

  let chain = page.X
    .checkUntil(XC.visibleElementCount, accountSelector, 1)
    .run(XC.autoClick, accountSelector);

  if (pin) {
    chain = chain
      .checkUntil(XC.visibleElementCount, pinDialogSelector, 1)
      .run(enterPIN, pin);
  }

  chain = chain.checkUntil(XC.visibleElementCount, accountSwitcherDialogTitle, 0);

  await chain.do();
});

export const enterPIN = Xdotoolify.setupWithPage(async (page, pin: string) => {
  let displayedPin = '';
  
  for (const digit of pin) {
    const digitButton = getPinDigitButtonSelector(digit);
    displayedPin += digit;
    
    await page.X
      .checkUntil(XC.visibleElementCount, digitButton, 1)
      .run(XC.autoClick, digitButton)
      .checkUntil(XC.evaluate, (_pinInputSelector: string) => {
        const input = document.querySelector(_pinInputSelector) as HTMLInputElement;
        return input ? input.value.length : 0;
      }, pinInputSelector, displayedPin.length)
      .do();
  }

  await page.X
    .checkUntil(XC.visibleElementCount, pinSubmitButton, 1)
    .run(XC.autoClick, pinSubmitButton)
    .checkUntil(XC.visibleElementCount, pinDialogSelector, 0)
    .do();
});

// Error handling
export const getErrorMessage = Xdotoolify.setupWithPage(async (page) => {
  return XC.elementText(page, errorMessage) as Promise<string | null>;
});

// Invitation workflow functions
export const navigateToChildProfile = Xdotoolify.setupWithPage(
  async (page, childId: number, options?: { mode: 'quick' | 'slow' }) => {
    const mode = options?.mode || 'quick';
    
    if (mode === 'quick') {
      await page.X
        .run(XC.evaluate, (id: number) => {
          window.location.href = `/settings/child/${id}`;
        }, childId)
        .checkUntil(XC.evaluate, () => {
          return window.location.pathname.includes('/settings/child/');
        }, true)
        .do();
    } else {
      const childCardSelector = getChildCardSelector(childId);
      await page.X
        .checkUntil(XC.visibleElementCount, navButtonChildrenSelector, 1)
        .run(XC.autoClick, navButtonChildrenSelector)
        .checkUntil(XC.evaluate, () => {
          return window.location.pathname;
        }, '/children')
        .checkUntil(XC.visibleElementCount, childCardSelector, 1)
        .run(XC.autoClick, childCardSelector)
        .checkUntil(XC.evaluate, (id: number) => {
          return window.location.pathname;
        }, `/settings/child/${childId}`)
        .do();
    }
  }
);

export const openInviteAdultDialog = Xdotoolify.setupWithPage(async (page) => {
  await page.X
    .checkUntil(XC.visibleElementCount, inviteAdultButton, 1)
    .run(XC.autoClick, inviteAdultButton)
    .checkUntil(XC.visibleElementCount, inviteDialogSelector, 1)
    .do();
});

export const sendInvitation = Xdotoolify.setupWithPage(async (page, email: string, relationshipType: string) => {
  const relationshipOptionSelector = getRelationshipOptionSelector(relationshipType);
  
  await page.X
    .checkUntil(XC.visibleElementCount, inviteEmailInput, 1)
    .run(XC.autoType, inviteEmailInput, email)
    .checkUntil(XC.getInputValue, inviteEmailInput, email)
    .checkUntil(XC.visibleElementCount, relationshipTypeSelect, { allowZeroOpacity: true}, 1)
    .run(XC.autoClick, relationshipTypeSelect, { unsafeIgnoreUnmatchedClick: true })
    .checkUntil(XC.visibleElementCount, relationshipOptionSelector, 1)
    .run(XC.autoClick, relationshipOptionSelector)
    .checkUntil(XC.visibleElementCount, sendInvitationButton, 1)
    .run(XC.autoClick, sendInvitationButton)
    .checkUntil(XC.visibleElementCount, inviteDialogSelector, 0)
    .do();
});


export const acceptInvitation = Xdotoolify.setupWithPage(async (page, invitationIndex = 0) => {
  await page.X
    .checkUntil(XC.visibleElementCount, acceptInvitationButton, (count: number) => count > invitationIndex)
    .run(XC.autoClick, [acceptInvitationButton, invitationIndex])
    .do();
});

export const rejectInvitation = Xdotoolify.setupWithPage(async (page, invitationIndex = 0) => {
  await page.X
    .checkUntil(XC.visibleElementCount, declineInvitationButton, (count: number) => count > invitationIndex)
    .run(XC.autoClick, [declineInvitationButton, invitationIndex])
    .do();
});

export const getInvitationCount = Xdotoolify.setupWithPage(async (page) => {
  return XC.evaluate(page, (_invitationCard: string) => {
    const invitations = document.querySelectorAll(_invitationCard);
    return invitations.length;
  }, invitationCard);
});

export const verifyInvitationDetails = Xdotoolify.setupWithPage(async (page, expectedChildName: string, expectedRole: string, shouldExist = true) => {
  return XC.evaluate(page, (_invitationCard: string, _childNameSelector: string, _relationshipRoleSelector: string, childName: string, role: string) => {
    const invitations = document.querySelectorAll(_invitationCard);
    
    for (const invitation of invitations) {
      const childNameEl = invitation.querySelector(_childNameSelector);
      const roleEl = invitation.querySelector(_relationshipRoleSelector);
      
      const childNameText = childNameEl?.textContent || '';
      const roleText = roleEl?.textContent || '';
      
      // Case-insensitive comparison for role
      if (childNameText.includes(childName) && 
          roleText.toLowerCase().includes(role.toLowerCase())) {
        return true;
      }
    }
    return false;
  }, invitationCard, childNameSelector, relationshipRoleSelector, expectedChildName, expectedRole);
});

export const logout = Xdotoolify.setupWithPage(async (page) => {
  
  await page.X
    .checkUntil(XC.visibleElementCount, userMenuButton, 1)
    .run(XC.autoClick, userMenuButton)
    .checkUntil(XC.visibleElementCount, logoutButton, 1)
    .run(XC.autoClick, logoutButton)
    .checkUntil(XC.evaluate, () => {
      return window.location.pathname === '/login' || window.location.pathname === '/';
    }, true)
    .do();
});

export const registerUser = Xdotoolify.setupWithPage(async (page, { name, email, password, type }: RegistrationDetails) => {
  await page.X
    .run(navigateToRegister)
    .run(enterRegistrationDetails, {
      name,
      email,
      password,
      type
    })
    .run(submitRegistration)
    .checkUntil(XC.elementText, userMenuButton, (x: string | null) => 
      x?.toLowerCase() === email.toLowerCase())
    .do();
});

export const loginUser = Xdotoolify.setupWithPage(async (page, email: string, password: string) => {
  await page.X
    .run(navigateToLogin)
    .run(enterLoginCredentials, { email, password })
    .run(submitLogin)
    .do();
});

// Verification functions
export const getUserDisplayName = Xdotoolify.setupWithPage(async (page) => {
  return XC.elementText(page, userDisplayName) as Promise<string | null>;
});

export const getUserType = Xdotoolify.setupWithPage(async (page) => {
  const userTypeAttr = '[data-user-type]';
  return XC.evaluate(page, (_userTypeAttr: string) => {
    // This assumes your app stores the user type somewhere in the window object
    // or that there's an element on the page that contains this information
    return (window as any).__USER_TYPE__ || document.querySelector<HTMLElement>(_userTypeAttr)?.getAttribute('data-user-type');
  }, userTypeAttr) as Promise<string | null>;
});
