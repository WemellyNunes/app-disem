// components/modal/Loading.js
import { Circles } from 'react-loader-spinner';

export default function Loading() {
    return (
        <div className="flex flex-col fixed h-full w-full items-center justify-center bg-white bg-opacity-50 inset-0 z-50">
            <div className="flex  items-center text-center mb-4">
                <Circles
                    ariaLabel="loading-indicator"
                    width={50}
                    height={50}
                    color='#1351b4'
                />
            </div>
            <div className='text-sm text-primary-dark'>
                SALVANDO DADOS...
            </div>
        </div>
    );
}
