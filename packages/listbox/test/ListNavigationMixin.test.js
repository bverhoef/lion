import { expect, fixture, html, defineCE } from '@open-wc/testing';
import { keyUpOn } from '@polymer/iron-test-helpers/mock-interactions.js';
import { LionLitElement } from '@lion/core/src/LionLitElement.js';

import ListNavigationMixin from '../src/ListBoxBehavior.js';
import '../lion-option.js';

const keyCodes = {
  arrowDown: 40,
  arrowUp: 38,
};

describe('ListNavigationMixin', () => {
  describe('Keyboard navigation', () => {
    let elem;
    before(() => {
      elem = defineCE(
        class TestList extends ListNavigationMixin(LionLitElement) {
          render() {
            return html`
              <slot></slot>
            `;
          }
        },
      );
    });

    it('navigates through list with [arrow up] [arrow down] keys', async () => {
      const el = await fixture(html`
          <${elem}>
            <lion-option value="nr1">Item 1</lion-option>
            <lion-option value="nr2" selected>Item 2</lion-option>
            <lion-option value="nr3">Item 3</lion-option>
            <lion-option value="nr4">Item 4</lion-option>
          </${elem}>
        `);
      el.querySelectorAll('lion-option')[1].focus();
      el.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
      await el.updateComplete;
      expect(el.querySelectorAll('lion-option')[2].focused).to.be.true;

      el.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
      await el.updateComplete;
      expect(el.querySelectorAll('lion-option')[1].focused).to.be.true;
    });

    it('navigates to top and bottom with [home] [end] keys', async () => {
      const el = await fixture(html`
          <${elem}>
            <lion-option value="nr1">Item 1</lion-option>
            <lion-option value="nr2">Item 2</lion-option>
            <lion-option value="nr3">Item 3</lion-option>
            <lion-option value="nr4">Item 4</lion-option>
          </{elem}>
        `);
      el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home' }));
      await el.updateComplete;
      expect(el.querySelectorAll('lion-option')[0].focused).to.be.true;

      el.dispatchEvent(new KeyboardEvent('keydown', { key: 'End' }));
      await el.updateComplete;
      expect(el.querySelectorAll('lion-option')[3].focused).to.be.true;
    });

    it('doesn\t "rotate" option selection on [up/down] arrow keys by default', async () => {
      const el = await fixture(html`
          <${elem}>
            <lion-option selected value="nr1">Item 1</lion-option>
            <lion-option value="nr2">Item 2</lion-option>
          </{elem}>
        `);
      keyUpOn(el, keyCodes.arrowDown);
      expect(el.querySelectorAll('lion-option')[1].selected).to.be.true;
      expect(el.value).to.equal('nr2');

      keyUpOn(el, keyCodes.arrowDown);
      expect(el.querySelectorAll('lion-option')[1].selected).to.be.true;
      expect(el.value).to.equal('nr2');
    });

    // TODO: nice to have (not needed for select)
    it.skip('does "rotate" option selection on [up/down] arrow keys when set', async () => {
      const el = await fixture(html`
          <${elem} rotate>
            <lion-option selected value="nr1">Item 1</lion-option>
            <lion-option value="nr2">Item 2</lion-option>
          </{elem}>
        `);
      keyUpOn(el, keyCodes.arrowDown);
      expect(el.querySelectorAll('lion-option')[1].selected).to.be.true;
      expect(el.value).to.equal('nr2');

      keyUpOn(el, keyCodes.arrowDown);
      expect(el.querySelectorAll('lion-option')[1].selected).to.be.true;
      expect(el.value).to.equal('nr2');
    });

    // TODO: nice to have
    it.skip('switch focus with single [character] key', async () => {
      const el = await fixture(html`
          <${elem}>
            <lion-option value="aaa">Aaa</lion-option>
            <lion-option value="bbb">Bbb</lion-option>
            <lion-option value="ccc">Ccc</lion-option>
          </{elem}>
        `);
      el.querySelectorAll('lion-option')[0].focus();
      el.dispatchEvent(new KeyboardEvent('keydown', { key: 'C' }));
      await el.updateComplete;
      expect(el.querySelectorAll('lion-option')[2].focused).to.be.true;
    });

    it.skip('switch focus to specific element with multiple [character] keys', async () => {
      const el = await fixture(html`
          <${elem}>
            <lion-option value="bar">Bar</lion-option>
            <lion-option value="far">Far</lion-option>
            <lion-option value="Foo">Foo</lion-option>
          </{elem}>
        `);
      el.querySelectorAll('lion-option')[0].focus();
      el.dispatchEvent(new KeyboardEvent('keydown', { key: 'F' }));
      el.dispatchEvent(new KeyboardEvent('keydown', { key: 'O' }));
      await el.updateComplete;
      expect(el.querySelectorAll('lion-option')[2].focused).to.be.true;
    });
  });
});
