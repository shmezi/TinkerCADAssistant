Multiplexer - Multiplexes all clients, allow clients to send each other messages, it SHOULD NOT include a command executor.
IT SHOULD NOT, Include any logic that is related to worker related commandexectors.

CommandClient - Abstract form of the client, that can be implemented on both the worker platform as well as the content scripts.

CommandExecutor - Runtime to actually execute commands and interact with the layer above, The command executor MAY use platform sepcific items such as sending to a tab