import { storiesOf, html } from '@open-wc/demoing-storybook';
import { css } from '@lion/core';
import { LocalOverlayController } from '../src/LocalOverlayController.js';
import { overlays } from '../src/overlays.js';

const popupPlacementDemoStyle = css`
  .demo-box {
    width: 40px;
    height: 40px;
    background-color: white;
    border-radius: 2px;
    border: 1px solid grey;
    margin: 120px auto 120px 360px;
    padding: 8px;
  }

  .demo-popup {
    background-color: white;
    border-radius: 2px;
    border: 1px solid grey;
    box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.12), 0 6px 6px 0 rgba(0, 0, 0, 0.24);
    padding: 8px;
  }
`;

storiesOf('Local Overlay System|Local Overlay Placement', module)
  .addParameters({ options: { selectedPanel: 'storybook/actions/actions-panel' } })
  .add('Preferred placement overlay absolute', () => {
    const popupController = overlays.add(
      new LocalOverlayController({
        hidesOnEsc: true,
        contentTemplate: () =>
          html`
            <div class="demo-popup">United Kingdom</div>
          `,
        invokerTemplate: () =>
          html`
            <button style="border: none" @click=${() => popupController.show()}>UK</button>
          `,
      }),
    );

    let placement = 'top';
    const togglePlacement = () => {
      switch (placement) {
        case 'top-end':
          placement = 'top';
          break;
        case 'top':
          placement = 'top-start';
          break;
        case 'top-start':
          placement = 'right-end';
          break;
        case 'right-end':
          placement = 'right';
          break;
        case 'right':
          placement = 'right-start';
          break;
        case 'right-start':
          placement = 'bottom-start';
          break;
        case 'bottom-start':
          placement = 'bottom';
          break;
        case 'bottom':
          placement = 'bottom-end';
          break;
        case 'bottom-end':
          placement = 'left-start';
          break;
        case 'left-start':
          placement = 'left';
          break;
        case 'left':
          placement = 'left-end';
          break;
        default:
          placement = 'top-end';
      }
      popupController.hide();
      popupController.placementConfig.placement = placement;
      popupController.show();
    };
    return html`
      <style>
        ${popupPlacementDemoStyle}
      </style>
      <div>
        <button @click=${() => togglePlacement()}>Toggle placement</button>
        <button @click=${() => popupController.hide()}>Close popup</button>
      </div>
      <div class="demo-box">
        ${popupController.invoker} ${popupController.content}
      </div>
    `;
  });
/* TODO: Add this when we have a feature in place that adds scrollbars / overflow when no space is available */
/* .add('Space not available', () => {
    const popupController = overlays.add(
      new LocalOverlayController({
        hidesOnEsc: true,
        contentTemplate: () =>
          html`
            <div class="demo-popup">
              Toggle the placement of this overlay with the buttons.
              Since there is not enough space available on the vertical center or the top for this popup,
              the popup will get displayed on the available space on the bottom.
              Try dragging the viewport to increase/decrease space see the behavior of this.
            </div>
          `,
        invokerTemplate: () =>
          html`
            <button style="border: none" @click=${() => popupController.show()}>UK</button>
          `,
      }),
    );

    let placement = 'top';
    const togglePlacement = () => {
      switch (placement) {
        case 'top-end':
          placement = 'top';
          break;
        case 'top':
          placement = 'top-start';
          break;
        case 'top-start':
          placement = 'right-end';
          break;
        case 'right-end':
          placement = 'right';
          break;
        case 'right':
          placement = 'right-start';
          break;
        case 'right-start':
          placement = 'bottom-start';
          break;
        case 'bottom-start':
          placement = 'bottom';
          break;
        case 'bottom':
          placement = 'bottom-end';
          break;
        case 'bottom-end':
          placement = 'left-start';
          break;
        case 'left-start':
        placement = 'left';
          break;
        case 'left':
          placement = 'left-end';
          break;
        default:
          placement = 'top-end';
      }
      popupController.hide();
      popupController.placement = placement;
      popupController.show();
    };
    return html`
      <style>
        ${popupPlacementDemoStyle}
      </style>
      <div>
        <button @click=${() => togglePlacement()}>Toggle placement</button>
        <button @click=${() => popupController.hide()}>Close popup</button>
      </div>
      <div class="demo-box">
        ${popupController.invoker} ${popupController.content}
      </div>
    `;
  }); */
