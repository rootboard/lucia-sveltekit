---
order: 0
layout: "@layouts/DocumentLayout.astro"
title: "Database model"
---

Lucia uses adapters to connect to your database. The following chart shows the basic structure of the database, though they may vary from database to database. The names of the tables and columns cannot be altered.

## `user`

The `user` table stores the users. The `[any]` column represents the any number of columns you can add to store additional user attributes. Refer to [Store user attributes](/learn/basics/store-user-attributes). For `id`, use a auto-generated uuid/cuid, or `string` if you generate your own user id.

| name            | type               | description                                                      | reference |
| --------------- | ------------------ | ---------------------------------------------------------------- | --------- |
| id              | string (uuid/cuid) | Should be auto-generated UUID or similar by defaults             |           |
| provider_id     | string             | Stores the provider id using the form: `providerName:identifier` |           |
| hashed_password | string \| null     | `null` if the user doesn't have a password                       |           |
| [any]           | any                | This represents any number of columns of any name                |           |

### Schema type

```ts
// type imported from "lucia-sveltekit/adapter"
export type UserSchema = {
    id: string;
    hashed_password: string | null;
    provider_id: string;
} & Lucia.UserAttributes;
```

## `session`

The `session` table stores the user's sessions (including the access token).

| name         | type          | description                                        | reference |
| ------------ | ------------- | -------------------------------------------------- | --------- |
| id           | string        |                                                    |           |
| user_id      | string        |                                                    | user.id   |
| expires      | number (int8) | The expiration time (unix) of the session (active) |           |
| idle_expires | number (int8) | The expiration time (unix) for the idle period     |           |

### Schema type

```ts
// type imported from "lucia-sveltekit/adapter"
export type SessionSchema = {
    id: string;
    expires: number;
    idle_expires: number;
    user_id: string;
};
```
