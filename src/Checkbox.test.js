import React from "react";
import { useState } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Checkbox from "./Checkbox";

// TODO: Worth a look - https://www.npmjs.com/package/shadow-dom-testing-library

const log = (...args) => console.__proto__.log.call(console, ...args);

describe("Checkbox", () => {
  it("should render the checkbox", () => {
    const { container } = render(<Checkbox />);
    expect(container).toMatchSnapshot();
  });

  describe("controlled input behaviour", () => {
    it("should correctly invoke onChange and retain its checked state when clicked", () => {
      const onChange = jest.fn();
      const { container } = render(<Checkbox onChange={onChange} />);

      expect(container).toMatchSnapshot();

      // Confirm the checkbox is not checked.
      expect(screen.getByRole("checkbox")).not.toHaveAttribute("checked");

      fireEvent.click(screen.getByRole("checkbox"));

      expect(container).toMatchSnapshot();

      // Confirm the click resulted in a change event with target.checked: true.
      expect(onChange).toHaveBeenCalledTimes(1);
      const event = onChange.mock.calls[0][0];
      expect(event.target.checked).toBe(true);

      // Confirm the checkbox remains unchecked as its state is controlled.
      expect(screen.getByRole("checkbox")).not.toHaveAttribute("checked");
    });

    it("should allow updating of the checked state", () => {
      function CheckableCheckbox({ onChange }) {
        const [checked, setChecked] = useState(false);

        return (
          <Checkbox
            checked={checked}
            onChange={(event) => {
              onChange(event);
              setChecked(event.target.checked);
            }}
          />
        );
      }

      const onChange = jest.fn();
      const { container } = render(<CheckableCheckbox onChange={onChange} />);

      expect(container).toMatchSnapshot();

      // Confirm the checkbox is not checked.
      expect(screen.getByRole("checkbox")).not.toHaveAttribute("checked");

      fireEvent.click(screen.getByRole("checkbox"));

      expect(container).toMatchSnapshot();

      // Confirm the click resulted in a change event with target.checked: true.
      expect(onChange).toHaveBeenCalledTimes(1);
      let event = onChange.mock.calls[0][0];
      expect(event.target.checked).toBe(true);

      // Confirm the checkbox is now checked
      expect(screen.getByRole("checkbox")).toHaveAttribute("checked");

      // Click again to uncheck
      onChange.mockClear();
      fireEvent.click(screen.getByRole("checkbox"));

      expect(container).toMatchSnapshot();

      // Confirm the click resulted in a change event with target.checked: undefined.
      expect(onChange).toHaveBeenCalledTimes(1);
      event = onChange.mock.calls[0][0];
      expect(event.target).toHaveProperty("checked", undefined);

      // Confirm the checkbox is now unchecked
      expect(screen.getByRole("checkbox")).not.toHaveAttribute("checked");
    });
  });
});
