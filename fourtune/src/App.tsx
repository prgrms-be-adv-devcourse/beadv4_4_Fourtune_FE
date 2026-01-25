import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/common/Layout';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import Home from './pages/Home/Home';
import AuctionList from './pages/AuctionList/AuctionList';
import AuctionDetail from './pages/AuctionDetail/AuctionDetail';
import MyPage from './pages/MyPage/MyPage.tsx';
import CreateAuction from './pages/CreateAuction/CreateAuction';
import Payment from './pages/Payment/Payment';
import PaymentSuccess from './pages/Payment/PaymentSuccess';
import PaymentFail from './pages/Payment/PaymentFail';
import Cart from './pages/Cart/Cart';

function App() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="auctions" element={<AuctionList />} />
                <Route path="auctions/create" element={<CreateAuction />} />
                <Route path="auctions/:id" element={<AuctionDetail />} />
                <Route path="cart" element={<Cart />} />
                <Route path="mypage" element={<MyPage />} />
                <Route path="payment" element={<Payment />} />
                <Route path="payment/success" element={<PaymentSuccess />} />
                <Route path="payment/fail" element={<PaymentFail />} />
            </Route>
        </Routes>
    );
}

export default App;
