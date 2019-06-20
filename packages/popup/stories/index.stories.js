import { storiesOf, html } from '@open-wc/demoing-storybook';
import { css } from '@lion/core';

import '@lion/icon/lion-icon.js';
import '@lion/button/lion-button.js';
import '../lion-popup.js';

const popupDemoStyle = css`
  .demo-box {
    width: 200px;
    background-color: white;
    border-radius: 2px;
    border: 1px solid grey;
    margin: 250px;
    padding: 8px;
  }

  .demo-box_placements {
    display: flex;
    flex-direction: column;
    width: 173px;
    margin: 0 auto;
    margin-top: 68px;
  }

  lion-popup {
    padding: 10px;
  }

  .demo-box__column {
    display: flex;
    flex-direction: column;
  }

  .popup {
    display: block;
    position: absolute;
    font-size: 16px;
    color: white;
    background-color: black;
    border-radius: 4px;
    padding: 8px;
    /* To display on top of elements with no z-index that are appear later in the DOM */
    z-index: 1;
  }

  @media (max-width: 480px) {
    .popup {
      display: none;
    }
  }
`;

storiesOf('Local Overlay System|Popup', module)
  .add(
    'Button popup',
    () => html`
      <style>
        ${popupDemoStyle}
      </style>
      <div class="demo-box">
        <lion-popup .placementConfig="${{ placement: 'top' }}">
          <div slot="content" class="popup">hey there</div>
          <lion-button slot="invoker">Popup</lion-button>
        </lion-popup>
      </div>
    `,
  )
  .add(
    'placements',
    () => html`
      <style>
        ${popupDemoStyle}
      </style>
      <div class="demo-box_placements">
        <lion-popup .placementConfig="${{ placement: 'top' }}">
          <div slot="content" class="popup">Its top placement</div>
          <lion-button slot="invoker">Top</lion-button>
        </lion-popup>
        <lion-popup .placementConfig="${{ placement: 'right' }}">
          <div slot="content" class="popup">Its right placement</div>
          <lion-button slot="invoker">Right</lion-button>
        </lion-popup>
        <lion-popup .placementConfig="${{ placement: 'bottom' }}">
          <div slot="content" class="popup">Its bottom placement</div>
          <lion-button slot="invoker">Bottom</lion-button>
        </lion-popup>
        <lion-popup .placementConfig="${{ placement: 'left' }}">
          <div slot="content" class="popup">Its left placement</div>
          <lion-button slot="invoker">Left</lion-button>
        </lion-popup>
      </div>
    `,
  );
