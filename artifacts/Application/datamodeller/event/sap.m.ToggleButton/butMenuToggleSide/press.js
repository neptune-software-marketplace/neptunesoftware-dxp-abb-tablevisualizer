const isPressed = butMenuToggleSide.getPressed();

if (isPressed) {
    layoutTableSelection.setSize("40%");
    layoutTableSelection.setResizable(true);
    setTimeout(function () {
        layoutTableSelection.rerender();
    }, 10);

    butMenuToggleSide.setIcon("sap-icon://navigation-up-arrow");
    butMenuToggleSide.setText("Models");
} else {
    layoutTableSelection.setSize("0px");
    layoutTableSelection.setResizable(false);

    butMenuToggleSide.setIcon("sap-icon://navigation-down-arrow");
    butMenuToggleSide.setText("Models");
}
