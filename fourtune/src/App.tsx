import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/common/Layout';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import AuctionList from './pages/AuctionList/AuctionList';
import AuctionDetail from './pages/AuctionDetail/AuctionDetail';
import MyPage from './pages/MyPage/MyPage.tsx';

function App() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<Layout />}>
                <Route index element={<AuctionList />} />
                <Route path="auctions/:id" element={<AuctionDetail />} />
                <Route path="mypage" element={<MyPage />} />
            </Route>
        </Routes>
    );
}

export default App;
