import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, Clock, TrendingDown, TrendingUp, XCircle } from "lucide-react";

const openOrders = [
  {
    id: "1",
    type: "buy",
    symbol: "BTC/USDT",
    amount: 0.0125,
    price: 48500,
    total: 606.25,
    status: "pending",
    timestamp: new Date(),
    timeframe: "60s",
    pnl: 125.5,
  },
  {
    id: "2",
    type: "sell",
    symbol: "BTC/USDT",
    amount: 0.025,
    price: 47800,
    total: 1195,
    status: "pending",
    timestamp: new Date(Date.now() - 300000),
    timeframe: "1d",
    pnl: -45.3,
  },
];

const orderHistory = [
  {
    id: "3",
    type: "buy",
    symbol: "BTC/USDT",
    amount: 0.01,
    price: 46500,
    total: 465,
    status: "completed",
    timestamp: new Date(Date.now() - 3600000),
    timeframe: "12h",
  },
  {
    id: "4",
    type: "sell",
    symbol: "BTC/USDT",
    amount: 0.02,
    price: 48000,
    total: 960,
    status: "completed",
    timestamp: new Date(Date.now() - 7200000),
    timeframe: "7d",
  },
  {
    id: "5",
    type: "buy",
    symbol: "BTC/USDT",
    amount: 0.015,
    price: 45000,
    total: 675,
    status: "cancelled",
    timestamp: new Date(Date.now() - 86400000),
    timeframe: "15d",
  },
];

export const OrderHistory = () => {
  return (
    <Card className="p-3 sm:p-6 dark:text-white mt-15">
      <Tabs defaultValue="open" className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-9 sm:h-10">
          <TabsTrigger value="open" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
            <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden xs:inline">Open Orders</span>
            <span className="xs:hidden">Open</span>
            <span className="ml-1">({openOrders.length})</span>
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
          >
            <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden xs:inline">Order History</span>
            <span className="xs:hidden">History</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="open" className="mt-3 sm:mt-4">
          <OrderTable orders={openOrders} showPnL={true} />
        </TabsContent>

        <TabsContent value="history" className="mt-3 sm:mt-4">
          <OrderTable orders={orderHistory} showPnL={false} />
        </TabsContent>
      </Tabs>
    </Card>
  );
};

const OrderTable = ({ orders, showPnL }) => {
  if (orders.length === 0) {
    return (
      <div className="text-center py-6 sm:py-8 text-muted-foreground">
        <p className="text-sm sm:text-base">No orders found</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Desktop Header - Hidden on mobile */}
      <div className="hidden lg:grid grid-cols-6 gap-4 px-4 py-2 text-sm font-medium text-muted-foreground border-b">
        <div>Type/Symbol</div>
        <div>Amount</div>
        <div>Price</div>
        <div>Total</div>
        <div>Status</div>
        {showPnL ? <div>P&L</div> : <div>Time</div>}
      </div>

      {/* Orders */}
      <div className="space-y-2">
        {orders.map((order) => (
          // Desktop Layout
          <div
            key={order.id}
            className="hidden lg:grid grid-cols-6 gap-4 px-4 py-3 hover:bg-muted/50 rounded-lg transition-colors"
          >
            <div className="flex items-center gap-2">
              {order.type === "buy" ? (
                <TrendingUp className="w-4 h-4 text-trading-buy" />
              ) : (
                <TrendingDown className="w-4 h-4 text-trading-sell" />
              )}
              <div>
                <div
                  className={`font-medium ${
                    order.type === "buy" ? "text-trading-buy" : "text-trading-sell"
                  }`}
                >
                  {order.type.toUpperCase()}
                </div>
                <div className="text-sm text-muted-foreground">{order.symbol}</div>
              </div>
            </div>

            <div className="font-mono text-sm">{order.amount.toFixed(6)} BTC</div>

            <div className="font-mono text-sm">${order.price.toLocaleString()}</div>

            <div className="font-mono text-sm">${order.total.toLocaleString()}</div>

            <div>
              <Badge
                variant={
                  order.status === "completed"
                    ? "default"
                    : order.status === "pending"
                    ? "secondary"
                    : "destructive"
                }
                className={
                  order.status === "completed"
                    ? "bg-success text-success-foreground"
                    : order.status === "pending"
                    ? "bg-warning text-warning-foreground"
                    : ""
                }
              >
                {order.status === "completed" && <CheckCircle className="w-3 h-3 mr-1" />}
                {order.status === "pending" && <Clock className="w-3 h-3 mr-1" />}
                {order.status === "cancelled" && <XCircle className="w-3 h-3 mr-1" />}
                {order.status}
              </Badge>
            </div>

            <div className="text-sm">
              {showPnL && order.pnl !== undefined ? (
                <div
                  className={`font-mono ${
                    order.pnl >= 0 ? "text-trading-buy" : "text-trading-sell"
                  }`}
                >
                  {order.pnl >= 0 ? "+" : ""}${order.pnl.toFixed(2)}
                </div>
              ) : (
                <div className="text-muted-foreground">
                  {order.timestamp.toLocaleDateString()}
                  <br />
                  <span className="text-xs">{order.timestamp.toLocaleTimeString()}</span>
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Mobile Layout */}
        {orders.map((order) => (
          <div
            key={`mobile-${order.id}`}
            className="lg:hidden bg-card border rounded-lg p-3 space-y-3"
          >
            {/* Header Row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {order.type === "buy" ? (
                  <TrendingUp className="w-4 h-4 text-trading-buy" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-trading-sell" />
                )}
                <div>
                  <div
                    className={`font-semibold text-sm ${
                      order.type === "buy" ? "text-trading-buy" : "text-trading-sell"
                    }`}
                  >
                    {order.type.toUpperCase()} {order.symbol}
                  </div>
                  <div className="text-xs text-muted-foreground">{order.timeframe}</div>
                </div>
              </div>
              <Badge
                variant={
                  order.status === "completed"
                    ? "default"
                    : order.status === "pending"
                    ? "secondary"
                    : "destructive"
                }
                className={`text-xs ${
                  order.status === "completed"
                    ? "bg-success text-success-foreground"
                    : order.status === "pending"
                    ? "bg-warning text-warning-foreground"
                    : ""
                }`}
              >
                {order.status === "completed" && <CheckCircle className="w-3 h-3 mr-1" />}
                {order.status === "pending" && <Clock className="w-3 h-3 mr-1" />}
                {order.status === "cancelled" && <XCircle className="w-3 h-3 mr-1" />}
                {order.status}
              </Badge>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <div className="text-muted-foreground">Amount</div>
                <div className="font-mono text-sm">{order.amount.toFixed(4)} BTC</div>
              </div>
              <div>
                <div className="text-muted-foreground">Price</div>
                <div className="font-mono text-sm">${order.price.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Total</div>
                <div className="font-mono text-sm font-semibold">
                  ${order.total.toLocaleString()}
                </div>
              </div>
              <div>
                {showPnL && order.pnl !== undefined ? (
                  <>
                    <div className="text-muted-foreground">P&L</div>
                    <div
                      className={`font-mono text-sm font-semibold ${
                        order.pnl >= 0 ? "text-trading-buy" : "text-trading-sell"
                      }`}
                    >
                      {order.pnl >= 0 ? "+" : ""}${order.pnl.toFixed(2)}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-muted-foreground">Time</div>
                    <div className="text-muted-foreground text-xs">
                      {order.timestamp.toLocaleDateString()}
                      <br />
                      {order.timestamp.toLocaleTimeString()}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
