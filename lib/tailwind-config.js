const path = require('node:path')

/**
 * Tailwind CSS config helper for notionuxt
 * Automatically adds notionuxt component files to Tailwind's content scanning
 *
 * Usage in tailwind.config.js:
 *
 * const { withNotionUxt } = require('notionuxt/lib/tailwind-config')
 *
 * export default withNotionUxt({
 *   content: [
 *     // your existing content paths
 *   ],
 *   // ... rest of your config
 * })
 */
function withNotionUxt(config = {}) {
  let notionuxtContentPath

  try {
    const notionuxtPath = require.resolve('notionuxt/package.json')
    const notionuxtDir = path.dirname(notionuxtPath)
    notionuxtContentPath = path.join(notionuxtDir, 'lib', '**', '*.{vue,ts,js}')
  }
  catch {
    // Fallback if package is not found
    notionuxtContentPath = './node_modules/notionuxt/lib/**/*.{vue,ts,js}'
  }

  return {
    ...config,
    content: [
      ...(config.content || []),
      notionuxtContentPath,
    ],
  }
}

module.exports = { withNotionUxt }
