import React from 'react';

const FeatureCard = ({ title, description, imageSrc, isLeftAligned }) => {
    return (
        <div className={`flex ${isLeftAligned ? 'flex-row' : 'flex-row-reverse'} items-center mb-8`}>
            {/* Image */}
            <div className="flex-1">
                <img
                    src={imageSrc}
                    alt={title}
                    className="w-full h-auto rounded-lg shadow-lg" // Ensure image is responsive and styled properly
                />
            </div>

            {/* Description */}
            <div className="flex-1 pl-6 pr-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">{title}</h3>
                <p className="text-gray-600">{description}</p>
            </div>
        </div>
    );
};

export default FeatureCard;
