// ==UserScript==
// @name         [SF]sf.gg的辅助小工具
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://segmentfault.com/*
// @grant        none
// ==/UserScript==

(function () {
  'use strict';
  // 1. 挖坟贴审核后直接过
  // 2. 发新贴审核后直接过
  if (location.href.indexOf('segmentfault.com/review') >= 0) {
    window.timer1 = setInterval(() => {
      if ($('.audit-widget__vote-btn-next--inner').size()) {
        clearInterval(window.timer1);
        $('.audit-widget__vote-btn-next--inner').click();
      }
    }, 60)
  }

  // 假设在挖坟贴审核中 含有 `同问` , `请问` 等文本, 则选择 - 无意义的内容
  if (location.href.indexOf('segmentfault.com/review/digtomb') >= 0) {
    if ($('.audit__content-fmt').size()) {
      setTimeout(() => {
        var filterKeyword = [
          '同问',
          '请问',
          '同求',
          '我也有',
          '我也是',
          '解决了吗',
          '解决了么',
          '怎么解决的',
          '有找到解决办法吗',
          '是否已经解决',
          '什么原因啊'
        ];
        var hasKeyword = filterKeyword.some(function (elem, index) {
          if ($('.audit__content-fmt:contains("' + elem + '")').length) {
            return $('.audit__content-fmt:contains("' + elem + '")').length;
          }
        })
        if (hasKeyword) {
          $('.audit__reasons li').eq(2).click()
        }
      }, 60);
    }
  }

  // markdow 的 代码pre 不限制高度(自适应)
  if ($('.fmt pre').size() > 0) {
    $('.fmt pre').css({
      maxHeight: 'initial'
    })
  }

  // 右侧的文章的目录被广告顶下来了
  if ($('.post-nav.side-outline').size() > 0) {
    $('.post-nav.side-outline').css({
      position: "fixed",
      zIndex: 1,
      top: 80
    })
    $('.post-nav.side-outline .nav-body').css({
      height: 500
    })
  }

  // 返回顶部的 按钮
  if ($('#fixedTools').size() > 0) {
    $('#fixedTools').css({
      top: 120,
      right: 378,
      bottom: 'initial',
      boxShadow: '3px 3px 0 0 #cccccc8c',
      backgroundColor: '#f5deb38a'
    })
  }

  // 缩小 文章/问题 里的图片
  $('.img-wrap').each(function (ind, ele) {
    $(ele).css('width', '30%')
  })
})();
