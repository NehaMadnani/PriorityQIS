import React, { useState } from 'react';

interface Weights {
    ld: number;
    wealth: number;
    pop: number;
    lum: number;
}

interface Props {
    setWeights: (weights: Weights) => void;
}

const PriorityWeightSliders: React.FC<Props> = ({ setWeights }) => {
    const [weights, setLocalWeights] = useState<Weights>({ ld: 0.4, wealth: 0.25, pop: 0.2, lum: 0.15 });

    const handleSliderChange = (param: keyof Weights, value: number) => {
        const updatedWeights = { ...weights, [param]: value };
        setLocalWeights(updatedWeights);
        setWeights(updatedWeights);
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md max-w-md mx-auto space-y-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Adjust Priority Weights</h2>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                        Land Degradation Weight: <span className="text-blue-600 font-bold">{weights.ld}</span>
                    </label>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={weights.ld}
                        onChange={(e) => handleSliderChange("ld", parseFloat(e.target.value))}
                        className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                        Wealth Weight: <span className="text-blue-600 font-bold">{weights.wealth}</span>
                    </label>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={weights.wealth}
                        onChange={(e) => handleSliderChange("wealth", parseFloat(e.target.value))}
                        className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                        Population Trend Weight: <span className="text-blue-600 font-bold">{weights.pop}</span>
                    </label>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={weights.pop}
                        onChange={(e) => handleSliderChange("pop", parseFloat(e.target.value))}
                        className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                        Luminosity Weight: <span className="text-blue-600 font-bold">{weights.lum}</span>
                    </label>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={weights.lum}
                        onChange={(e) => handleSliderChange("lum", parseFloat(e.target.value))}
                        className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                </div>
            </div>
        </div>
    );
};

export default PriorityWeightSliders;
