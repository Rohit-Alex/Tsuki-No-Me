import { fireEvent, prettyDOM, render, screen } from "@testing-library/react";
import { selectOptions } from "Constant";
import AddDetailsModal from "../AddDetailsModal";
import Implementation1 from "../Implementation1";

describe("Implementation1", () => {
  it("Should open modal for showing details", () => {
    render(<Implementation1 />);
    const modalOpenBtn = screen.getByRole("button", {
      name: "modal-state-trigger",
    });
    fireEvent.click(modalOpenBtn);
    expect(screen.getByRole("presentation")).toBeInTheDocument();
  });

  it("Should be able to close the modal", () => {
    render(<Implementation1 />);
    const modalOpenBtn = screen.getByRole("button", {
      name: "modal-state-trigger",
    });
    fireEvent.click(modalOpenBtn);
    const closeIcon = screen.getByRole("button", { name: /close/i });
    fireEvent.click(closeIcon);
    expect(screen.queryByRole("presentation")).not.toBeInTheDocument();
  });

  it("Should render all the statementNumber options", () => {
    const handleCloseMocked = jest.fn();
    render(
      <AddDetailsModal
        open
        handleClose={handleCloseMocked}
        statementNoList={selectOptions}
      />
    );
    const selectCtnBtn = screen.getByRole("button", {
      name: /statement no ​/i,
    });
    fireEvent.mouseDown(selectCtnBtn);
    const allOptions = screen.getAllByRole("option");
    expect(allOptions.length).toBe(10);
  });

  it("Should be able to add data with all entries filled", () => {
    render(
      <AddDetailsModal
        open
        handleClose={jest.fn()}
        statementNoList={selectOptions}
      />
    );
    const selectCtnBtn = screen.getByRole("button", {
      name: /statement no ​/i,
    });
    fireEvent.mouseDown(selectCtnBtn);
    const secondOption = screen.getByRole("option", { name: "option-2" });
    fireEvent.click(secondOption);

    const paymentTextArea = screen.getByRole("textbox", {
      name: /payment_reference/i,
    });
    fireEvent.change(paymentTextArea, { target: { value: "some_payment" } });

    const noteTextArea = screen.getByRole("textbox", { name: /note/i });
    fireEvent.change(noteTextArea, { target: { value: "some_note" } });

    const addDataBtn = screen.getByRole("button", { name: /add \+/i });
    fireEvent.click(addDataBtn);

    const badgeCount = screen.getByTestId("badge-count-testid");
    expect(badgeCount).toHaveTextContent(1);
  });

  it("Should not be able to add data till statement number is selected", () => {
    render(
      <AddDetailsModal
        open
        handleClose={jest.fn()}
        statementNoList={selectOptions}
      />
    );
    const addDataBtn = screen.getByRole("button", { name: /add \+/i });
    expect(addDataBtn).toBeDisabled();
  });

  it("Should not be able to add same statement number more than once", () => {
    render(
      <AddDetailsModal
        open
        handleClose={jest.fn()}
        statementNoList={selectOptions}
      />
    );
    const selectCtnBtn = screen.getByRole("button", {
      name: /statement no ​/i,
    });
    fireEvent.mouseDown(selectCtnBtn);
    const secondOption = screen.getByRole("option", { name: "option-1" });
    fireEvent.click(secondOption);

    const addDataBtn = screen.getByRole("button", { name: /add \+/i });
    fireEvent.click(addDataBtn);

    fireEvent.mouseDown(selectCtnBtn);
    expect(addDataBtn).toBeDisabled();
  });

  it("Should be able to remove the added data from the list", () => {
    render(
      <AddDetailsModal
        open
        handleClose={jest.fn()}
        statementNoList={selectOptions}
      />
    );
    const selectCtnBtn = screen.getByRole("button", {
      name: /statement no ​/i,
    });
    fireEvent.mouseDown(selectCtnBtn);
    const secondOption = screen.getByRole("option", { name: "option-3" });
    fireEvent.click(secondOption);

    const addDataBtn = screen.getByRole("button", { name: /add \+/i });
    fireEvent.click(addDataBtn);

    const expandBtn = screen.getByRole("button", {
      name: /expand\-accordion/i,
    });
    fireEvent.click(expandBtn);

    const addedItems = screen.getAllByRole("listitem");
    expect(addedItems.length).toBe(1);

    const deleteIcon = screen.getByTestId("DeleteIcon");
    fireEvent.click(deleteIcon);
    expect(screen.queryByRole("listitem")).not.toBeInTheDocument();
  });
});
