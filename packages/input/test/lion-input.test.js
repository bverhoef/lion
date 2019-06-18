import { expect, fixture, html } from '@open-wc/testing';

import '../lion-input.js';

describe('<lion-input>', () => {
  it('delegates readOnly property and readonly attribute', async () => {
    const el = await fixture(
      html`
        <lion-input readonly><label slot="label">Testing readonly</label></lion-input>
      `,
    );
    expect(el.inputElement.readOnly).to.equal(true);
    el.readOnly = false;
    await el.updateComplete;
    expect(el.readOnly).to.equal(false);
    expect(el.inputElement.readOnly).to.equal(false);
  });

  it('automatically creates an <input> element if not provided by user', async () => {
    const el = await fixture(
      html`
        <lion-input></lion-input>
      `,
    );
    expect(el.querySelector('input')).to.equal(el.inputElement);
  });
});
