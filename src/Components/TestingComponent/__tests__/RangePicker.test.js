import { fireEvent, render, screen } from "@testing-library/react";
import RangePicker from "../RangePicker";
import { addDays, format, startOfMonth } from "date-fns";

describe('Rangepickers', () => {
  it('Testing onchange', () => {
    render(<RangePicker />);
    const startDate = screen.getByPlaceholderText(
      "R"
    );
    fireEvent.mouseDown(startDate);
     // Find the input elements
    const rangePickerInputs = screen.getAllByRole('textbox');
    const startDateInput = rangePickerInputs[0];
    const endDateInput = rangePickerInputs[1];

    // Simulate user interaction by changing the input values
     const startDateFormatted = format(startOfMonth(new Date()), "yyyy-MM-dd");
    const endDateFormatted = format(addDays(new Date(), 3), "yyyy-MM-dd");
    fireEvent.change(startDateInput, { target: { value: startDateFormatted } });
    fireEvent.change(endDateInput, { target: { value: endDateFormatted } });
    fireEvent.click(document.querySelector('.ant-picker-cell-selected'));

  })
})

