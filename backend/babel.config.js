module.exports = {
  'presets': [
    [
      '@babel/preset-env',
      {
        'targets': {
          'node': 'current'
        }
      }
    ],
    '@babel/preset-typescript'
  ],
  'plugins': [
    ['module-resolver', {
      'root': ['./src']
    }]
  ],
  ignore: [
    '**/*.spec.ts'
  ]
}
