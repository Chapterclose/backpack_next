"use client"

import BuySell from '@/components/Trade/BuySell';
import RealTimePriceDisplay from '@/components/Trade/RealTimePriceDisplay';
import StockChart from '@/components/Trade/StockChart';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export default function TradePage() {
  const searchParams = useSearchParams()
  const coin = searchParams.get("symbol")
  const [currentPrice, setCurrentPrice] = useState('0.00');
  const [priceChangePercentage, setPriceChangePercentage] = useState('0.00');
  const [highPrice, setHighPrice] = useState('0.00');
  const [lowPrice, setLowPrice] = useState('0.00');
  const [volume, setVolume] = useState(0);

  const [error, setError] = useState(null); 

  const wsRef = useRef(null); 
  const tickerReconnectTimeoutRef = useRef(null);

  useEffect(() => {
    if (wsRef.current) {
      if (tickerReconnectTimeoutRef.current) {
        clearTimeout(tickerReconnectTimeoutRef.current);
        tickerReconnectTimeoutRef.current = null;
      }
      wsRef.current.close();
    }

    // WebSocket for 24hr Ticker Statistics (@ticker stream)
    wsRef.current = new WebSocket(`wss://stream.binance.com:9443/ws/${coin}usdt@ticker`);
    wsRef.current.onopen = () => {
      console.log('Binance Ticker WebSocket Connected');
      setError(null);
      if (tickerReconnectTimeoutRef.current) {
        clearTimeout(tickerReconnectTimeoutRef.current);
        tickerReconnectTimeoutRef.current = null;
      }
    };
    wsRef.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setCurrentPrice(parseFloat(message.c).toFixed(2));
      setPriceChangePercentage(parseFloat(message.P).toFixed(2));
      setHighPrice(parseFloat(message.h).toFixed(2));
      setLowPrice(parseFloat(message.l).toFixed(2));
      setVolume(parseFloat(message.v));
    };
    wsRef.current.onerror = (event) => {
      console.error('Binance Ticker WebSocket Error:', event);
      setError('Real-time data connection error for ticker data. Please check console for details.');
    };
    wsRef.current.onclose = (event) => {
      console.log('Binance Ticker WebSocket Disconnected:', event.code, event.reason);
      if (event.code !== 1000 && event.code !== 1001 && !tickerReconnectTimeoutRef.current) {
        setError('Real-time ticker data disconnected. Attempting to reconnect...');
        tickerReconnectTimeoutRef.current = setTimeout(() => {
          console.log('Attempting to reconnect Ticker WebSocket...');
          wsRef.current.close(); 
        }, 3000);
      }
    };

    return () => {
      if (wsRef.current) {
        if (tickerReconnectTimeoutRef.current) {
          clearTimeout(tickerReconnectTimeoutRef.current);
          tickerReconnectTimeoutRef.current = null;
        }
        wsRef.current.close();
      }
    };
  }, []); 

  return (
    <div className='container py-[40px] lg:py-[60px]'>
        <RealTimePriceDisplay
        coin={coin}
        currentPrice={currentPrice}
        priceChangePercentage={priceChangePercentage}
        highPrice={highPrice}
        lowPrice={lowPrice}
        volume={volume}
      />

        <div className='mt-10'>
            <StockChart
            highPrice={highPrice}
            lowPrice={lowPrice}
            volume={volume}
            />
        </div>

        <BuySell coin={coin}/>
    </div>
  );
}