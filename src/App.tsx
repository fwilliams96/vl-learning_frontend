import { ThemeProvider } from "./contexts/ThemeContext";
import { Layout } from "./components/Layout";
import { AppRoutes } from "./AppRoutes";
import { BrowserRouter } from "react-router-dom";
import { ScrollToTop } from "./components/ScrollToTop";
function App() {

  return (
    <BrowserRouter>
      <ThemeProvider>
        <Layout>
          <ScrollToTop />
          <AppRoutes />
        </Layout>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;