# Database Entity Relationship Diagram

```mermaid
erDiagram
    City ||--o{ Area : contains
    City ||--o{ Retailer : hosts
    City ||--o{ Product : supplies
    City ||--o{ User : default_for
    User ||--o{ Address : owns
    User ||--|| Cart : has
    User ||--o{ Order : places
    User ||--o{ WishlistItem : favorites
    Retailer ||--o{ Product : sells
    Retailer ||--o{ OrderItem : fulfills
    Category ||--o{ Product : categorizes
    Product ||--o{ ProductVariant : options
    Product ||--o{ ProductImage : galleries
    Product ||--o{ CartItem : appears_in
    Product ||--o{ WishlistItem : liked_in
    Product ||--o{ OrderItem : includes
    Cart ||--o{ CartItem : contains
    Order ||--o{ OrderItem : composed_of
    Order ||--o{ OrderStatusHistory : tracks
    Order ||--|| Address : ships_to
```

Cities are seeded with the required six hyperlocal options (Delhi, Noida, Gurugram, Varanasi, Patna, Mumbai) ensuring every retailer and product inherits a location context for queries.


