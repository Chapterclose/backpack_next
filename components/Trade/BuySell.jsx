import { contextProvider } from '@/contexts/Context';
import TradeStore from '@/store/TradeStore';
import { useSearchParams } from 'next/navigation'; // Import useSearchParams
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import Button from '../Form/Button';

function BuySell({ coin }) {
    const [activePopup, setActivePopup] = useState(null);
    const [selectedPeriod, setSelectedPeriod] = useState(null);
    const [purchaseVolume, setPurchaseVolume] = useState('');
    const { walletAddress, connectWallet } = useContext(contextProvider);
    const {TradeBuySellRequest} = TradeStore()

    const periodButtonsContainerRef = useRef(null);
    const searchParams = useSearchParams(); // Initialize useSearchParams

    const closePopup = () => {
        setActivePopup(null);
        setSelectedPeriod(null);
        setPurchaseVolume('');
        if (periodButtonsContainerRef.current) {
            periodButtonsContainerRef.current.style.transform = 'translateX(0px)';
        }
    };

    const handlePeriodSelect = (period) => {
        setSelectedPeriod(period);
    };

    const handleVolumeSelect = (volume) => {
        setPurchaseVolume(volume.toString());
    };

    const handleVolumeInputChange = (e) => {
        const value = e.target.value;
        if (/^\d*\.?\d*$/.test(value) && parseFloat(value) >= 0) {
            setPurchaseVolume(value);
        } else if (value === '') { // Allow clearing the input
            setPurchaseVolume('');
        }
    };

    const allPeriods = useMemo(() => [
        { value: '60s', text: '60s', percentage: '10%' },
        { value: '120s', text: '120s', percentage: '30%' },
        { value: '12h', text: '12h', percentage: '60%' },
        { value: '1d', text: '1d', percentage: '130%' },
        { value: '7d', text: '7d', percentage: '250%' },
        { value: '15d', text: '15d', percentage: '400%' },
    ], []);

    useEffect(() => {
        if (!periodButtonsContainerRef.current) {
            return;
        }

        const container = periodButtonsContainerRef.current;
        const parentContainer = container.parentElement;

        const firstButton = container.children[0];
        if (!firstButton) return;

        const buttonWidth = firstButton.offsetWidth;
        const gapStyle = window.getComputedStyle(container).gap;
        let gap = 0;
        if (gapStyle) {
            gap = parseInt(gapStyle.split(' ')[0]) || 0;
        }

        const totalContentWidth = allPeriods.length * (buttonWidth + gap) - gap;
        const containerVisibleWidth = parentContainer.offsetWidth;

        let targetOffset = 0;
        const selectedIndex = allPeriods.findIndex(p => p.value === selectedPeriod);

        if (selectedIndex !== -1) {
            const desiredVisibleIndex = 1;
            const itemFullWidth = buttonWidth + gap;
            targetOffset = -(selectedIndex * itemFullWidth) + (desiredVisibleIndex * itemFullWidth);
        }

        const maxOffset = 0;
        const finalMinOffset = Math.min(0, containerVisibleWidth - totalContentWidth);

        targetOffset = Math.min(maxOffset, Math.max(finalMinOffset, targetOffset));

        container.style.transform = `translateX(${targetOffset}px)`;

    }, [selectedPeriod, allPeriods]);

    // **New function for handling confirmation**
    const handleConfirm = async (tradeType) => {
        const currentCoin = searchParams.get('coin') || coin; // Get coin from searchParams or prop
        const amount = parseFloat(purchaseVolume); // Convert volume to a number

        if (!selectedPeriod) {
            toast.error('Please select a period.');
            return;
        }

        if (isNaN(amount) || amount <= 0) {
            toast.error('Please enter a valid purchase volume (greater than 0).');
            return;
        }

        // Gather all data
        const tradeData = {
            trade_type: tradeType,
            asset: currentCoin.toUpperCase(), // Ensure asset is uppercase
            period: selectedPeriod,
            amount: amount,
        };
        await TradeBuySellRequest(tradeData)
        closePopup();
    };

    // --- Tailwind CSS Classes ---
    const overlayClass = "fixed inset-0 bg-black/40 dark:bg-black/50 bg-opacity-50 flex items-end justify-center z-50";
    const popupContentClass = "bg-[#1E1E1E] dark:bg-gray-900 w-full max-w-md p-4 lg:p-6 rounded-t-lg shadow-lg transform transition-transform duration-300 ease-out";
    const buttonGridClass = "grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mt-4";
    const scrollableContainerClass = "overflow-x-hidden";
    const periodButtonsWrapperClass = "flex flex-nowrap gap-2 md:gap-4 mt-4 transition-transform duration-300 ease-in-out";
    const baseInputButtonClass = "text-white py-3 px-2 sm:px-4 rounded text-center cursor-pointer transition-colors text-xs sm:text-sm md:text-base flex-shrink-0";


    return (
        <div>
            <Toaster position='top-center'/>
            <div className='mt-10 lg:mt-14'>
                {walletAddress === "" ?
                    <div className='text-center'>
                        <Button handleFunc={connectWallet} text={"Connect"} />
                    </div>
                    :
                    <div className='flex justify-center gap-x-4'>
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
                    </div>
                }
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
                        <div className={scrollableContainerClass}>
                            <div ref={periodButtonsContainerRef} className={periodButtonsWrapperClass}>
                                {allPeriods.map((period) => {
                                    const isSelected = selectedPeriod === period.value;
                                    return (
                                        <button
                                            key={period.value}
                                            className={`${baseInputButtonClass} ${isSelected ? 'bg-green-600' : 'bg-[#333] hover:bg-[#444]'}`}
                                            onClick={() => handlePeriodSelect(period.value)}
                                        >
                                            {period.text}<br />{period.percentage}
                                        </button>
                                    );
                                })}
                            </div>
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

                        <button
                            className="w-full bg-green-600 text-white py-4 mt-6 rounded text-lg font-bold hover:bg-green-700 transition-colors"
                            onClick={() => handleConfirm('buy')} // Call handleConfirm with 'buy'
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            )}

            {/* Sell Pop-up (identical structure to Buy) */}
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
                        <div className={scrollableContainerClass}>
                            <div ref={periodButtonsContainerRef} className={periodButtonsWrapperClass}>
                                {allPeriods.map((period) => {
                                    const isSelected = selectedPeriod === period.value;
                                    return (
                                        <button
                                            key={period.value}
                                            className={`${baseInputButtonClass} ${isSelected ? 'bg-red-600' : 'bg-[#333] hover:bg-[#444]'}`}
                                            onClick={() => handlePeriodSelect(period.value)}
                                        >
                                            {period.text}<br />{period.percentage}
                                        </button>
                                    );
                                })}
                            </div>
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

                        <button
                            className="w-full bg-red-600 text-white py-4 mt-6 rounded text-lg font-bold hover:bg-red-700 transition-colors"
                            onClick={() => handleConfirm('sell')} // Call handleConfirm with 'sell'
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default BuySell;