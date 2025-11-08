import antfu from '@antfu/eslint-config'

export default antfu({
  nuxt: true,
  rules: {
    'node/prefer-global/process': 'off',
    'no-undef': 'off',
  },
})
