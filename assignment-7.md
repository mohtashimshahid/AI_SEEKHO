# AI SEEKHO — Assignment 7: Databases, Migrations & Backend Security

## Student Information

| Field | Details |
|-------|---------|
| **Course** | AI SEEKHO – 8-Week AI Learning Initiative |
| **Assignment** | Assignment 7: Databases, Migrations & Backend Security |
| **Student** | Mohtashim Shahid |
| **Student ID** | F2024376504 |
| **Program** | BS Artificial Intelligence |
| **University** | University of Management and Technology (UMT) |

---

## Task 1: PostgreSQL

**Deliverable:** 2 SQL statements

```sql
-- CREATE TABLE with a foreign key
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    total_amount NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- SELECT that JOINs orders to users
SELECT orders.id, orders.total_amount, users.email
FROM orders
JOIN users ON orders.user_id = users.id;
```

---

## Task 2: MongoDB

**Deliverable:** 2 short code snippets

```javascript
// insertOne()
db.orders.insertOne({
    userId: "u_1024",
    totalAmount: 89.99,
    status: "pending",
    createdAt: new Date()
});

// find() with a filter condition
db.orders.find({ status: "pending" });
```

---

## Task 3: Alembic

**Deliverable:** 1 migration file

```python
"""add phone_number column to users

Revision ID: a1b2c3d4e5f6
Revises: 
Create Date: 2026-08-18
"""
from alembic import op
import sqlalchemy as sa

revision = 'a1b2c3d4e5f6'
down_revision = None


def upgrade():
    op.add_column(
        'users',
        sa.Column('phone_number', sa.String(length=20), nullable=True)
    )


def downgrade():
    op.drop_column('users', 'phone_number')
```

---

## Task 4: Data Migration

**Deliverable:** Short written answer

To safely split `full_name` into `first_name` and `last_name` without downtime, I would first add both new columns as nullable so the schema change itself doesn't lock or break existing writes. Next, I'd run a backfill script in small batches (not one giant UPDATE) that parses `full_name` and populates the new columns while the application keeps writing to `full_name` as normal. Once the backfill is verified complete and correct, I'd deploy an application update that writes to all three columns simultaneously (dual-write), monitor for a period to confirm consistency, then finally cut reads over to the new columns and drop `full_name` in a later migration.

---

## Task 5: Order of Command (Precedence) in DB

**Deliverable:** 1 annotated SQL query

```sql
-- Actual execution order: FROM -> WHERE -> GROUP BY -> HAVING -> SELECT -> ORDER BY
SELECT department, COUNT(*) AS employee_count
FROM employees
WHERE status = 'active'
GROUP BY department
HAVING COUNT(*) > 5
ORDER BY employee_count DESC;
```

---

## Task 6: Idempotency

**Deliverable:** Short written answer

Idempotency means that performing the same operation multiple times produces the same result as performing it once, with no additional side effects from the repeat calls. A real HTTP example: `PUT /users/42` with a full user object is idempotent because sending it five times leaves the user in the same final state, whereas `POST /users` is non-idempotent because sending it five times creates five separate new users.

---

## Task 7: Session Hijacking

**Deliverable:** 3 bullet points

* **HttpOnly + Secure cookie flags** — prevents JavaScript from reading the session cookie (blocks XSS-based theft) and ensures it's only sent over HTTPS (blocks network sniffing).
* **Token rotation on privilege change / periodic refresh** — issuing a new session token after login and at intervals limits how long a stolen token remains useful.
* **Enforce HTTPS everywhere (HSTS)** — encrypts all traffic so session tokens can't be intercepted via man-in-the-middle attacks on public networks.

---

## Task 8: ACID Properties

**Deliverable:** 4 definitions + 1 SQL snippet

* **Atomicity** — all operations in a transaction succeed together, or none of them are applied at all.
* **Consistency** — a transaction moves the database from one valid state to another, never violating defined rules or constraints.
* **Isolation** — concurrent transactions don't interfere with each other; each behaves as if it ran alone.
* **Durability** — once a transaction is committed, its changes persist even after a crash or power loss.

```sql
BEGIN;

UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;

COMMIT;
-- Atomicity in action: both balance updates happen together, or if
-- anything fails before COMMIT, neither update is applied.
```

---

## Task 9: Decoupling Identity from Data

**Deliverable:** Short written answer

Application tables should reference users by a stable `user_id` (UUID) instead of storing email or name directly because personal details like email and name can change, and updating them across dozens of tables would be error-prone and slow. A UUID also isn't guessable or tied to real-world identity, which reduces exposure if a table is leaked, and it keeps personally identifiable information centralized in one `users` table where it's easier to secure, audit, and update. This decoupling also makes it simpler to support account changes (email updates, name changes, GDPR deletion requests) without cascading edits throughout the schema.
