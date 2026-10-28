/* Contact links. The address is assembled on click so it never appears in
   the page source, which keeps it out of scraped spam lists. Any element with
   data-contact opens a new email to it; data-subject fills in the subject line. data-contact="umich" sends to the Michigan address. */
(function () {
  function address(which) {
    if (which === 'umich') return 'ude.hcimu@rnosnorb'.split('').reverse().join('');
    return 'moc.nosnorbnor@nor'.split('').reverse().join('');
  }
  document.addEventListener('click', function (e) {
    var link = e.target.closest && e.target.closest('[data-contact]');
    if (!link) return;
    e.preventDefault();
    var subj = link.getAttribute('data-subject');
    window.location.href = 'mailto:' + address(link.getAttribute('data-contact')) + (subj ? '?subject=' + encodeURIComponent(subj) : '');
  });
})();

/* Sticky header: tighten it once the page has scrolled. */
(function () {
  var top = document.querySelector('.top');
  if (!top) return;
  function onScroll() { top.classList.toggle('is-stuck', window.scrollY > 24); }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
})();
