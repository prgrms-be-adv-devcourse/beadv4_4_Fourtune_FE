import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const PaymentFail: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const code = searchParams.get('code');
    const message = searchParams.get('message');

    return (
        <div style={{ textAlign: 'center', padding: '4rem' }}>
            <h1 style={{ color: '#e03131' }}>결제 실패</h1>
            <p><strong>에러 코드:</strong> {code}</p>
            <p><strong>사유:</strong> {message}</p>
            <div style={{ marginTop: '2rem' }}>
                <button
                    onClick={() => navigate(-1)}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#333',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    다시 시도하기
                </button>
            </div>
        </div>
    );
};

export default PaymentFail;
