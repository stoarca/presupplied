npx jscodeshift -t ./export_words_from_READ_WORDS_modules.ts ../../images/psapp/client/src/modules/READ_WORDS_*/index.tsx --ignore-pattern="**/READ_WORDS_REVIEW*" "$@"
