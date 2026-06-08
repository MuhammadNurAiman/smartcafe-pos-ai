package om.smartpos.backend.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long menuItemId;
    private String itemName;
    private int quantity;
    private String note;
    private BigDecimal price;

    public OrderItem() {
    }

    public OrderItem(Long menuItemId, String itemName, int quantity, String note, BigDecimal price) {
        this.menuItemId = menuItemId;
        this.itemName = itemName;
        this.quantity = quantity;
        this.note = note;
        this.price = price;
    }

    public BigDecimal getSubtotal() {
        return price.multiply(BigDecimal.valueOf(quantity));
    }

    public Long getId() {
        return id;
    }

    public Long getMenuItemId() {
        return menuItemId;
    }

    public String getItemName() {
        return itemName;
    }

    public int getQuantity() {
        return quantity;
    }

    public String getNote() {
        return note;
    }

    public BigDecimal getPrice() {
        return price;
    }
}