fis.match('::packager', {
  postpackager: fis.plugin('loader',{
    allInOne:true
  })
});

fis.hook('module', {
    mode: 'commonjs'
});

fis.match('components/**/*.js', {
  isMod: true // 标记匹配文件为组件

})
.match('/js/*.js', {
  isMod: true // 标记匹配文件为组件
})
.match('*.js', {
	optimizer: fis.plugin('uglify-js')
})
.match('*.less', {
    parser: fis.plugin('less'),
    optimizer: fis.plugin('clean-css'),
    rExt: '.css'
 })
.match('*.{css,scss}', {
    optimizer: fis.plugin('clean-css')
 })
.match('*.png', {
    optimizer: fis.plugin('png-compressor')
})

