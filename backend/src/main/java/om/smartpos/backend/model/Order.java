package om.smartpos.backend.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String tableNumber;
    private String orderType;
    private String status;
    private String paymentMethod;
    private BigDecimal totalAmount;

    @Column(length = 1000)
    private String aiKitchenSummary;

    @Column(length = 1000)
    private String aiUpsellSuggestion;

    private LocalDateTime createdAt = LocalDateTime.now();

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "order_id")
    private List<OrderItem> items = new ArrayList<>();

    public Order() {
    }

    public void calculateTotal() {
        this.totalAmount = items.stream()
                .map(OrderItem::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public void markPaid(String paymentMethod) {
        this.paymentMethod = paymentMethod;
        this.status = "PAID";
    }

    public void updateStatus(String status) {
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public String getTableNumber() {
        return tableNumber;
    }

    public void setTableNumber(String tableNumber) {
        this.tableNumber = tableNumber;
    }

    public String getOrderType() {
        return orderType;
    }

    public void setOrderType(String orderType) {
        this.orderType = orderType;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public String getAiKitchenSummary() {
        return aiKitchenSummary;
    }

    public void setAiKitchenSummary(String aiKitchenSummary) {
        this.aiKitchenSummary = aiKitchenSummary;
    }

    public String getAiUpsellSuggestion() {
        return aiUpsellSuggestion;
    }

    public void setAiUpsellSuggestion(String aiUpsellSuggestion) {
        this.aiUpsellSuggestion = aiUpsellSuggestion;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public List<OrderItem> getItems() {
        return items;
    }

    public void setItems(List<OrderItem> items) {
        this.items = items;
    }
}