
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('format-value', 'helper:format-value', {
  integration: true
});

test('it renders integer format with commas', function(assert) {
  this.set('inputValue', '1234');

  this.render(hbs`{{format-value inputValue}}`);

  assert.equal(this.$().text().trim(), '1,234');
});

test('it renders float format with commas', function(assert) {
  this.set('inputValue', '1234');

  this.render(hbs`{{format-value inputValue format="0,0.00"}}`);

  assert.equal(this.$().text().trim(), '1,234');
});
