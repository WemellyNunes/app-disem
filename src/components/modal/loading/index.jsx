// components/modal/Loading.js
import { Circles } from 'react-loader-spinner';

export default function Loading() {
    return (
        <div className="flex flex-col ml-16 fixed h-full w-10/12 items-center justify-center bg-white bg-opacity-80 z-50">
            <div className="flex  items-center text-center mb-4">
                <Circles
                    ariaLabel="loading-indicator"
                />
            </div>
            <div className='text-sm text-primary-dark'>
                SALVANDO DADOS...
            </div>
        </div>
    );
}
