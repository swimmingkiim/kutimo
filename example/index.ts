import {html} from 'wcs-html';


const wcsHtmlFragment = html`
  <div>Hello ${Math.random().toString()}</div>`;
document.body.appendChild(wcsHtmlFragment.fragment);
