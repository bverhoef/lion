import { render, html } from '@lion/core';
import { containFocus } from './utils/contain-focus.js';
import { keyCodes } from './utils/key-codes.js';

export class LocalOverlayController {
  constructor(params = {}) {
    const defaultOptions = {
      placement: 'top',
      position: 'absolute',
      modifiers: {
        keepTogether: {
          enabled: false,
        },
        preventOverflow: {
          enabled: true,
          boundariesElement: 'viewport',
          padding: 16, // viewport-margin for shifting/sliding
        },
        flip: {
          boundariesElement: 'viewport',
          padding: 16, // viewport-margin for flipping
        },
        offset: {
          enabled: true,
          offset: `0, 8px`, // horizontal and vertical margin (distance between popper and referenceElement)
        },
        arrow: {
          enabled: false,
        },
      },
    };

    const finalPlacement = {
      ...defaultOptions,
      ...params.placementConfig,
    };

    let finalModifiers = defaultOptions.modifiers;
    if (params.placementConfig) {
      finalModifiers = {
        ...finalModifiers,
        ...params.placementConfig.modifiers,
      };
    }

    this.placementConfig = {
      placement: finalPlacement.placement,
      position: finalPlacement.position,
      modifiers: finalModifiers,
    };

    this.__preloadPopper();

    this.hidesOnEsc = params.hidesOnEsc;
    this.hidesOnOutsideClick = params.hidesOnOutsideClick;
    this.trapsKeyboardFocus = params.trapsKeyboardFocus;

    /**
     * A wrapper to render into the invokerTemplate
     *
     * @property {HTMLElement}
     */
    this.invoker = document.createElement('div');
    this.invoker.style.display = 'inline-block';
    this.invokerTemplate = params.invokerTemplate;

    /**
     * The actual invoker element we work with - it get's all the events and a11y
     *
     * @property {HTMLElement}
     */
    this.invokerNode = this.invoker;
    if (params.invokerNode) {
      this.invokerNode = params.invokerNode;
      this.invoker = this.invokerNode;
    }

    /**
     * A wrapper the contentTemplate renders into
     *
     * @property {HTMLElement}
     */
    this.content = document.createElement('div');
    this.content.style.display = 'inline-block';
    this.contentTemplate = params.contentTemplate;
    this.contentNode = this.content;
    if (params.contentNode) {
      this.contentNode = params.contentNode;
      this.content = this.contentNode;
    }

    this.contentId = `overlay-content-${Math.random()
      .toString(36)
      .substr(2, 10)}`;
    this._contentData = {};
    this.syncInvoker();
    this._updateContent();
    this._prevShown = false;
    this._prevData = {};
    this.__boundEscKeyHandler = this.__escKeyHandler.bind(this);
  }

  get isShown() {
    return this.contentTemplate
      ? Boolean(this.content.children.length)
      : Boolean(this.contentNode.style.display === 'inline-block');
  }

  /**
   * Syncs shown state and data for content.
   * @param {object} options
   * @param {boolean} [options.isShown] whether the overlay should be shown
   * @param {object} [options.data] overlay data to pass to the content template function
   */
  async sync({ isShown, data } = {}) {
    await this._createOrUpdateOverlay(isShown, data);
  }

  /**
   * Syncs data for invoker.
   * @param {object} options
   * @param {object} [options.data] overlay data to pass to the invoker template function
   */
  syncInvoker({ data } = {}) {
    if (this.invokerTemplate) {
      render(this.invokerTemplate(data), this.invoker);
      this.invokerNode = this.invoker.firstElementChild;
    }

    this.invokerNode.setAttribute('aria-expanded', this.isShown);
    this.invokerNode.setAttribute('aria-controls', this.contentId);
    this.invokerNode.setAttribute('aria-describedby', this.contentId);
  }

  /**
   * Shows the overlay.
   */
  async show() {
    await this._createOrUpdateOverlay(true, this._prevData);
  }

  /**
   * Hides the overlay.
   */
  hide() {
    this._createOrUpdateOverlay(false, this._prevData);
  }

  /**
   * Toggles the overlay.
   */
  toggle() {
    // eslint-disable-next-line no-unused-expressions
    this.isShown ? this.hide() : this.show();
  }

  // Popper does not export a nice method to update an existing instance with a new config. Therefore we recreate the instance.
  // TODO: Send a merge request to Popper to abstract their logic in the constructor to an exposed method which takes in the user config.
  updatePopperConfig(config = this.placementConfig) {
    if (this.popper) {
      this.popper.destroy();
      this.popper = null;
    }
    this.placementConfig = {
      ...this.placementConfig,
      ...config,
    };
    this.__createPopperInstance();
  }

  async _createOrUpdateOverlay(shown = this._prevShown, data = this._prevData) {
    if (shown) {
      this._contentData = { ...this._contentData, ...data };

      // let lit-html manage the template and update the properties
      if (this.contentTemplate) {
        render(this.contentTemplate(this._contentData), this.content);
        this.contentNode = this.content.firstElementChild;
      }
      this.contentNode.id = this.contentId;
      this.contentNode.style.display = 'inline-block';
      this.invokerNode.setAttribute('aria-expanded', true);

      if (!this.popper) {
        // Safeguard, in case module hasn't finished loading from constructor
        if (!this.popperModule) {
          await this.__preloadPopper();
        }
        this.__createPopperInstance();
      }

      if (this.trapsKeyboardFocus) this._setupTrapsKeyboardFocus();
      if (this.hidesOnOutsideClick) this._setupHidesOnOutsideClick();
      if (this.hidesOnEsc) this._setupHidesOnEsc();
    } else {
      this._updateContent();
      this.invokerNode.setAttribute('aria-expanded', false);
      if (this.popper) {
        this.popper.destroy();
        this.popper = null;
      }
      if (this.hidesOnOutsideClick) this._teardownHidesOnOutsideClick();
      if (this.hidesOnEsc) this._teardownHidesOnEsc();
    }
    this._prevShown = shown;
    this._prevData = data;
  }

  /**
   * Sets up focus containment on the given overlay. If there was focus containment set up
   * previously, it is disconnected.
   */
  _setupTrapsKeyboardFocus() {
    if (this._containFocusHandler) {
      this._containFocusHandler.disconnect();
      this._containFocusHandler = undefined; // eslint-disable-line no-param-reassign
    }
    this._containFocusHandler = containFocus(this.contentNode);
  }

  _setupHidesOnEsc() {
    this.contentNode.addEventListener('keyup', this.__boundEscKeyHandler);
  }

  _teardownHidesOnEsc() {
    this.contentNode.removeEventListener('keyup', this.__boundEscKeyHandler);
  }

  _setupHidesOnOutsideClick() {
    if (this.__preventCloseOutsideClick) {
      return;
    }

    let wasClickInside = false;

    // handle on capture phase and remember till the next task that there was an inside click
    this.__preventCloseOutsideClick = () => {
      wasClickInside = true;
      setTimeout(() => {
        wasClickInside = false;
      });
    };

    // handle on capture phase and schedule the hide if needed
    this.__onCaptureHtmlClick = () => {
      setTimeout(() => {
        if (!wasClickInside) {
          this.hide();
        }
      });
    };

    this.contentNode.addEventListener('click', this.__preventCloseOutsideClick, true);
    this.invokerNode.addEventListener('click', this.__preventCloseOutsideClick, true);
    document.documentElement.addEventListener('click', this.__onCaptureHtmlClick, true);
  }

  _teardownHidesOnOutsideClick() {
    this.contentNode.removeEventListener('click', this.__preventCloseOutsideClick, true);
    this.invokerNode.removeEventListener('click', this.__preventCloseOutsideClick, true);
    document.documentElement.removeEventListener('click', this.__onCaptureHtmlClick, true);
    this.__preventCloseOutsideClick = null;
    this.__onCaptureHtmlClick = null;
  }

  _updateContent() {
    if (this.contentTemplate) {
      render(html``, this.content);
    } else {
      this.contentNode.style.display = 'none';
    }
  }

  __escKeyHandler(e) {
    if (e.keyCode === keyCodes.escape) {
      this.hide();
    }
  }

  __createPopperInstance() {
    const Popper = this.popperModule.default;
    this.popper = new Popper(this.invokerNode, this.contentNode, {
      ...this.placementConfig,
    });
  }

  async __preloadPopper() {
    this.popperModule = await import('popper.js/dist/popper.min.js');
  }
}
