import './App.css';
import HeaderComponent from './components/Header';
import BodyComponent from './components/Body';
import { Layout } from 'antd';

function App() {
  return (
   <Layout>
    <HeaderComponent />
    <BodyComponent />
   </Layout>
  );
}

export default App;
