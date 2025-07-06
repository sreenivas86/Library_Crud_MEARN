
import "./App.css";




import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./components/AppRoutes";
import NavigationBar from "./components/NavigationBar";
// import EditBook from './components/EditBook'

function App() {
  return (
    <div >
      <BrowserRouter>
        <NavigationBar/>
        <AppRoutes/>
      </BrowserRouter>
      

      
    </div>
  );
}

export default App;
