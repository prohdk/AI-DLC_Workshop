import asyncio
import json
import uuid


class SSEManager:
    def __init__(self):
        self._connections: dict[str, asyncio.Queue] = {}

    def subscribe(self) -> tuple[str, asyncio.Queue]:
        conn_id = str(uuid.uuid4())
        queue: asyncio.Queue = asyncio.Queue()
        self._connections[conn_id] = queue
        return conn_id, queue

    def unsubscribe(self, conn_id: str) -> None:
        self._connections.pop(conn_id, None)

    async def publish(self, event_type: str, data: dict) -> None:
        payload = json.dumps(data, ensure_ascii=False)
        dead = []
        for conn_id, queue in self._connections.items():
            try:
                queue.put_nowait({"event": event_type, "data": payload})
            except Exception:
                dead.append(conn_id)
        for conn_id in dead:
            self._connections.pop(conn_id, None)

    @property
    def connection_count(self) -> int:
        return len(self._connections)


sse_manager = SSEManager()
