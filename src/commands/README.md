# Command system

Each content script creates one named client when it starts:

```ts
const client = new CommandClient("main")
```

The service worker remembers which tab owns each client ID and handles routing automatically.

## Creating a command

Extend `Command`. The first generic is the arguments received by `execute`; the second is its response:

```ts
interface AddArgs {
    first: number
    second: number
}

class AddCommand extends Command<AddArgs, number> {
    constructor() {
        super("add")
    }

    execute(args: AddArgs): number {
        return args.first + args.second
    }
}
```

Create the command once, on the client that handles it:

```ts
const apiClient = new CommandClient("api")
apiClient.register(new AddCommand())
```

## Sending a command

Send the destination ID, command name, and execute arguments:

```ts
const response = await client.sendCommand<number, AddArgs>(
    "api",
    "add",
    {first: 10, second: 5},
)

if (response.ok) console.log(response.data) // 15
else console.error(response.error)
```

No command instance is created by the sender. `"worker"` targets the service worker:

```ts
const response = await client.sendCommand<boolean, void>(
    "worker",
    "is-ready",
    undefined,
)
```

You can also send directly to a Chrome tab ID instead of a registered client name:

```ts
const response = await client.sendCommand<number, AddArgs>(
    tabId,
    "add",
    {first: 10, second: 5},
)
```

When targeting a tab number, the client in that tab which registered `"add"` handles the command.

The service worker uses the same syntax:

```ts
const response = await commandServer.sendCommand<number, AddArgs>(
    "api",
    "add",
    {first: 2, second: 3},
)
```

Responses contain `id`, `ok`, `data`, and `error`. Promises and thrown errors from `execute` are handled automatically.
