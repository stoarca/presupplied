import React from 'react';

/**
 * Hook to get the current module name from the URL path.
 * Works for any module loaded via /modules/{MODULE_NAME} routes.
 *
 * @returns The module name (e.g., "READ_WORDS_REVIEW_1" from "/modules/READ_WORDS_REVIEW_1")
 */
export function useModuleName(): string {
  return React.useMemo(() => {
    const pathname = window.location.pathname;
    const match = pathname.match(/\/modules\/([^/]+)/);
    return match ? match[1] : '';
  }, []);
}