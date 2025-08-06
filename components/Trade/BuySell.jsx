import { contextProvider } from '@/contexts/Context';
import { useContext, useState } from 'react';
import Button from '../Form/Button';

function BuySell({coin}) {
    const [activePopup, setActivePopup] = useState(null);
    const [selectedPeriod, setSelectedPeriod] = useState(null);
    const [purchaseVolume, setPurchaseVolume] = useState('');
    const {walletAddress, connectWallet} = useContext(contextProvider)

    const closePopup = () => {
        setActivePopup(null);
        setSelectedPeriod(null); 
        setPurchaseVolume('');    
    };

    const handlePeriodSelect = (period) => {
        setSelectedPeriod(period);
    };

    const handleVolumeSelect = (volume) => {
        setPurchaseVolume(volume.toString()); 
    };

    const handleVolumeInputChange = (e) => {
        setPurchaseVolume(e.target.value);
    };
    const overlayClass = "fixed inset-0 bg-black/40 dark:bg-black/50 bg-opacity-50 flex items-end justify-center z-50";
    const popupContentClass = "bg-[#1E1E1E] dark:bg-gray-900 w-full max-w-md p-4 lg:p-6 rounded-t-lg shadow-lg transform transition-transform duration-300 ease-out";
    
    
    const buttonGridClass = "grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mt-4"; 
    const baseInputButtonClass = "text-white py-3 px-2 sm:px-4 rounded text-center cursor-pointer transition-colors text-xs sm:text-sm md:text-base"; 

    return (
        <div> 
            <div className='mt-10 lg:mt-14'>
                {walletAddress === "" ? <div className='text-center'><Button handleFunc={connectWallet} text={"Connect"}/></div>  : <div className='flex justify-center gap-x-4'>
                    <button
                        className="px-14 py-3 cursor-pointer bg-green-500 text-white font-bold rounded hover:bg-green-600 transition-colors"
                        onClick={() => setActivePopup('buy')}
                    >
                        Buy
                    </button>
                    <button
                        className="px-14 py-3 cursor-pointer bg-red-500 text-white font-bold rounded hover:bg-red-600 transition-colors"
                        onClick={() => setActivePopup('sell')}
                    >
                        Sell
                    </button>
                </div>}
            </div>

            {/* Buy Pop-up */}
            {activePopup === 'buy' && (
                <div className={`${overlayClass} ${activePopup ? 'translate-y-0' : 'translate-y-full'}`}>
                    <div className={`${popupContentClass}`}>
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center space-x-2">
                                <h3 className="text-white text-xl font-bold uppercase">{coin}</h3>
                                <span className="bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded">BUY</span>
                            </div>
                            <button onClick={closePopup} className="text-gray-400 hover:text-white text-2xl">
                                &times;
                            </button>
                        </div>

                        <h4 className="text-gray-300 text-lg mb-3">Select Period</h4>
                        <div className={buttonGridClass}>
                            {['60s', '120s', '12h', '1d'].map((periodText, index) => {
                                const percentages = ['10%', '30%', '60%', '130%'];
                                const periodValue = periodText;
                                const isSelected = selectedPeriod === periodValue;
                                return (
                                    <button
                                        key={periodValue}
                                        className={`${baseInputButtonClass} ${isSelected ? 'bg-green-600' : 'bg-[#333] hover:bg-[#444]'}`}
                                        onClick={() => handlePeriodSelect(periodValue)}
                                    >
                                        {periodText}<br/>{percentages[index]}
                                    </button>
                                );
                            })}
                        </div>

                        <h4 className="text-gray-300 text-lg mt-6 mb-3">Purchase volume</h4>
                        <input
                            type="number"
                            placeholder="Least 1 USDT"
                            className="w-full p-3 bg-[#333] text-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                            value={purchaseVolume}
                            onChange={handleVolumeInputChange}
                        />

                        <div className={`${buttonGridClass} mt-4`}>
                            {[50, 100, 500, 1000, 2000, 5000, 10000, 20000].map(volumeNum => (
                                <button
                                    key={volumeNum}
                                    className={`${baseInputButtonClass} ${purchaseVolume === volumeNum.toString() ? 'bg-green-600' : 'bg-[#333] hover:bg-[#444]'}`}
                                    onClick={() => handleVolumeSelect(volumeNum)}
                                >
                                    {volumeNum}
                                </button>
                            ))}
                        </div>

                        <p className="text-gray-400 mt-6 text-sm">Available balance: <span className="text-white font-bold">0 USDT</span></p>

                        <button className="w-full bg-green-600 text-white py-4 mt-6 rounded text-lg font-bold hover:bg-green-700 transition-colors">
                            Confirm
                        </button>
                    </div>
                </div>
            )}

            {/* Sell Pop-up */}
            {activePopup === 'sell' && (
                <div className={`${overlayClass} ${activePopup ? 'translate-y-0' : 'translate-y-full'}`}>
                    <div className={`${popupContentClass}`}>
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center space-x-2">
                                <h3 className="text-white text-xl font-bold uppercase">{coin}</h3>
                                <span className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">SELL</span>
                            </div>
                            <button onClick={closePopup} className="text-gray-400 hover:text-white text-2xl">
                                &times;
                            </button>
                        </div>

                        <h4 className="text-gray-300 text-lg mb-3">Select Period</h4>
                        <div className={buttonGridClass}>
                            {['60s', '120s', '12h', '1d'].map((periodText, index) => {
                                const percentages = ['10%', '30%', '60%', '130%'];
                                const periodValue = periodText;
                                const isSelected = selectedPeriod === periodValue;
                                return (
                                    <button
                                        key={periodValue}
                                        className={`${baseInputButtonClass} ${isSelected ? 'bg-red-600' : 'bg-[#333] hover:bg-[#444]'}`}
                                        onClick={() => handlePeriodSelect(periodValue)}
                                    >
                                        {periodText}<br/>{percentages[index]}
                                    </button>
                                );
                            })}
                        </div>

                        <h4 className="text-gray-300 text-lg mt-6 mb-3">Purchase volume</h4>
                        <input
                            type="number"
                            placeholder="Least 1 USDT"
                            className="w-full p-3 bg-[#333] text-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                            value={purchaseVolume}
                            onChange={handleVolumeInputChange}
                        />

                        <div className={`${buttonGridClass} mt-4`}>
                            {[50, 100, 500, 1000, 2000, 5000, 10000, 20000].map(volumeNum => (
                                <button
                                    key={volumeNum}
                                    className={`${baseInputButtonClass} ${purchaseVolume === volumeNum.toString() ? 'bg-red-600' : 'bg-[#333] hover:bg-[#444]'}`}
                                    onClick={() => handleVolumeSelect(volumeNum)}
                                >
                                    {volumeNum}
                                </button>
                            ))}
                        </div>

                        <p className="text-gray-400 mt-6 text-sm">Available balance: <span className="text-white font-bold">0 USDT</span></p>

                        <button className="w-full bg-red-600 text-white py-4 mt-6 rounded text-lg font-bold hover:bg-red-700 transition-colors">
                            Confirm
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default BuySell;