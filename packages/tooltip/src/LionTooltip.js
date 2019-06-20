import { LionPopup } from '@lion/popup';
import { overlays, LocalOverlayController } from '@lion/overlays';

export class LionTooltip extends LionPopup {
  connectedCallback() {
    super.connectedCallback();
    this.contentNode = this.querySelector('[slot="content"]');
    this.invokerNode = this.querySelector('[slot="invoker"]');

    this._tooltip = overlays.add(
      new LocalOverlayController({
        hidesOnEsc: true,
        hidesOnOutsideClick: true,
        placementConfig: this.placementConfig,
        contentNode: this.contentNode,
        invokerNode: this.invokerNode,
      }),
    );
    this._show = () => this._tooltip.show();
    this._hide = () => this._tooltip.hide();

    this.invokerNode.addEventListener('mouseenter', this._show);
    this.invokerNode.addEventListener('mouseleave', this._hide);
    this.invokerNode.addEventListener('focusin', this._show);
    this.invokerNode.addEventListener('focusout', this._hide);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.invokerNode.removeEventListener('mouseenter', this._show);
    this.invokerNode.removeEventListener('mouseleave', this._hide);
    this.invokerNode.removeEventListener('focusin', this._show);
    this.invokerNode.removeEventListener('focusout', this._hide);
  }
}
