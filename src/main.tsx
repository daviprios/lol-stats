import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { compress, decompress } from "lz-string";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";

import moment from "moment";
import "moment/dist/locale/pt-br";
moment.locale("pt-br");

import MatchContext from "./contexts/matchContext";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: Infinity } },
});

persistQueryClient({
  queryClient: queryClient,
  persister: createSyncStoragePersister({
    storage: window.localStorage,
    serialize: (data) => compress(JSON.stringify(data)),
    deserialize: (data) => JSON.parse(decompress(data)),
  }),
  maxAge: Infinity,
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <MatchContext>
        <App />
      </MatchContext>
    </QueryClientProvider>
  </React.StrictMode>
);
