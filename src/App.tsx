import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ItemSelector } from "./ItemSelector";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ItemSelector />
    </QueryClientProvider>
  );
}

export default App;
