package om.smartpos.backend.dto;

import java.util.List;

public class CreateOrderRequest {

    private String tableNumber;
    private String orderType;
    private List<OrderItemRequest> items;

    public String getTableNumber() {
        return tableNumber;
    }

    public String getOrderType() {
        return orderType;
    }

    public List<OrderItemRequest> getItems() {
        return items;
    }
}