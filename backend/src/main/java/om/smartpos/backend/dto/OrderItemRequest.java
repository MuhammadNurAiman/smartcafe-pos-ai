package om.smartpos.backend.dto;

public class OrderItemRequest {

    private Long menuItemId;
    private int quantity;
    private String note;

    public Long getMenuItemId() {
        return menuItemId;
    }

    public int getQuantity() {
        return quantity;
    }

    public String getNote() {
        return note;
    }
}