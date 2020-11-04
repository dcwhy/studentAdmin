let styleVariables = require('/style/scss/variables')

// 其他配置

{
  test: /\.scss$/,
  use: [
    'css-loader',
    'postcss-loader',
    {
      loader: 'sass-loader',
      options: {
        data: Object.keys(styleVariables)
          .map(k => `\$${k}: ${styleVariables[k]};`)
          .join('\n')
      }
    }
  ]
}