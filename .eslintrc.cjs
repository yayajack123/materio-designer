module.exports = {
  root: true,
  env: { browser: true, node: true, es2022: true },
  extends: ['plugin:vue/vue3-essential'],
  plugins: ['@typescript-eslint', 'regex'],
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 'latest',
    sourceType: 'module',
    extraFileExtensions: ['.vue'],
  },
  ignorePatterns: ['node_modules/', '.nuxt/', '.output/', 'dist/', '.pnpm-store/', 'plugins/iconify/icons.css'],
  rules: {
    'vue/valid-v-slot': ['error', { allowModifiers: true }],
  },
  overrides: [
    {
      files: ['app.vue', 'error.vue', 'pages/**/*.vue', 'layouts/**/*.vue', '@core/components/I18n.vue', '@core/components/Notifications.vue', '@core/components/Shortcuts.vue'],
      rules: { 'vue/multi-word-component-names': 'off' },
    },
  ],
}
