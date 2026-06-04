# Support Ticket Live Chat Flow

This document explains how the support ticket chat currently works across:

- `backend-euroshipper`
- `admin-euroshipper`

It covers:

- the ticket data model
- the REST APIs used by support chat
- the Socket.IO room and event flow
- the difference between country admin and superadmin access
- the exact frontend behavior in the admin panels
- implementation notes and current gaps

## Source files reviewed

- `backend-euroshipper/src/index.js`
- `backend-euroshipper/src/config/socket.js`
- `backend-euroshipper/src/modules/route.js`
- `backend-euroshipper/src/modules/ticket/ticket.routes.js`
- `backend-euroshipper/src/modules/ticket/ticket.controller.js`
- `backend-euroshipper/src/middlewares/auth.middleware.js`
- `backend-euroshipper/prisma/schema.prisma`
- `admin-euroshipper/src/config/socket.js`
- `admin-euroshipper/src/context/AuthContext.jsx`
- `admin-euroshipper/src/pages/country-admin/CountrySupport.jsx`
- `admin-euroshipper/src/pages/super-admin/Tickets.jsx`

## 1. High level architecture

The ticket chat uses a hybrid model:

- REST API is the source of truth for loading ticket lists, loading full chat history, sending a message, and changing ticket status.
- Socket.IO is only used for live push updates after a ticket is already open in the admin UI.

In practice the flow is:

1. Admin page loads ticket list with HTTP.
2. Admin opens one ticket and loads full conversation with HTTP.
3. Admin page joins a Socket.IO room for that ticket.
4. When anyone sends a new message or updates status, backend emits a socket event to that room.
5. Open chat modal updates immediately without another full fetch.

## 2. Backend boot sequence

The backend creates the HTTP server first, then attaches Socket.IO:

- `backend-euroshipper/src/index.js`
- `initSocket(server)` is called before `server.listen(...)`
- all API routes are mounted under `/api`

Ticket routes are mounted here:

- `/api/tickets`

## 3. Ticket data model

From `backend-euroshipper/prisma/schema.prisma`:

### `Ticket`

- `id`: UUID
- `userId`: owner of the ticket
- `subject`: ticket subject
- `message`: original top-level message stored on the ticket row
- `status`: `open`, `in_progress`, `closed`, or `resolved`
- `orderId`: optional linked order
- `queryType`: currently used values are `general` and `order_related`
- `typeOfProduct`
- `fullname`
- `email`
- `mobilenumber`
- `createdAt`
- `updatedAt`
- `messages`: relation to `TicketMessage[]`

### `TicketMessage`

- `id`
- `ticketId`
- `senderId`
- `message`
- `createdAt`
- `sender`: relation to `User`

## 4. Important data behavior

### First message is stored twice

When a ticket is created:

- the original text is saved in `ticket.message`
- the same text is also inserted as the first row in `TicketMessage`

So the real conversation history should be read from `ticket.messages`, not only from `ticket.message`.

### Status values in real use

The Prisma enum includes:

- `open`
- `in_progress`
- `closed`
- `resolved`

But the current controller and admin UI only actively use:

- `open`
- `in_progress`
- `resolved`

`closed` exists in the schema but is not part of the current admin support flow.

## 5. Authentication and role rules

All ticket endpoints use the `authenticate` middleware.

The middleware:

- expects `Authorization: Bearer <token>`
- verifies the token
- loads the latest user from DB
- blocks users with invalid session
- blocks blocked users
- blocks country admins that do not have `assignedRouteId`

### Access rules by role

#### User

- can create tickets
- can fetch only their own tickets
- can open only their own ticket details
- can send message only on their own ticket
- cannot change ticket status

#### Country admin (`role === "admin"`)

- can see:
  - tickets linked to orders on their assigned route
  - all general tickets where `orderId` is `null`
- can open ticket details if:
  - ticket has no order, or
  - ticket order belongs to their assigned route
- can reply to allowed tickets
- can change status on allowed tickets

#### Superadmin (`role === "superadmin"`)

- can see all tickets
- can open all tickets
- can reply to all tickets
- can change all ticket statuses

## 6. REST API reference

There is no separate `GET /api/tickets/:id/messages` endpoint.

Chat history is returned by:

- `GET /api/tickets/:id`

### 6.1 Create ticket

`POST /api/tickets`

Who uses it:

- user-side flow, not admin-side flow

Required auth:

- yes

Body:

```json
{
  "fullname": "John Doe",
  "email": "john@example.com",
  "mobilenumber": "1234567890",
  "subject": "Issue with shipment ETA",
  "typeOfProduct": "Box",
  "message": "I need an update on my shipment status.",
  "queryType": "general",
  "orderId": null
}
```

Validation rules enforced by backend:

- `fullname` must be string, min 3 chars
- `email` must exist
- `mobilenumber` must exist and contain at least 8 digits after stripping non-digits
- `subject` must be string, min 5 chars, max 250 chars
- `typeOfProduct` must be string, min 2 chars
- `message` must be string, min 10 chars, max 2000 chars
- `queryType` must be `general` or `order_related`
- `orderId` is required when `queryType === "order_related"`
- order must exist if `order_related`

Backend behavior:

- sets `userId` from logged-in user
- stores original fields on `Ticket`
- creates the first `TicketMessage`
- includes `messages` in response

Success response shape:

```json
{
  "success": true,
  "data": {
    "id": "ticket-id",
    "userId": "user-id",
    "subject": "Issue with shipment ETA",
    "message": "I need an update on my shipment status.",
    "status": "open",
    "orderId": null,
    "queryType": "general",
    "typeOfProduct": "Box",
    "fullname": "John Doe",
    "email": "john@example.com",
    "mobilenumber": "1234567890",
    "messages": [
      {
        "id": "message-id",
        "ticketId": "ticket-id",
        "senderId": "user-id",
        "message": "I need an update on my shipment status."
      }
    ]
  }
}
```

### 6.2 Get current user's tickets

`GET /api/tickets`

Who uses it:

- user-side flow

Behavior:

- returns only tickets where `ticket.userId === req.user.id`
- sorted by `createdAt desc`
- includes linked order and route names

### 6.3 Get admin ticket list

`GET /api/tickets/admin`

Who uses it:

- `admin-euroshipper/src/pages/country-admin/CountrySupport.jsx`
- `admin-euroshipper/src/pages/super-admin/Tickets.jsx`

Behavior:

- if role is `admin`, filters by assigned route plus general tickets
- if role is `superadmin`, returns all tickets
- sorted by `updatedAt desc`
- includes:
  - `user.fullName`
  - `user.email`
  - `user.role`
  - `order.route.originName`
  - `order.route.destinationName`
  - `messages` with only the latest message

Important detail:

- list endpoint returns only `take: 1` message
- full message history is not returned here

Approx response shape per row:

```json
{
  "id": "ticket-id",
  "subject": "Issue with shipment ETA",
  "status": "open",
  "queryType": "general",
  "createdAt": "2026-06-04T00:00:00.000Z",
  "updatedAt": "2026-06-04T00:00:00.000Z",
  "user": {
    "fullName": "John Doe",
    "email": "john@example.com",
    "role": "user"
  },
  "order": {
    "route": {
      "originName": "London",
      "destinationName": "Lagos"
    }
  },
  "messages": [
    {
      "id": "latest-message-id",
      "message": "Latest chat line",
      "createdAt": "2026-06-04T00:00:00.000Z",
      "sender": {
        "fullName": "John Doe",
        "role": "user"
      }
    }
  ]
}
```

### 6.4 Get all conversations for superadmin

`GET /api/tickets/superadmin/all`

Who can call it:

- only `superadmin`

Behavior:

- returns all tickets
- includes full message history
- sorted by `updatedAt desc`

Important note:

- this endpoint exists in backend
- current superadmin admin page does not use it
- current page still uses `GET /api/tickets/admin`

### 6.5 Get ticket details and message history

`GET /api/tickets/:id`

Who uses it:

- both admin ticket pages when opening a modal

Behavior:

- checks access by role
- includes:
  - user basic info
  - order route info
  - full `messages`
- messages are sorted by `createdAt asc`

This is the real "get messages" API in the current implementation.

Response includes:

- `ticket.user`
- `ticket.order`
- `ticket.messages[]`

Each message includes:

- `id`
- `ticketId`
- `senderId`
- `message`
- `createdAt`
- `sender.fullName`
- `sender.role`

### 6.6 Send a new chat message

`POST /api/tickets/:id/messages`

Who uses it:

- both admin ticket pages
- user-side flow can also use it if implemented elsewhere

Body:

```json
{
  "message": "We are checking your shipment and will update you shortly."
}
```

Backend behavior:

1. loads the ticket
2. checks role-based access
3. creates `TicketMessage`
4. updates ticket `updatedAt`
5. if sender is `admin` or `superadmin` and current ticket status is `open`, ticket status is auto-moved to `in_progress`
6. emits `newMessage` socket event to room `ticket:<ticketId>`

HTTP success response:

```json
{
  "success": true,
  "data": {
    "id": "message-id",
    "ticketId": "ticket-id",
    "senderId": "admin-id",
    "message": "We are checking your shipment and will update you shortly.",
    "createdAt": "2026-06-04T00:00:00.000Z",
    "sender": {
      "fullName": "Admin Name",
      "role": "admin"
    }
  }
}
```

Important live-chat detail:

- admin UI does not manually append the HTTP response to chat
- it clears the textbox after success
- the visible chat update comes from the socket `newMessage` event

### 6.7 Update ticket status

`PATCH /api/tickets/:id/status`

Who can call it:

- `admin`
- `superadmin`

Body:

```json
{
  "status": "resolved"
}
```

Allowed practical values:

- `open`
- `in_progress`
- `resolved`

Transition rule:

- backend does not allow status rollback
- `open -> in_progress -> resolved` is allowed
- `resolved -> in_progress` is blocked
- `in_progress -> open` is blocked

Backend behavior:

- updates status
- updates `updatedAt`
- emits `statusUpdated` socket event

Success response:

```json
{
  "success": true,
  "data": {
    "id": "ticket-id",
    "status": "resolved"
  }
}
```

## 7. Socket.IO implementation

## 7.1 Backend socket server

File:

- `backend-euroshipper/src/config/socket.js`

Current rooms:

- `ticket:<ticketId>`
- `enquiry:<enquiryId>`
- `route:<routeId>`

Relevant ticket listener:

```js
socket.on("joinTicket", (ticketId) => {
  socket.join(`ticket:${ticketId}`);
});
```

Relevant ticket emits:

- `newMessage`
- `statusUpdated`

## 7.2 Frontend socket client

File:

- `admin-euroshipper/src/config/socket.js`

Current client config:

```js
const socket = io(import.meta.env.VITE_BACKEND_PORT, {
  autoConnect: false,
  transports: ["websocket"]
});
```

Meaning:

- socket is not connected immediately on import
- each page explicitly calls `socket.connect()`
- websocket transport is forced

## 7.3 Ticket room join flow

Both admin pages do this:

1. page mounts
2. `socket.connect()` is called
3. ticket list is loaded through HTTP
4. when one ticket is selected, page emits:

```js
socket.emit("joinTicket", selectedTicket.id);
```

5. page starts listening for:
   - `newMessage`
   - `statusUpdated`
6. page removes listeners when selected ticket changes or modal closes
7. page disconnects socket on page unmount

## 7.4 `newMessage` event payload

When backend emits a ticket chat message, payload is:

```json
{
  "id": "message-id",
  "ticketId": "ticket-id",
  "senderId": "admin-id",
  "message": "Reply text",
  "createdAt": "2026-06-04T00:00:00.000Z",
  "sender": {
    "fullName": "Admin Name",
    "role": "admin"
  },
  "senderName": "Admin Name",
  "senderRole": "admin",
  "newStatus": "in_progress"
}
```

Notes:

- `sender` is included because `ticketMessage.create(... include sender ...)` is used
- `senderName` and `senderRole` are also added manually
- `newStatus` is only meaningful when reply auto-promotes ticket from `open` to `in_progress`

Frontend reaction:

- append message to `selectedTicket.messages`
- update selected ticket status if `newStatus` exists
- update list row status and `updatedAt`

## 7.5 `statusUpdated` event payload

Payload:

```json
{
  "ticketId": "ticket-id",
  "status": "resolved"
}
```

Frontend reaction:

- update modal ticket status
- update ticket list status

## 8. Country admin page flow

File:

- `admin-euroshipper/src/pages/country-admin/CountrySupport.jsx`

### On page load

- fetches route name from `/api/shipping-routes/:assignedRouteId`
- fetches tickets from `/api/tickets/admin`
- connects socket

### On ticket open

- calls `GET /api/tickets/:id`
- stores full ticket in `selectedTicket`
- opens modal
- emits `joinTicket`

### On send reply

- calls `POST /api/tickets/:id/messages`
- clears textbox on success
- waits for socket event to render new message

### On status change

- calls `PATCH /api/tickets/:id/status`
- shows toast
- waits for socket event to sync UI state

### Chat rendering rule

Country admin decides whether a message is from staff with:

- `msg.senderId !== selectedTicket.userId`

So any non-user sender is rendered as staff-side chat bubble.

## 9. Superadmin page flow

File:

- `admin-euroshipper/src/pages/super-admin/Tickets.jsx`

The superadmin page is almost the same as country admin flow:

- load list from `GET /api/tickets/admin`
- connect socket
- open one ticket with `GET /api/tickets/:id`
- join room with `joinTicket`
- send replies with `POST /api/tickets/:id/messages`
- update status with `PATCH /api/tickets/:id/status`

### Key implementation note

Even though backend provides:

- `GET /api/tickets/superadmin/all`

the current superadmin UI does not use it.

It relies on:

- `GET /api/tickets/admin`

That still works because backend treats `superadmin` as full access in `getAdminTickets`.

### Message ownership rendering

Superadmin page decides right-side bubble by:

- `msg.senderId === user.id`

So only the currently logged-in superadmin's own messages appear on the right.
Other staff messages can render on the left.

## 10. Live chat sequence example

Example: country admin opens an open ticket and sends a reply.

1. Country admin page loads `/api/tickets/admin`.
2. Admin clicks a ticket card.
3. Page calls `/api/tickets/:id` and gets full `messages[]`.
4. Page emits `joinTicket` with that ticket ID.
5. Admin submits reply with `POST /api/tickets/:id/messages`.
6. Backend creates `TicketMessage`.
7. Backend sees sender is staff and ticket is `open`.
8. Backend updates ticket status to `in_progress`.
9. Backend emits `newMessage` to room `ticket:<id>` with `newStatus: "in_progress"`.
10. Open modal appends message and updates status to `in_progress`.
11. Ticket list row updates too.

Example: superadmin marks ticket resolved.

1. Superadmin clicks `RESOLVED`.
2. Page calls `PATCH /api/tickets/:id/status`.
3. Backend validates status transition.
4. Backend updates DB.
5. Backend emits `statusUpdated`.
6. Any open admin client in that room updates the ticket badge immediately.

## 11. Current implementation notes and gaps

### 11.1 No dedicated "get messages" endpoint

There is no:

- `GET /api/tickets/:id/messages`

Message history is bundled inside:

- `GET /api/tickets/:id`

### 11.2 Socket room join has no auth check

Current socket server:

- accepts `joinTicket(ticketId)`
- joins the room directly
- does not validate the user or ticket access inside the socket layer

That means authorization is enforced on REST endpoints, but not on room subscription itself.

### 11.3 Socket uses open CORS

Backend socket server uses:

- `origin: "*"`

and app HTTP CORS is also open.

### 11.4 Status auto-change only emits inside `newMessage`

When staff replies to an `open` ticket:

- backend changes status to `in_progress`
- but does not emit a separate `statusUpdated` event for that auto-change
- instead it sends `newStatus` inside `newMessage`

The admin UI already depends on this behavior.

### 11.5 Backend does not validate message length in `sendMessage`

`createTicket` has strong validation for first message.
`sendMessage` currently does not validate:

- empty string beyond frontend trim check
- max length
- min length

So API-side reply validation is weaker than ticket creation validation.

### 11.6 Country admin UI references `ticket.priority`

`CountrySupport.jsx` styles cards using `ticket.priority`, but `Ticket` model currently has no `priority` field in Prisma and controller does not add one.

Result:

- this field is effectively undefined in current backend responses

### 11.7 `closed` exists in schema but not in UI flow

The schema supports `closed`, but:

- admin status buttons only expose `OPEN`, `IN-PROGRESS`, `RESOLVED`
- controller transition logic is built around those three practical states

## 12. Quick endpoint summary

| Method | Path | Purpose | Used by admin chat |
| --- | --- | --- | --- |
| `POST` | `/api/tickets` | Create ticket | No |
| `GET` | `/api/tickets` | Get current user's tickets | No |
| `GET` | `/api/tickets/admin` | Get admin/superadmin ticket list | Yes |
| `GET` | `/api/tickets/superadmin/all` | Get all tickets with full history | Not currently used |
| `GET` | `/api/tickets/:id` | Get one ticket with full messages | Yes |
| `POST` | `/api/tickets/:id/messages` | Send chat message | Yes |
| `PATCH` | `/api/tickets/:id/status` | Change ticket status | Yes |

## 13. Quick socket summary

| Event | Direction | Payload purpose |
| --- | --- | --- |
| `joinTicket` | client -> server | subscribe to `ticket:<ticketId>` room |
| `newMessage` | server -> room | append new message and optionally move status to `in_progress` |
| `statusUpdated` | server -> room | sync explicit status changes |

## 14. Short conclusion

The current support ticket system is REST-first with Socket.IO used as a live update layer.

The most important chat endpoints are:

- `GET /api/tickets/admin`
- `GET /api/tickets/:id`
- `POST /api/tickets/:id/messages`
- `PATCH /api/tickets/:id/status`

The most important socket pieces are:

- `joinTicket`
- room name `ticket:<ticketId>`
- `newMessage`
- `statusUpdated`

If someone wants to understand "where messages come from", the answer is:

- initial chat history comes from `GET /api/tickets/:id`
- live incremental chat updates come from the `newMessage` socket event
