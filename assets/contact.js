/* Contact links. The address is assembled on click so it never appears in
   the page source, which keeps it out of scraped spam lists. Any element with
   data-contact opens a new email to it. */
(function () {
  function address() {
    return 'moc.nosnorbnor@nor'.split('').reverse().join('');
  }
  document.addEventListener('click', function (e) {
    var link = e.target.closest && e.target.closest('[data-contact]');
    if (!link) return;
    e.preventDefault();
    window.location.href = 'mailto:' + address();
  });
})();
