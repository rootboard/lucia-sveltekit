---
order: 1
layout: "@layouts/DocumentLayout.astro"
title: "Custom adapters"
---

Adapters are just objects with a handful of methods that interact with the database. This makes it pretty easy to create your own and support any databases. Adapters can throw errors as well.

Refer to [Database model](/reference/adapters/database-model) for database model and types.

```ts
// type imported from "lucia-sveltekit/adapter"
interface Adapter {
    deleteSession: (...sessionIds: string[]) => Promise<void>;
    deleteSessionsByUserId: (userId: string) => Promise<void>;
    deleteUser: (userId: string) => Promise<void>;
    getSession: (sessionId: string) => Promise<SessionSchema | null>;
    getSessionAndUserBySessionId: (sessionId: string) => Promise<{
        user: UserSchema;
        session: SessionSchema;
    } | null>;
    getSessionsByUserId: (userId: string) => Promise<SessionSchema[]>;
    getUser: (userId: string) => Promise<UserSchema | null>;
    getUserByProviderId: (providerId: string) => Promise<UserSchema | null>;
    setSession: (
        sessionId: string,
        data: {
            userId: string;
            expires: number;
            idlePeriodExpires: number;
        }
    ) => Promise<void>;
    setUser: (
        userId: string | null,
        data: {
            providerId: string;
            hashedPassword: string | null;
            attributes: Record<string, any>;
        }
    ) => Promise<UserSchema>;
    updateUser: (
        userId: string,
        data: {
            providerId?: string | null;
            hashedPassword?: string | null;
            attributes?: Record<string, any>;
        }
    ) => Promise<UserSchema>;
}
```

The return types must be exactly conform to the documentation.

## `deleteSession()`

Deletes a session (`session` table) with the session id. Succeeds regardless of the validity of the session id.

```ts
const deleteSession: (sessionId: string) => Promise<void>;
```

#### Parameter

| name      | type     | description                  |
| --------- | -------- | ---------------------------- |
| sessionId | `string` | unique target: `session(id)` |

## `deleteSessionsByUserId()`

Deletes multiple session (`session` table) with the user id. Succeeds regardless of the validity of the user id.

```ts
const deleteSessionsByUserId: (userId: string) => Promise<void>;
```

#### Parameter

| name   | type     | description                |
| ------ | -------- | -------------------------- |
| userId | `string` | target: `session(user_id)` |

## `deleteUser()`

Deletes a user (`user` table) with the user id. Succeeds regardless of the validity of the user id.

```ts
const deleteUser: (userId: string) => Promise<void>;
```

#### Parameter

| name   | type     | description               |
| ------ | -------- | ------------------------- |
| userId | `string` | unique target: `user(id)` |

## `getSession()`

Gets a session (`session` table) with the session id.

```ts
const getSession: (sessionId: string) => Promise<SessionSchema | null>;
```

#### Parameter

| name      | type     | description                  |
| --------- | -------- | ---------------------------- |
| sessionId | `string` | unique target: `session(id)` |

#### Returns

If the session exists

| type                                                                | description            |
| ------------------------------------------------------------------- | ---------------------- |
| [`SessionSchema`](/reference/adapters/database-model#schema-type-1) | Session data of target |

If the session doesn't exist

| type   |
| ------ |
| `null` |

## `getSessionAndUserBySessionId()`

Gets a session (`session` table) and user (`user` table) with the session id. Returns `null` if the session doesn't exist.

```ts
const getSessionAndUserBySessionId: (sessionId: string) => Promise<{
    user: UserSchema;
    session: SessionSchema;
} | null>;
```

#### Parameter

| name      | type     | description                  |
| --------- | -------- | ---------------------------- |
| sessionId | `string` | unique target: `session(id)` |

#### Returns

If the session exists

| name    | type                                                                | description                                       |
| ------- | ------------------------------------------------------------------- | ------------------------------------------------- |
| user    | [`UserSchema`](/reference/adapters/database-model#schema-type)      | User data of target: `user(id:session(user_id)`)` |
| session | [`SessionSchema`](/reference/adapters/database-model#schema-type-1) | Session data of target                            |

If the session doesn't exist

| type   |
| ------ |
| `null` |

## `getSessionsByUserId()`

Gets sessions (`session` table`) with the user id.

```ts
const getSessionsByUserId: (userId: string) => Promise<SessionSchema | null>;
```

#### Parameter

| name   | type     | description                |
| ------ | -------- | -------------------------- |
| userId | `string` | target: `session(user_id)` |

#### Returns

If the session exists

| type                                                                | description            |
| ------------------------------------------------------------------- | ---------------------- |
| [`SessionSchema`](/reference/adapters/database-model#schema-type-1) | Session data of target |

If the session doesn't exist

| type   |
| ------ |
| `null` |

## `getUser()`

Gets a user (`user` table) with the user id. Returns `null` is the user doesn't exist.

```ts
const getUser: (userId: string) => Promise<UserSchema | null>;
```

#### Parameter

| name   | type     | description               |
| ------ | -------- | ------------------------- |
| userId | `string` | unique target: `user(id)` |

#### Returns

If the user exists

| type                                                           | description         |
| -------------------------------------------------------------- | ------------------- |
| [`UserSchema`](/reference/adapters/database-model#schema-type) | User data of target |

If the user doesn't exist

| type   |
| ------ |
| `null` |

## `getUserByProviderId()`

Gets a user (`user` table) with the provider id. Returns `null` if the user doesn't exist.

```ts
const getUserByProviderId: (providerId: string) => Promise<UserSchema | null>;
```

#### Parameter

| name       | type     | description                        |
| ---------- | -------- | ---------------------------------- |
| providerId | `string` | unique target: `user(provider_id)` |

#### Returns

If the user exists

| type                                                           | description         |
| -------------------------------------------------------------- | ------------------- |
| [`UserSchema`](/reference/adapters/database-model#schema-type) | User data of target |

If the user doesn't exist

| type   |
| ------ |
| `null` |

## `setSession()`

Creates a new session in `session` table.

```ts
const setSession: (
    sessionId: string,
    data: {
        userId: string;
        expires: number;
        idlePeriodExpires: number;
    }
) => Promise<void>;
```

#### Parameter

| name                   | type                  | description                     |
| ---------------------- | --------------------- | ------------------------------- |
| sessionId              | `string`              | unique target: `session(id)`    |
| data.userId            | `string`              | target: `session(user_id)`      |
| data.expires           | `string \| null`      | target: `session(expires)`      |
| data.idlePeriodExpires | `Record<string, any>` | target: `session(idle_expires)` |

## `setUser()`

Creates a new user in `user` table. Each values of `data.attributes` should be stored in the column of the key name.

```ts
const setUser: (
    userId: string,
    data: {
        providerId: string;
        hashedPassword: string | null;
        attributes: Record<string, any>;
    }
) => Promise<UserSchema>;
```

#### Parameter

| name                | type                  | description                                     |
| ------------------- | --------------------- | ----------------------------------------------- |
| userId              | `string`              | unique target: `user(id)`                       |
| data.providerId     | `string`              | target: `user(provider_id)`                     |
| data.hashedPassword | `string \| null`      | target: `user(hashed_password)`                 |
| data.attributes     | `Record<string, any>` | Each key names as [key] - target: `user([key])` |

#### Returns

| type                                                           | description              |
| -------------------------------------------------------------- | ------------------------ |
| [`UserSchema`](/reference/adapters/database-model#schema-type) | Data of the created user |

## `updateUser()`

Updates a user (`user` table) with the user id. Only the target to update will be provided in `data` and some key/values inside `data` and `data.attributes` may be undefined. Keys in `data` with a value of `undefined` should be ignored, while `null` should not.

```ts
const updateUser: (
    userId: string,
    data: {
        providerId?: string | null;
        hashedPassword?: string | null;
        attributes?: Record<string, any>;
    }
) => Promise<UserSchema>;
```

#### Parameter

| name                | type                  | description                                     | optional |
| ------------------- | --------------------- | ----------------------------------------------- | -------- |
| userId              | `string`              | unique target: `user(id)`                       |          |
| data.providerId     | `string`              | target: `user(provider_id)`                     | true     |
| data.hashedPassword | `string \| null`      | target: `user(hashed_password)`                 | true     |
| data.attributes     | `Record<string, any>` | Each key names as [key] - target: `user([key])` | true     |

#### Returns

| type                                                           | description              |
| -------------------------------------------------------------- | ------------------------ |
| [`UserSchema`](/reference/adapters/database-model#schema-type) | Data of the updated user |
