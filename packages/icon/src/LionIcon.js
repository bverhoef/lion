import { html, css } from '@lion/core';
import { LionLitElement } from '@lion/core/src/LionLitElement.js';

const isDefinedPromise = action => typeof action === 'object' && Promise.resolve(action) === action;

/**
 * Custom element for rendering SVG icons
 * @polymerElement
 */
export class LionIcon extends LionLitElement {
  static get properties() {
    return {
      svg: {
        type: String,
      },
      role: {
        type: String,
        attribute: 'role',
        reflect: true,
      },
      ariaLabel: {
        type: String,
        attribute: 'aria-label',
        reflect: true,
      },
    };
  }

  static get styles() {
    return [
      css`
        :host {
          box-sizing: border-box;
          display: inline-block;
          width: 1em;
          height: 1em;
        }

        :host:first-child {
          margin-left: 0;
        }

        :host:last-child {
          margin-right: 0;
        }

        ::slotted(svg) {
          display: block;
          width: 100%;
          height: 100%;
        }
      `,
    ];
  }

  constructor() {
    super();
    this.role = 'img';
  }

  update(changedProperties) {
    super.update(changedProperties);
    if (changedProperties.has('svg')) {
      if (isDefinedPromise(this.svg)) {
        this._setDynamicSvg();
      } else {
        this._setSvg();
      }
    }
    if (changedProperties.has('ariaLabel')) {
      this._onLabelChanged(changedProperties);
    }
  }

  render() {
    return html`
      <slot></slot>
    `;
  }

  connectedCallback() {
    // ensures that aria-hidden is set if there is no aria-label attribute
    this._onLabelChanged();
    super.connectedCallback();
  }

  /**
   * On IE11, svgs without focusable false appear in the tab order
   * so make sure to have <svg focusable="false"> in svg files
   */
  _setSvg() {
    if (this.svg) {
      this.innerHTML = this.svg;
    }
  }

  _setDynamicSvg() {
    this.innerHTML = '';
    this.svg.then(_svg => {
      if (_svg) {
        if (typeof _svg !== 'string') {
          this.innerHTML = _svg.default;
        }
        this.innerHTML = _svg;
      }
    }
  }

  _onLabelChanged() {
    if (this.ariaLabel) {
      this.setAttribute('aria-hidden', 'false');
    } else {
      this.setAttribute('aria-hidden', 'true');
      this.removeAttribute('aria-label');
    }
  }
}
