import { useState, useEffect, useRef, useCallback } from 'react';

export function useWebSocket(url, onMessage) {
    const [isConnected, setIsConnected] = useState(false);
    const wsRef = useRef(null);
    const onMessageRef = useRef(onMessage);

    useEffect(() => {
        onMessageRef.current = onMessage;
    }, [onMessage]);

    const connect = useCallback(() => {
        const token = localStorage.getItem('access_token');
        if (!token) return;

        const wsUrl = `${url}?token=${token}`;
        const ws = new WebSocket(wsUrl);

        ws.onopen = () => {
            console.log('WebSocket Connected:', wsUrl);
            setIsConnected(true);
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (onMessageRef.current) {
                onMessageRef.current(data);
            }
        };

        ws.onclose = () => {
            console.log('WebSocket Disconnected:', wsUrl);
            if (wsRef.current === ws) {
                setIsConnected(false);
                // Optionally implement reconnect logic here
                setTimeout(connect, 3000);
            }
        };

        ws.onerror = (error) => {
            console.error('WebSocket Error:', error);
            if (wsRef.current === ws) {
                ws.close();
            }
        };

        wsRef.current = ws;
    }, [url]);

    useEffect(() => {
        connect();
        return () => {
            if (wsRef.current) {
                const ws = wsRef.current;
                wsRef.current = null;
                ws.close();
            }
        };
    }, [connect]);

    const sendMessage = useCallback((message) => {
        if (wsRef.current && isConnected) {
            wsRef.current.send(JSON.stringify(message));
        }
    }, [isConnected]);

    return { isConnected, sendMessage };
}
