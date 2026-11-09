// 心理冲突研究实验室 — 交互脚本

// 移动端导航菜单切换
document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.nav-toggle');
  var menu = document.querySelector('.nav-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      menu.classList.toggle('open');
    });
    // 点击菜单项后关闭
    menu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        menu.classList.remove('open');
      });
    });
  }

  // 数字滚动动画（首页统计）
  var stats = document.querySelectorAll('.stat-num[data-count]');
  if (stats.length && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    stats.forEach(function (s) { observer.observe(s); });
  }
});

function animateCount(el) {
  var target = parseInt(el.getAttribute('data-count'), 10);
  var suffix = el.getAttribute('data-suffix') || '';
  var current = 0;
  var step = Math.max(1, Math.ceil(target / 40));
  var timer = setInterval(function () {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = current + suffix;
  }, 30);
}

/* ---------- 全站来访人数统计 ----------
   本站是纯静态页面（GitHub Pages，无后端 / 无数据库），因此采用站点级
   共享计数服务：site_uv = 全站累计访客数，site_pv = 全站累计浏览量。
   所有访客看到同一个数字。服务不可达时自动隐藏，不影响页面其余部分。
   逻辑集中在此文件，16 个中英文页面共用，无需逐页修改 HTML。 */
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var footer = document.querySelector('.footer-bottom');
    if (!footer || document.querySelector('.visit-counter')) return;

    var isEn = document.documentElement.lang === 'en';
    var icon = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
      '<path d="M12 4.5C7 4.5 2.7 7.6 1 12c1.7 4.4 6 7.5 11 7.5s9.3-3.1 11-7.5' +
      'c-1.7-4.4-6-7.5-11-7.5zm0 12.3a4.8 4.8 0 1 1 0-9.6 4.8 4.8 0 0 1 0 9.6z' +
      'm0-7.7a2.9 2.9 0 1 0 0 5.8 2.9 2.9 0 0 0 0-5.8z"/></svg>';

    var box = document.createElement('div');
    box.className = 'visit-counter';
    box.innerHTML = icon +
      '<span id="busuanzi_container_site_uv">' +
        (isEn
          ? 'Visitors <span id="busuanzi_value_site_uv" class="visit-num">…</span>'
          : '来访人数 <span id="busuanzi_value_site_uv" class="visit-num">…</span> 人') +
      '</span>' +
      '<span class="visit-sep">·</span>' +
      '<span id="busuanzi_container_site_pv">' +
        (isEn
          ? 'Page views <span id="busuanzi_value_site_pv" class="visit-num">…</span>'
          : '总浏览 <span id="busuanzi_value_site_pv" class="visit-num">…</span> 次') +
      '</span>';
    footer.appendChild(box);

    var timer;
    var uv = box.querySelector('#busuanzi_value_site_uv');
    var ready = false;
    function settle() {
      if (!ready && /^[\d,]+$/.test((uv.textContent || '').trim())) {
        ready = true;
        clearTimeout(timer);
        // 若因服务响应慢而已被暂时隐藏，数字到达后自动恢复显示
        box.classList.remove('is-hidden');
      }
    }
    if (window.MutationObserver) {
      new MutationObserver(settle).observe(uv, {
        childList: true, characterData: true, subtree: true
      });
    }
    timer = setTimeout(function () {
      settle();
      if (!ready) box.classList.add('is-hidden');
    }, 10000);

    var script = document.createElement('script');
    script.src = 'https://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js';
    script.async = true;
    script.onerror = function () {
      clearTimeout(timer);
      box.classList.add('is-hidden');
    };
    document.head.appendChild(script);
  });
})();
