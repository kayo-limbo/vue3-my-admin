import pluginVue from 'eslint-plugin-vue'
import tseslint from 'typescript-eslint'
import prettierConfig from 'eslint-config-prettier'
import prettierPlugin from 'eslint-plugin-prettier'

export default [
  // 1. 基础 JS/TS 规则
  ...tseslint.configs.recommended,
  // 2. Vue 规则
  ...pluginVue.configs['flat/essential'],
  {
    // 3. 针对 .vue 文件的特殊处理
    files: ['*.vue', '**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser, // 在 Vue 中解析 TS
      },
    },
  },
  // 4. 整合 Prettier (必须放在最后)
  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      'prettier/prettier': 'error',
      'vue/multi-word-component-names': 'off', // 关闭组件名必须双单词的限制（看个人喜好）
    },
  },
  prettierConfig,
]
