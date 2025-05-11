import Xdotoolify, { XWebDriver } from 'xdotoolify';
import { WebDriver } from 'selenium-webdriver';
import * as XC from 'xdotoolify/dist/common';
import { UserType } from '/presupplied/images/psapp/common/types';
import { typedFetch } from '/presupplied/images/psapp/client/src/typedFetch';

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

interface ChildDetails {
  name: string;
  pinRequired?: boolean;
  pin?: string;
}

// Selectors
const registerLink = 'a[href="/register"]';
const loginLink = 'a[href="/login"]';
const nameInput = 'input[name="name"]';
const emailInput = 'input[name="email"]';
const passwordInput = 'input[name="password"]';
const userTypeRadioGroup = 'input[name="user-type"]';
const submitButton = 'button[type="submit"]';
const addChildButton = '[data-test="add-child-button"]';
const accountSwitcher = 'div[data-test="account-switcher"]';
const errorMessage = '.MuiFormHelperText-root.Mui-error';

export const getUserInfo = Xdotoolify.setupWithoutPage(async (email: string) => {
  return await typedFetch({
    host: 'https://applocal.presupplied.com',
    endpoint: '/api/test/get-user-info',
    method: 'post',
    body: { email },
  });
});

export const deleteTestAccounts = Xdotoolify.setupWithoutPage(async () => {
  return await typedFetch({
    host: 'https://applocal.presupplied.com',
    endpoint: '/api/test/delete-test-accounts',
    method: 'post',
    body: {},
  });
});

export const getCurrentUserName = Xdotoolify.setupWithPage(async (page) => {
  return await XC.evaluate(page, () => {
    const nameElement = document.querySelector('[data-test="user-display-name"]');
    return nameElement ? nameElement.textContent : null;
  });
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
  let typeSelector = `input[name="user-type"][value="${type}"]`;
  let asdf = Xdotoolify.setupWithPage((page, x) => console.log(x));
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
      .checkUntil(XC.visibleElementCount, 'button[data-test="user-display-email"]', 1)
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
  const userMenuButton = 'button[data-test="user-display-email"]';
  await page.X
    .checkUntil(XC.visibleElementCount, userMenuButton, 1)
    .run(XC.autoClick, userMenuButton)
    .checkUntil(XC.visibleElementCount, addChildButton, 1)
    .run(XC.autoClick, addChildButton)
    .checkUntil(XC.visibleElementCount, 'input[data-test="child-name-input"]', 1)
    .do();
});

export const enterChildDetails = Xdotoolify.setupWithPage(async (page, { name, pinRequired = false, pin = "" }: ChildDetails) => {
  const childNameInput = 'input[data-test="child-name-input"]';
  const pinRequiredCheckbox = 'input[data-test="pin-required-checkbox"]';
  const pinInput = 'input[data-test="pin-input"]';

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
  const avatarSelector = `[data-test="avatar-option-${avatarId}"]`;
  const selectedAvatarSelector = `${avatarSelector} .avatar-selected`;

  await page.X
    .checkUntil(XC.visibleElementCount, avatarSelector, 1)
    .run(XC.autoClick, avatarSelector)
    .checkUntil(XC.visibleElementCount, selectedAvatarSelector, 1)
    .do();
});

export const submitChildCreation = Xdotoolify.setupWithPage(async (page) => {
  const createButton = 'button[data-test="create-child-button"]';

  await page.X
    .checkUntil(XC.visibleElementCount, createButton, 1)
    .run(XC.autoClick, createButton)
    .checkUntil(XC.visibleElementCount, 'div[data-test="child-creator"]', 0)
    .do();
});

// Account switching
export const openAccountSwitcher = Xdotoolify.setupWithPage(async (page, isChild = false) => {
  if (isChild) {
    const userAvatar = '[data-test="user-avatar"]';
    await page.X
      .checkUntil(XC.visibleElementCount, userAvatar, 1)
      .run(XC.autoClick, userAvatar)
      .checkUntil(
        XC.visibleElementCount, '[data-test^="account-avatar-"]', (x) => x >= 1
      )
      .do();
  } else {
    const userMenuButton = 'button[data-test="user-display-email"]';
    const childModeButton = '[data-test="child-mode-button"]';
    
    await page.X
      .checkUntil(XC.visibleElementCount, userMenuButton, 1)
      .run(XC.autoClick, userMenuButton)
      .checkUntil(XC.visibleElementCount, childModeButton, 1)
      .run(XC.autoClick, childModeButton)
      .checkUntil(
        XC.visibleElementCount, '[data-test^="account-avatar-"]', (x) => x >= 1
      )
      .do();
  }
});


export const selectAccount = Xdotoolify.setupWithPage(async (page, accountId: number, pin?: string) => {
  const accountSelector = `[data-test="account-avatar-${accountId}"]`;
  const accountSwitcherDialog = `#account-switcher-dialog-title`;

  let chain = page.X
    .checkUntil(XC.visibleElementCount, accountSelector, 1)
    .run(XC.autoClick, accountSelector);

  if (pin) {
    chain = chain
      .checkUntil(XC.visibleElementCount, '[data-test="pin-dialog"]', 1)
      .run(enterPIN, pin);
  }

  chain = chain.checkUntil(XC.visibleElementCount, accountSwitcherDialog, 0);

  await chain.do();
});

export const enterPIN = Xdotoolify.setupWithPage(async (page, pin: string) => {
  const pinInput = '#pin';
  let displayedPin = '';
  
  for (const digit of pin) {
    const digitButton = `button[data-test="pin-digit-${digit}"]`;
    displayedPin += digit;
    
    await page.X
      .checkUntil(XC.visibleElementCount, digitButton, 1)
      .run(XC.autoClick, digitButton)
      .checkUntil(XC.evaluate, () => {
        const input = document.querySelector('#pin') as HTMLInputElement;
        return input ? input.value.length : 0;
      }, displayedPin.length)
      .do();
  }

  const submitPinButton = 'button[data-test="pin-submit"]';
  await page.X
    .checkUntil(XC.visibleElementCount, submitPinButton, 1)
    .run(XC.autoClick, submitPinButton)
    .checkUntil(XC.visibleElementCount, '[data-test="pin-dialog"]', 0)
    .do();
});

// Error handling
export const getErrorMessage = Xdotoolify.setupWithPage(async (page) => {
  return XC.elementText(page, errorMessage) as Promise<string | null>;
});

// Verification functions
export const getUserDisplayName = Xdotoolify.setupWithPage(async (page) => {
  return XC.elementText(page, 'div[data-test="user-display-name"]') as Promise<string | null>;
});

export const getUserType = Xdotoolify.setupWithPage(async (page) => {
  return XC.evaluate(page, () => {
    // This assumes your app stores the user type somewhere in the window object
    // or that there's an element on the page that contains this information
    return (window as any).__USER_TYPE__ || document.querySelector<HTMLElement>('[data-user-type]')?.getAttribute('data-user-type');
  }) as Promise<string | null>;
});
