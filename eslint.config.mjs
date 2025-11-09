// eslint.config.mjs
import antfu from '@antfu/eslint-config'

export default antfu({
  rules: {
    'node/prefer-global/process': 'off',
    'no-undef': 'off',
    'style/semi': 'off',
    'style/quotes': 'off',
    'style/brace-style': 'off',
    'vue/singleline-html-element-content-newline': 'off',
    'style/comma-dangle': 'off',
    'vue/html-self-closing': 'off',
    'style/member-delimiter-style': 'off',
    'perfectionist/sort-imports': 'off',
  },
})
