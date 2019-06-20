import { UpdatingElement } from '@lion/core';
import { overlays, LocalOverlayController } from '@lion/overlays';

export class LionPopup extends UpdatingElement {
  static get properties() {
    return {
      _placementConfig: {
        type: Object,
      },
    };
  }

  get placementConfig() {
    return this._placementConfig;
  }

  set placementConfig(config) {
    this._placementConfig = {
      ...this._placementConfig,
      ...config,
    };
  }

  connectedCallback() {
    super.connectedCallback();
    this.contentNode = this.querySelector('[slot="content"]');
    this.invokerNode = this.querySelector('[slot="invoker"]');

    this._popup = overlays.add(
      new LocalOverlayController({
        hidesOnEsc: true,
        hidesOnOutsideClick: true,
        placementConfig: this.placementConfig,
        contentNode: this.contentNode,
        invokerNode: this.invokerNode,
      }),
    );
    this._show = () => this._popup.show();
    this._hide = () => this._popup.hide();
    this._toggle = () => this._popup.toggle();

    this.invokerNode.addEventListener('click', this._toggle);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.invokerNode.removeEventListener('click', this._toggle);
  }
}
