# ws-proxy
Copyright (C) 2011 by Maciej Małecki  
MIT License (see LICENSE file)

WebSocket proxy using super fast [`ws`](https://github.com/einaros/ws) module.

## Installation

    npm install ws-proxy

## Usage
### Command line

    ws-proxy --port 9000 --target ws://localhost:8000

It will start proxy at port `9000`, proxying messages to `ws://localhost:8000`.


