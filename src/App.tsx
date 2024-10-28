import { ThemeProvider } from "./contexts/ThemeContext";
import { Layout } from "./components/Layout";
import { AppRoutes } from "./AppRoutes";
import { BrowserRouter } from "react-router-dom";

function App() {

  return (
    <BrowserRouter>
      <ThemeProvider>
        <Layout>
          <AppRoutes />
        </Layout>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;