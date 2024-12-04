import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as faSolidStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as faRegularStar } from '@fortawesome/free-regular-svg-icons';

import React, { useState } from 'react';
import { SizeProp } from '@fortawesome/fontawesome-svg-core';
import { primaryColor } from '@/const/colors';

interface RatingStarsProps {
    rating?: number;
    maxRating?: number;
    size?: SizeProp;
    style?: React.CSSProperties;
    onClick: (n: number) => void;
}

const RatingStars = ({ rating, maxRating = 5, size = 'xl', style, onClick }: RatingStarsProps) => {
    const [newRating, setNewRating] = useState(rating || 0);

    const handleRatingChange = (r: number) => {
        setNewRating(r);
        onClick(r);
    };

    return (
        <div style={style}>
            {[...Array(maxRating)].map((_, i) => {
                return (
                    <FontAwesomeIcon
                        color={primaryColor}
                        key={i}
                        size={size}
                        icon={i < newRating ? faSolidStar : faRegularStar}
                        onClick={() => handleRatingChange(i + 1)}
                        style={{ cursor: 'pointer' }}
                    />
                );
            })}
        </div>
    );
};

export default RatingStars;
