"use client";

import { useEffect, useRef } from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { v4 as uuidv4 } from "uuid";
import { useFetchData } from "./mutations";
import SymbolCardsSkeleton from "./SymbolCardSkeleton";

const PING_INTERVAL = 50000;
const uniqueId = uuidv4();

export default function SymbolCard() {
  const { data: symbolsArray, status } = useFetchData();
  console.log("symbols", symbolsArray);
  const socketRef = useRef<WebSocket | null>(null);
  const pingIntervalRef = useRef<number>(0);

  const startPingInterval = () => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      const subscribeMessage = {
        id: uniqueId,
        method: "lastprice_subscribe",
        params: ["CYBER_USDT"], // Use the correct symbol here
      };
      socketRef.current.send(JSON.stringify(subscribeMessage));
      // Then, start sending ping messages.
      pingIntervalRef.current = window.setInterval(() => {
        socketRef.current?.send(
          JSON.stringify({ id: uniqueId, method: "lastprice_subscribe" })
        );
      }, PING_INTERVAL);
    }
  };

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.close();
    }

    try {
      const socket = new WebSocket("wss://api.whitebit.com/ws");
      socketRef.current = socket;

      socket.onopen = () => {
        startPingInterval();
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log(`Received: ${JSON.stringify(data, null, 2)}`);
        } catch (e) {
          console.log(`Received raw: ${event.data}`);
        }
      };

      socket.onclose = () => {
        console.log("Disconnected from WebSocket server");
        if (pingIntervalRef.current) {
          clearInterval(pingIntervalRef.current);
        }
      };

      socket.onerror = (error) => {
        console.log(`Error: ${error.type}`);
      };
    } catch (error) {
      console.log(`Error: ${error}`);
    }
  }, []);

  if (status === "loading") {
    return <SymbolCardsSkeleton />;
  }

  if (status === "error") {
    return <h2>Something went wrong!</h2>;
  }

  return (
    <>
      {symbolsArray.map((symbol) => (
        <Card className="max-w-[300px] mx-auto w-full" key={symbol.name}>
          <CardHeader>
            <CardTitle>Name:</CardTitle>
            <CardDescription>Stock:</CardDescription>
          </CardHeader>
        </Card>
      ))}
    </>
  );
}
