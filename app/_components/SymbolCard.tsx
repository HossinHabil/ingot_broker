"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ApiResponse } from "@/utils/types";
import { Loader2 } from "lucide-react";

const PING_INTERVAL = 5000;

type SymbolType = "sell" | "buy";

interface Trade {
  id: number;
  time: number;
  price: string;
  amount: string;
  type: SymbolType;
}

interface ResultData {
  method: string;
  params: [name: string, trades: Trade[]];
  id: number;
}

export default function SymbolCard({ item }: { item: ApiResponse }) {
  const socketRef = useRef<WebSocket | null>(null);
  const pingIntervalRef = useRef<number>(0);
  const messageIdRef = useRef(0);

  const [result, setResult] = useState<ResultData | null>(null);
  const [connectionStatus, setConnectionStatus] = useState("Connecting...");
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback((message: object) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(message));
    }
  }, []);

  const startPingInterval = useCallback(() => {
    pingIntervalRef.current = window.setInterval(() => {
      const pingMessage = {
        id: messageIdRef.current++,
        method: "ping",
        params: [],
      };
      sendMessage(pingMessage);
    }, PING_INTERVAL);
  }, [sendMessage]);

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.close();
    }

    const socket = new WebSocket("wss://api.whitebit.com/ws");
    socketRef.current = socket;

    socket.onopen = () => {
      setConnectionStatus("Connected");
      startPingInterval();

      const subscriptionMessage = {
        id: messageIdRef.current++,
        method: "trades_subscribe",
        params: [item.name],
      };
      sendMessage(subscriptionMessage);
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.method === "trades_update" && Array.isArray(data.params)) {
          setResult(data);
        } else if (data.result === "pong") {
          console.log("Received pong");
        } else {
          console.log("Unhandled message:", data);
        }
      } catch (e) {
        console.error("Failed to parse message:", event.data);
      }
    };

    socket.onclose = () => {
      setConnectionStatus("Disconnected");
      clearInterval(pingIntervalRef.current);
    };

    socket.onerror = (error) => {
      setError(`WebSocket Error: ${error.type}`);
    };

    return () => {
      socketRef.current?.close();
      clearInterval(pingIntervalRef.current);
    };
  }, [startPingInterval, item.name, sendMessage]);

  if (error) {
    return (
      <Card className="w-[300px] h-[200px] flex flex-col justify-center items-center">
        <p>Something went wrong!</p>
      </Card>
    );
  }

  if (!result) {
    return (
      <Card className="w-[300px] h-[200px] flex flex-col justify-center items-center">
        <Loader2 className="animate-spin my-3 mx-auto size-5" />
      </Card>
    );
  }

  return (
    <Card className="w-[300px] h-[200px]">
      <CardHeader>
        <CardTitle>{item.name}</CardTitle>
        <CardDescription>{connectionStatus}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <p className="font-semibold">
          Price: {result.params[1][0]?.price || "N/A"}
        </p>
        <p className="font-semibold">
          Type:{" "}
          <span
            className={`${
              result.params[1][0]?.type === "sell"
                ? "bg-red-500"
                : "bg-green-500"
            } p-2 rounded-md text-primary-foreground`}
          >
            {result.params[1][0]?.type || "N/A"}
          </span>
        </p>
      </CardContent>
    </Card>
  );
}
