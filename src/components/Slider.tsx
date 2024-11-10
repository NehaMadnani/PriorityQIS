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
        <div>
            <label>Land Degradation Weight: {weights.ld}</label>
            <input type="range" min="0" max="1" step="0.01" value={weights.ld} onChange={(e) => handleSliderChange("ld", parseFloat(e.target.value))} />

            <label>Wealth Weight: {weights.wealth}</label>
            <input type="range" min="0" max="1" step="0.01" value={weights.wealth} onChange={(e) => handleSliderChange("wealth", parseFloat(e.target.value))} />

            <label>Population Trend Weight: {weights.pop}</label>
            <input type="range" min="0" max="1" step="0.01" value={weights.pop} onChange={(e) => handleSliderChange("pop", parseFloat(e.target.value))} />

            <label>Luminosity Weight: {weights.lum}</label>
            <input type="range" min="0" max="1" step="0.01" value={weights.lum} onChange={(e) => handleSliderChange("lum", parseFloat(e.target.value))} />
        </div>
    );
};

export default PriorityWeightSliders;
