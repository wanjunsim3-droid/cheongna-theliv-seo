(() => {
  /* ------------------------------------------------------------------------
     1. Shared UI Helpers (Lightbox + Interior Thumbnail Filmstrip + PC Dock)
     ------------------------------------------------------------------------ */
  function initLightbox() {
    let modal = document.querySelector('.lightbox-backdrop');
    if (!modal) {
      modal = document.createElement('div');
      modal.className = 'lightbox-backdrop';
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-modal', 'true');
      modal.setAttribute('aria-label', '이미지 확대 보기');
      modal.innerHTML = `
        <div class="lightbox-toolbar">
          <span class="lightbox-caption"></span>
          <button type="button" class="lightbox-close" aria-label="닫기">✕</button>
        </div>
        <div class="lightbox-stage"><img src="" alt=""></div>
      `;
      document.body.append(modal);
      const closeBtn = modal.querySelector('.lightbox-close');
      closeBtn.addEventListener('click', () => modal.classList.remove('open'));
      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('open');
      });
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('open')) {
          modal.classList.remove('open');
        }
      });
    }

    const stageImg = modal.querySelector('.lightbox-stage img');
    const caption = modal.querySelector('.lightbox-caption');

    document.querySelectorAll('.page-image').forEach((img) => {
      if (img.dataset.lightboxBound) return;
      img.dataset.lightboxBound = 'true';
      img.addEventListener('click', () => {
        stageImg.src = img.currentSrc || img.src;
        stageImg.alt = img.alt || '확대 이미지';
        caption.textContent = img.alt || '청라 더리브 티아모 까사';
        modal.classList.add('open');
      });
    });
  }

  function initGalleryThumbnails(root = document) {
    const galleryImg = root.querySelector('#gallery-image');
    if (!galleryImg) return;
    let strip = root.querySelector('.gallery-thumbs');
    if (!strip) {
      strip = document.createElement('div');
      strip.className = 'gallery-thumbs';
      strip.setAttribute('aria-label', '인테리어 썸네일 목록');
      galleryImg.closest('.gallery')?.append(strip);
    }
    if (strip.children.length === 0) {
      const total = 25;
      for (let idx = 0; idx < total; idx++) {
        const num = String(idx + 1).padStart(2, '0');
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'gallery-thumb';
        btn.dataset.index = String(idx);
        btn.setAttribute('aria-label', `인테리어 이미지 ${idx + 1} 보기`);
        if (idx === 0) btn.setAttribute('aria-current', 'true');
        btn.innerHTML = `<img src="sub/interior${num}.jpg" alt="썸네일 ${idx + 1}" loading="lazy">`;
        strip.append(btn);
      }
    }
  }

  function initPcQuickDock() {
    if (window.matchMedia('(max-width: 800px)').matches) return;
    if (document.querySelector('.pc-quick-dock')) return;
    const dock = document.createElement('aside');
    dock.className = 'pc-quick-dock';
    dock.setAttribute('aria-label', '빠른 메뉴');
    dock.innerHTML = `
      <div class="pc-quick-dock-head">QUICK</div>
      <a href="vr.html">
        <svg viewBox="0 0 24 24"><path d="M3 7h18v10H3z"/><path d="M9 17l3-3 3 3"/></svg>
        <span>E-모델하우스</span>
      </a>
      <a href="unit.html">
        <svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
        <span>평면정보</span>
      </a>
      <a href="premium.html">
        <svg viewBox="0 0 24 24"><polygon points="12 2 15 9 22 9 16.5 14 18.5 21 12 17 5.5 21 7.5 14 2 9 9 9"/></svg>
        <span>프리미엄8</span>
      </a>
      <a href="guest.html">
        <svg viewBox="0 0 24 24"><path d="M4 5.5h16v11H11l-4.5 3v-3H4z"/><path d="M8 9.5h8M8 13h5"/></svg>
        <span>관심고객등록</span>
      </a>
      <button type="button" class="dock-top" aria-label="맨 위로">▲ TOP</button>
    `;
    document.body.append(dock);
    dock.querySelector('.dock-top').addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  initLightbox();
  initGalleryThumbnails(document);
  initPcQuickDock();

  /* ------------------------------------------------------------------------
     2. Mobile One-Page Stream Engine (<= 800px)
     ------------------------------------------------------------------------ */
  const mobile = matchMedia('(max-width:800px)');
  mobile.addEventListener('change', () => location.reload());
  if (!mobile.matches) return;

  const keys = [
    ['planning', 'location'],
    ['complex', 'dh', 'system', 'community'],
    ['vr', 'unit', 'interior', 'video'],
    ['gg', 'gy', 'ij'],
    ['premium', 'dada'],
    ['guest']
  ];
  const labels = ['사업안내', '단지안내', '세대안내', '분양안내', '프리미엄', '관심고객등록'];
  const subLabels = {
    planning: '사업개요',
    location: '입지환경',
    complex: '단지설계',
    dh: '배치도',
    system: '특화시스템',
    community: '커뮤니티',
    vr: 'E-모델하우스',
    unit: '평면정보',
    interior: '인테리어',
    video: '세대영상',
    gg: '공급안내',
    gy: '계약안내',
    ij: '인지세안내',
    premium: '프리미엄8',
    dada: 'Dada',
    guest: '관심고객등록'
  };
  const allSubKeys = keys.flat();
  const initial = location.pathname.split('/').pop().replace(/\.html$/, '');

  fetch('mobile-stream.html')
    .then((r) => {
      if (!r.ok) throw Error('콘텐츠를 불러오지 못했습니다.');
      return r.text();
    })
    .then((html) => {
      const main = document.querySelector('main');
      main.innerHTML = `<div class="mobile-stream">${html}</div>`;
      document.querySelector('.subfooter')?.remove();

      const header = document.querySelector('.header');

      // Primary Category Bar
      const bar = document.createElement('nav');
      bar.className = 'mobile-categories';
      bar.setAttribute('aria-label', '대메뉴');
      bar.innerHTML = labels.map((x, i) => `<button type="button" data-group="${i}">${x}</button>`).join('');
      header.after(bar);

      // Secondary Sub-Section Chips Bar
      const subBar = document.createElement('nav');
      subBar.className = 'mobile-subchips';
      subBar.setAttribute('aria-label', '세부 섹션 메뉴');
      subBar.innerHTML = allSubKeys
        .map((k) => `<button type="button" data-subkey="${k}">${subLabels[k]}</button>`)
        .join('');
      bar.after(subBar);

      const buttons = [...bar.querySelectorAll('button')];
      const subButtons = [...subBar.querySelectorAll('button')];
      const sections = [...main.querySelectorAll('.mobile-section')];
      let activeGroup = -1;
      let activeKey = '';

      function highlight(groupIdx, sectionKey) {
        if (groupIdx !== activeGroup) {
          activeGroup = groupIdx;
          buttons.forEach((b, j) =>
            j === groupIdx ? b.setAttribute('aria-current', 'true') : b.removeAttribute('aria-current')
          );
          document.querySelectorAll('.nav-trigger').forEach((b, j) =>
            b.classList.toggle('mobile-active', j === groupIdx)
          );
          if (groupIdx >= 0) {
            const b = buttons[groupIdx];
            bar.scrollTo({
              left: b.offsetLeft - (bar.clientWidth - b.offsetWidth) / 2,
              behavior: 'smooth'
            });
          }
        }
        if (sectionKey && sectionKey !== activeKey) {
          activeKey = sectionKey;
          subButtons.forEach((b) => {
            if (b.dataset.subkey === sectionKey) {
              b.setAttribute('aria-current', 'true');
              subBar.scrollTo({
                left: b.offsetLeft - (subBar.clientWidth - b.offsetWidth) / 2,
                behavior: 'smooth'
              });
            } else {
              b.removeAttribute('aria-current');
            }
          });
        }
      }

      function go(key) {
        const target = document.getElementById('mobile-' + key);
        if (!target) return;
        const top = window.scrollY + target.getBoundingClientRect().top - 148;
        window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
        history.replaceState(null, '', '#' + key);
        const nav = document.querySelector('.nav');
        const toggle = document.querySelector('.mobile-toggle');
        nav.classList.remove('visible');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', '메뉴 열기');
      }

      // Bind Hero CTA buttons
      main.querySelectorAll('[data-jump]').forEach((btn) => {
        btn.addEventListener('click', () => go(btn.dataset.jump));
      });

      // Floating Top button
      const quick = document.createElement('aside');
      quick.className = 'mobile-quick';
      quick.setAttribute('aria-label', '빠른 이동');
      quick.innerHTML = `<button type="button" data-action="top" aria-label="맨 위로">TOP</button>`;
      document.body.append(quick);
      quick.querySelector('[data-action="top"]').addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        history.replaceState(null, '', location.pathname + location.search);
      });

      // Fixed Bottom Conversion CTA Bar
      const bottomCta = document.createElement('aside');
      bottomCta.className = 'mobile-bottom-cta';
      bottomCta.setAttribute('aria-label', '상담 바로가기');
      bottomCta.innerHTML = `
        <a href="tel:16665984" class="cta-call">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 3.6 9 3l2 4.4-2 1.6a14.7 14.7 0 0 0 6 6l1.6-2 4.4 2-.6 2.4a2.5 2.5 0 0 1-2.7 1.9C10.6 18.5 5.5 13.4 4.7 6.3a2.5 2.5 0 0 1 1.9-2.7Z"/></svg>
          <span>전화상담 1666-5984</span>
        </a>
        <button type="button" class="cta-consult" data-action="consult">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5h16v11H11l-4.5 3v-3H4z"/><path d="M8 9.5h8M8 13h5"/></svg>
          <span>관심고객 · 방문예약</span>
        </button>
      `;
      document.body.append(bottomCta);
      bottomCta.querySelector('[data-action="consult"]').addEventListener('click', () => go('guest'));

      buttons.forEach((b, i) => b.addEventListener('click', () => go(keys[i][0])));
      subButtons.forEach((b) => b.addEventListener('click', () => go(b.dataset.subkey)));

      document.querySelectorAll('.nav .submenu a').forEach((a) =>
        a.addEventListener('click', (e) => {
          const key = (a.getAttribute('href') || '').replace(/\.html$/, '');
          if (keys.some((group) => group.includes(key))) {
            e.preventDefault();
            go(key);
          }
        })
      );

      let scheduled = false;
      function update() {
        scheduled = false;
        let grp = -1;
        let curKey = '';
        for (const section of sections) {
          if (section.getBoundingClientRect().top <= 185) {
            grp = Number(section.dataset.category);
            curKey = section.dataset.key || section.id.replace(/^mobile-/, '');
          } else break;
        }
        highlight(grp, curKey);
      }
      addEventListener(
        'scroll',
        () => {
          if (!scheduled) {
            scheduled = true;
            requestAnimationFrame(update);
          }
        },
        { passive: true }
      );

      sections.forEach((section) => {
        const tabs = [...section.querySelectorAll('[data-tab]')];
        const panels = [...section.querySelectorAll('.tab-panel')];
        tabs.forEach((button) =>
          button.addEventListener('click', () => {
            const n = Number(button.dataset.tab);
            tabs.forEach((x) => x.setAttribute('aria-selected', String(x === button)));
            panels.forEach((p, i) => {
              p.hidden = i !== n;
              if (p.hidden) p.querySelector('video')?.pause();
            });
          })
        );

        const gallery = section.querySelector('#gallery-image');
        if (gallery) {
          initGalleryThumbnails(section);
          const thumbs = [...section.querySelectorAll('.gallery-thumb')];
          let i = 0;
          function show(idx) {
            i = (idx + 25) % 25;
            gallery.src = 'sub/interior' + String(i + 1).padStart(2, '0') + '.jpg';
            gallery.alt = '인테리어 이미지 ' + (i + 1);
            section.querySelector('#gallery-count').textContent = i + 1 + ' / 25';
            thumbs.forEach((t, tIdx) => {
              if (tIdx === i) {
                t.setAttribute('aria-current', 'true');
                t.parentElement?.scrollTo({
                  left: t.offsetLeft - (t.parentElement.clientWidth - t.offsetWidth) / 2,
                  behavior: 'smooth'
                });
              } else {
                t.removeAttribute('aria-current');
              }
            });
          }
          section.querySelector('#gallery-prev').onclick = () => show(i - 1);
          section.querySelector('#gallery-next').onclick = () => show(i + 1);
          thumbs.forEach((t) =>
            t.addEventListener('click', () => show(Number(t.dataset.index)))
          );
        }

        const form = section.querySelector('#interest-form');
        if (form)
          form.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!form.reportValidity()) return;
            const data = new FormData(form);
            if (data.get('_honey')) return;
            const payload = Object.fromEntries(data);
            delete payload._honey;
            payload._subject = '청라 더리브 관심고객 상담 신청';
            payload._template = 'table';
            const status = section.querySelector('#form-status');
            const button = form.querySelector('.send');
            button.disabled = true;
            status.textContent = '신청 내용을 전송하고 있습니다.';
            try {
              const r = await fetch('https://formsubmit.co/ajax/edusim71@gmail.com', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify(payload)
              });
              const result = await r.json();
              if (!r.ok || !(result.success === true || result.success === 'true')) throw Error();
              status.textContent = '신청이 접수되었습니다. 담당자의 연락을 기다려 주세요.';
              form.reset();
            } catch {
              status.textContent = '전송을 확인하지 못했습니다. 전화 1666-5984로 접수 여부를 확인해 주세요.';
            } finally {
              button.disabled = false;
            }
          });
      });

      initLightbox();

      const target = (location.hash || '').slice(1) || initial;
      if (keys.some((group) => group.includes(target))) {
        requestAnimationFrame(() => {
          const el = document.getElementById('mobile-' + target);
          if (el)
            window.scrollTo({
              top: Math.max(0, window.scrollY + el.getBoundingClientRect().top - 148),
              behavior: 'instant'
            });
          update();
        });
      } else update();
    })
    .catch(() => {
      /* 기존 페이지를 유지합니다. */
    });
})();
