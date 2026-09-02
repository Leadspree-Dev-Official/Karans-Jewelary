import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Ruler, Check, Info } from 'lucide-react';
import { motion } from 'motion/react';

export const RingSizeGuideModal: React.FC = () => {
  const { isSizeGuideOpen, setIsSizeGuideOpen } = useStore();
  const [measurementMm, setMeasurementMm] = useState<number>(54);

  if (!isSizeGuideOpen) return null;

  const sizeChart = [
    { us: '5', uk: 'J 1/2', indian: '9', insideDiameterMm: '15.7', insideCircumferenceMm: '49.3' },
    { us: '6', uk: 'L 1/2', indian: '11', insideDiameterMm: '16.5', insideCircumferenceMm: '51.9' },
    { us: '7', uk: 'N 1/2', indian: '14', insideDiameterMm: '17.3', insideCircumferenceMm: '54.4' },
    { us: '8', uk: 'P 1/2', indian: '16', insideDiameterMm: '18.1', insideCircumferenceMm: '57.0' },
    { us: '9', uk: 'R 1/2', indian: '18', insideDiameterMm: '18.9', insideCircumferenceMm: '59.5' },
    { us: '10', uk: 'T 1/2', indian: '20', insideDiameterMm: '19.8', insideCircumferenceMm: '62.1' },
    { us: '11', uk: 'V 1/2', indian: '22', insideDiameterMm: '20.6', insideCircumferenceMm: '64.6' },
    { us: '12', uk: 'X 1/2', indian: '25', insideDiameterMm: '21.4', insideCircumferenceMm: '67.2' },
  ];

  // Estimate closest size based on slider
  const matchedSize = sizeChart.reduce((prev, curr) => {
    return Math.abs(parseFloat(curr.insideCircumferenceMm) - measurementMm) <
      Math.abs(parseFloat(prev.insideCircumferenceMm) - measurementMm)
      ? curr
      : prev;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#E8D7D4] relative"
      >
        <button
          id="close-size-guide-modal-btn"
          onClick={() => setIsSizeGuideOpen(false)}
          className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2 text-[#C97A72] mb-1">
          <Ruler className="w-5 h-5" />
          <span className="text-xs uppercase tracking-widest font-bold">PRECISION JEWELLERY FITTING</span>
        </div>

        <h3 className="font-serif text-2xl font-bold text-[#2C1D1B] mb-2">
          Karan's Virtual Ring Sizer
        </h3>
        <p className="text-xs text-stone-500 mb-6 leading-relaxed">
          Find your exact ring size using our calibrated chart or interactive finger circumference estimator.
        </p>

        {/* Interactive Circumference Slider */}
        <div className="bg-[#FAF5F4] p-5 rounded-2xl border border-[#E8D7D4] mb-6 space-y-4">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-stone-800">Finger Circumference:</span>
            <span className="font-mono text-sm font-bold text-[#843933]">{measurementMm.toFixed(1)} mm</span>
          </div>

          <input
            type="range"
            min={48}
            max={68}
            step={0.5}
            value={measurementMm}
            onChange={(e) => setMeasurementMm(parseFloat(e.target.value))}
            className="w-full accent-[#D97D74] cursor-pointer"
          />

          <div className="bg-white p-3.5 rounded-xl border border-[#E8D7D4] flex items-center justify-between">
            <div className="text-xs text-stone-600">
              <span>Your Recommended Match:</span>
            </div>
            <div className="flex items-center space-x-3 text-xs font-bold">
              <span className="bg-[#2C1D1B] text-white px-2.5 py-1 rounded-md">US Size {matchedSize.us}</span>
              <span className="bg-[#FAF5F4] border border-[#E8D7D4] text-[#843933] px-2.5 py-1 rounded-md">Indian Size {matchedSize.indian}</span>
              <span className="text-stone-500 font-mono">({matchedSize.insideDiameterMm} mm Ø)</span>
            </div>
          </div>
        </div>

        {/* Full Size Comparison Table */}
        <div className="border border-[#E8D7D4] rounded-2xl overflow-hidden max-h-56 overflow-y-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#2C1D1B] text-[#E8A598] font-mono text-[11px]">
              <tr>
                <th className="px-4 py-2.5">US / Canada</th>
                <th className="px-4 py-2.5">Indian Standard</th>
                <th className="px-4 py-2.5">UK / Australia</th>
                <th className="px-4 py-2.5">Circumference (mm)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8D7D4]">
              {sizeChart.map(row => (
                <tr 
                  key={row.us}
                  className={`hover:bg-[#FAF5F4] transition ${
                    matchedSize.us === row.us ? 'bg-[#FFF2F0] font-semibold text-[#843933]' : 'text-stone-700'
                  }`}
                >
                  <td className="px-4 py-2.5 flex items-center space-x-1.5">
                    {matchedSize.us === row.us && <Check className="w-3.5 h-3.5 text-[#D97D74]" />}
                    <span>Size {row.us}</span>
                  </td>
                  <td className="px-4 py-2.5">Size {row.indian}</td>
                  <td className="px-4 py-2.5">{row.uk}</td>
                  <td className="px-4 py-2.5 font-mono">{row.insideCircumferenceMm} mm</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Free Resizing Assurance Note */}
        <div className="mt-5 flex items-center space-x-2 text-xs text-stone-500 bg-[#FFFBF0] p-3 rounded-xl border border-amber-200">
          <Info className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span>Rest easy — every ring purchase includes complimentary lifetime resizing with free insured return shipping.</span>
        </div>
      </motion.div>
    </div>
  );
};
