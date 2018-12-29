// ==UserScript==
// @name         [51job]前程无忧的工具箱
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  屏蔽关键公司/ 首页刷新个人简历/ 关闭已投递的招聘
// @author       773561801@qq.com
// @match        https://www.51job.com/
// @match        https://jobs.51job.com/*
// @match        https://search.51job.com/*
// @match        https://jobs.51job.com/shanghai-pdxq/*
// @grant        none
// ==/UserScript==

(function () {
  'use strict';
  setTimeout(() => {
    // 屏蔽关键公司
    $(`
      a:contains(深圳市德科信息技术有限公司),
      a:contains(上海惠岚网络科技股份有限公司),
      a:contains(小黑鱼科技有限公司)
      a:contains(赢盘)
      `).each(function (ind, ele) {
      $(this).parents('div.el').remove();
    })
  }, 1000)

  setTimeout(() => {
    // 假设 已投递/已申请 则关闭页面(或设为空白页)
    if ($("a:contains(已申请)").length > 0) {
      window.close();
      location.href = 'about:blank';
    }

    // 刷新个人简历
    setInterval(() => {
      $("span:contains(刷新简历)").click()
    }, 6000)
  }, 2000)
})();
