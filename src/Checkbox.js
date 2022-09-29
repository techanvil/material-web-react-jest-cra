/**
 * External dependencies
 */
import "@material/web/checkbox/checkbox";
import PropTypes from "prop-types";
import React from "react";

/**
 * WordPress dependencies
 */
//  import { useEffect, useRef, useState } from '@wordpress/element';

import { useEffect, useRef, useState } from "react";

const log = (...args) => console.__proto__.log.call(console, ...args);

export default function Checkbox({
  checked,
  disabled,
  name,
  value,
  onChange,
  onKeyDown,
}) {
  log("Checkbox render. checked:", checked);
  const ref = useRef(null);

  // Use this state in a key prop on the web component to force a rerender.
  // This is a workaround for the fact the web component doesn't update visually when the checked property is changed programmatically. Hopefully this will be fixed in a future update to the web component.
  // It has a side effect of unfocusing the checkbox when changed via keyboard input which needs to be addressed.
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const { current } = ref;

    const click = (event) => {
      log("click", event);

      // Prevent default and manually dispatch a change event, in order to retain checkbox state and use as a controlled input.
      event.preventDefault();

      if (disabled) {
        return;
      }

      current.checked = current.checked ? undefined : true;
      // current.checked = ! current.checked;

      current.dispatchEvent(
        new Event("change", {
          bubbles: true,
          composed: true,
        })
      );
    };

    const change = (event) => {
      log("change", event);

      // Preventing default behaviour has no effect here.
      // event.preventDefault();

      onChange?.(event);

      setIndex(index + 1);
    };

    // Keydown events work fine without any special logic.
    const keydown = (event) => {
      log("keydown", event);

      onKeyDown?.(event);
    };

    // The click event is triggered by both mouse and keyboard entry (space key) on Chrome, need to confirm other browsers.
    current?.addEventListener("click", click);
    current?.addEventListener("change", change);
    current?.addEventListener("keydown", keydown);

    // The 'action' event is dispatched by the ActionElement base class of the Material checkbox. See ActionElement source for details.
    // current?.addEventListener( 'action', cancelEvent );

    return () => {
      current?.removeEventListener("click", click);
      current?.removeEventListener("change", change);
      current?.removeEventListener("keydown", keydown);
    };
  }, [checked, disabled, index, onChange, onKeyDown]);

  // TODO: Change theme colour to match expected ?

  return (
    <md-checkbox
      key={`checkbox-${name}-${index}`}
      ref={ref}
      role="checkbox"
      // Lit boolean attributes treat anything non-null|undefined as true. Coerce to undefined if false.
      // See https://lit.dev/docs/v1/components/properties/#attributes
      checked={checked || undefined}
      disabled={disabled || undefined}
      name={name}
      value={value}
    ></md-checkbox>
  );
}

/**
 * Props determined by examining the Material 3 web component's source code.
 *
 * See @property definitions and event handlers in the source to identify which props are needed.
 */

Checkbox.propTypes = {
  // Fundamental checkbox attributes.
  checked: PropTypes.bool,
  disabled: PropTypes.bool,
  name: PropTypes.string,
  value: PropTypes.string,

  // Event handlers.
  onChange: PropTypes.func,
  onKeyDown: PropTypes.func,

  // Accessibility attributes.
  // ariaLabel: PropTypes.string,
  // ariaLabelledBy: PropTypes.string,
  // ariaDescribedBy: PropTypes.string,
  // reducedTouchTarget: PropTypes.bool,
};
