module.exports = {
  "presets": [
    ["@vue/app",{ useBuiltIns: "entry" }],
    ['@babel/preset-env', {
      // modules: 'commonjs',
      targets: {
        browsers: '>0.25% and last 2 versions and not ie 11 and not OperaMini all',
        node: '10'
      }
    }],
    '@babel/preset-typescript'
  ],
  "plugins": [
    [
      "component",
      {
        "libraryName": "element-ui",
        "styleLibraryName": "theme-chalk"
      }
    ],
    
  ]
}