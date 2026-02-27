/**
 * Show the tooltip near the cursor.
 * @param {MouseEvent} ev
 * @param {HTMLElement} canvasEl  - the x-ref="canvas" element
 * @param {HTMLElement} tipEl     - the x-ref="tooltip" element
 * @param {string}      label
 * @param {string}      value
 * @param {string}      [extra]
 */
export function showTip(ev, canvasEl, tipEl, label, value, extra = '') {
    if (!canvasEl || !tipEl) return;
    const r = canvasEl.getBoundingClientRect();
    tipEl.innerHTML =
        `<strong>${label}</strong><span>${value}</span>` +
        (extra ? `<small>${extra}</small>` : '');
    tipEl.style.left    = (ev.clientX - r.left + 14) + 'px';
    tipEl.style.top     = (ev.clientY - r.top  - 14) + 'px';
    tipEl.style.opacity = '1';
}

/**
 * Move the tooltip to follow the cursor.
 * @param {MouseEvent} ev
 * @param {HTMLElement} canvasEl
 * @param {HTMLElement} tipEl
 */
export function moveTip(ev, canvasEl, tipEl) {
    if (!canvasEl || !tipEl) return;
    const r = canvasEl.getBoundingClientRect();
    tipEl.style.left = (ev.clientX - r.left + 14) + 'px';
    tipEl.style.top  = (ev.clientY - r.top  - 14) + 'px';
}

/**
 * Hide the tooltip.
 * @param {HTMLElement} tipEl
 */
export function hideTip(tipEl) {
    if (tipEl) tipEl.style.opacity = '0';
}
